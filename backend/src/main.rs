use actix_cors::Cors;
//use actix_files::Files;
use actix_web::{middleware::Logger, web, App, HttpServer};
use env_logger::Env;
use std::env;
use std::fs;
use std::path::PathBuf;

mod handlers;
mod models;
mod utils;
mod data_access;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // Initialize logger
    env_logger::Builder::from_env(Env::default().default_filter_or("info")).init();

    // Load environment variables
    let root_dir = PathBuf::from(env::var("ROOT_DIR").unwrap_or_else(|_| "./datasets".to_string()));
    let is_dev = env::var("ENVIRONMENT").unwrap_or_else(|_| "development".to_string()) == "development";
    let frontend_port: u16 = env::var("FRONTEND_PORT")
        .unwrap_or_else(|_| "3000".to_string())
        .parse()
        .expect("FRONTEND_PORT must be a number");
    let backend_port: u16 = env::var("BACKEND_PORT")
        .unwrap_or_else(|_| "8080".to_string())
        .parse()
        .expect("BACKEND_PORT must be a number");

    // Ensure root_dir exists
    fs::create_dir_all(&root_dir).expect("Failed to create root directory");

    // Initialize data source
    let data_source = data_access::CachedFileSystemDataSource::new(root_dir, (300, 300), (1024, 1024));

    HttpServer::new(move || {
        // Configure CORS
        let cors = if is_dev {
            Cors::default()
                .allowed_origin(format!("http://localhost:{frontend_port}").as_str())
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
            .app_data(web::Data::new(data_source.clone()))
            .configure(handlers::init_routes)
            // ⚠️ NOTE: This is not really needed for the backend, we think. :3
            //.service(Files::new("/static", "./static").show_files_listing())
    })
    .bind(("0.0.0.0", backend_port))?
    .run()
    .await
}
