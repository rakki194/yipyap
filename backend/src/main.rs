use actix_cors::Cors;
use actix_files::Files;
use actix_web::{middleware::Logger, web, App, HttpServer};
use env_logger::Env;
use std::env;
use std::fs;

mod handlers;
mod models;
mod utils;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // Initialize logger
    env_logger::Builder::from_env(Env::default().default_filter_or("info")).init();

    // Load environment variables
    let root_dir = env::var("ROOT_DIR").unwrap_or_else(|_| "./datasets".to_string());
    let is_dev = env::var("ENVIRONMENT").unwrap_or_else(|_| "development".to_string()) == "development";
    let backend_port: u16 = env::var("BACKEND_PORT")
        .unwrap_or_else(|_| "8080".to_string())
        .parse()
        .expect("BACKEND_PORT must be a number");

    // Ensure root_dir exists
    fs::create_dir_all(&root_dir).expect("Failed to create root directory");

    // Initialize database (using SQLx)
    let db_pool = match sqlx::SqlitePool::connect(&format!("sqlite://{}/cache.db", root_dir)).await {
        Ok(pool) => pool,
        Err(e) => {
            log::error!("Failed to connect to the database: {}", e);
            std::process::exit(1);
        }
    };

    // Initialize image_info table
    sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS image_info (
            directory TEXT NOT NULL,
            name TEXT NOT NULL,
            info TEXT NOT NULL,
            cache_time INTEGER NOT NULL,
            thumbnail_webp BLOB NOT NULL,
            deleted INTEGER NOT NULL DEFAULT 0,
            PRIMARY KEY (directory, name)
        )
        "#,
    )
    .execute(&db_pool)
        .await
        .expect("Failed to create image_info table");

    HttpServer::new(move || {
        // Configure CORS
        let cors = if is_dev {
            Cors::default()
                .allowed_origin("http://localhost:3000")
                .allowed_methods(vec!["GET", "POST", "PUT", "DELETE"])
                .allowed_headers(vec![actix_web::http::header::CONTENT_TYPE])
                .supports_credentials()
        } else {
            Cors::default()
                .allow_any_origin()
                .allowed_methods(vec!["GET", "POST", "PUT", "DELETE"])
                .allowed_headers(vec![actix_web::http::header::CONTENT_TYPE])
        };

        App::new()
            .wrap(Logger::default())
            .wrap(cors)
            .app_data(web::Data::new(db_pool.clone()))
            .configure(handlers::init_routes)
            .service(Files::new("/static", "./static").show_files_listing())
    })
    .bind(("0.0.0.0", backend_port))?
    .run()
    .await
}
