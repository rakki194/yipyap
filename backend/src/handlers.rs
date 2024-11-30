use actix_files::NamedFile;
use actix_web::{delete, get, put, web, HttpRequest, HttpResponse, Responder};
use serde::{Deserialize, Serialize};
use sqlx::SqlitePool;
use std::path::PathBuf;
use std::path::Path;
use sqlx::Row;

use crate::models::{BrowseHeader, DeleteCaptionResponse, DirectoryModel, ImageModel};
use crate::utils::{get_human_readable_size, resolve_path};

pub struct CachedFileSystemDataSource {
    root_dir: PathBuf,
    thumbnail_size: (u32, u32),
    preview_size: (u32, u32),
    db_pool: SqlitePool,
}

impl CachedFileSystemDataSource {
    pub fn new(root_dir: PathBuf, thumbnail_size: (u32, u32), preview_size: (u32, u32)) -> Self {
        // Initialize SQLx pool and other necessary setups
        let db_path = root_dir.join("cache.db");
        let db_pool = sqlx::SqlitePool::connect_lazy(&format!("sqlite://{}", db_path.to_string_lossy()))
            .expect("Failed to create SQLite pool");
        
        Self {
            root_dir,
            thumbnail_size,
            preview_size,
            db_pool,
        }
    }

    /// Save a caption to a file and update the cache
    pub async fn save_caption(&self, path: &Path, caption: &str, caption_type: &str) -> Result<(), anyhow::Error> {
        sqlx::query(
            "INSERT INTO captions (path, caption, caption_type) VALUES (?1, ?2, ?3)",
        )
        .bind(path.to_string_lossy())
        .bind(caption)
        .bind(caption_type)
        .execute(&self.db_pool)
        .await?;
        Ok(())
    }

    /// Delete a specific caption and update the cache
    pub async fn delete_caption(&self, path: &Path, caption_type: &str) -> Result<(), anyhow::Error> {
        sqlx::query(
            "DELETE FROM captions WHERE path = ?1 AND caption_type = ?2",
        )
        .bind(path.to_string_lossy())
        .bind(caption_type)
        .execute(&self.db_pool)
        .await?;
        Ok(())
    }

    /// Delete an image and its associated caption files
    pub async fn delete_image(&self, path: &Path, confirm: bool) -> Result<(Vec<String>, Vec<String>), anyhow::Error> {
        if confirm {
            sqlx::query(
                "DELETE FROM images WHERE path = ?1",
            )
            .bind(path.to_string_lossy())
            .execute(&self.db_pool)
            .await?;

            let captions = sqlx::query(
                "SELECT caption_type FROM captions WHERE path = ?1",
            )
            .bind(path.to_string_lossy())
            .fetch_all(&self.db_pool)
            .await?
            .into_iter()
            .map(|record| record.get::<String, _>("caption_type"))
            .collect();

            sqlx::query(
                "DELETE FROM captions WHERE path = ?1",
            )
            .bind(path.to_string_lossy())
            .execute(&self.db_pool)
            .await?;

            let deleted_files = vec![path.to_string_lossy().to_string()];
            return Ok((captions, deleted_files));
        }
        Err(anyhow::anyhow!("Deletion not confirmed"))
    }

    pub async fn get_preview(&self, path: &Path) -> Result<Option<Vec<u8>>, anyhow::Error> {
        let record = sqlx::query(
            "SELECT preview_data FROM previews WHERE path = ?1",
        )
        .bind(path.to_string_lossy())
        .fetch_optional(&self.db_pool)
        .await?;

        if let Some(r) = record {
            Ok(Some(r.get::<Vec<u8>, _>("preview_data")))
        } else {
            Ok(None)
        }
    }
}

// Initialize all routes
pub fn init_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(browse);
    // Add other services like delete_image, get_thumbnail, etc.
}

#[put("/caption/{path:.*}")]
async fn update_caption(
    _pool: web::Data<SqlitePool>,
    path: web::Path<String>,
    caption_data: web::Json<CaptionData>,
) -> impl Responder {
    let root_dir = PathBuf::from("./datasets");
    let image_path = match resolve_path(&path, &root_dir) {
        Ok(p) => p,
        Err(e) => return HttpResponse::BadRequest().body(e.to_string()),
    };

    let data_source = CachedFileSystemDataSource::new(root_dir, (300, 300), (1024, 1024));
    match data_source.delete_caption(&image_path, caption_data.caption_type.as_str()).await {
        Ok(_) => HttpResponse::Ok().json(DeleteCaptionResponse {
            success: true,
            message: format!("Caption {} deleted successfully", caption_data.caption_type),
            path: image_path.with_extension(caption_data.caption_type.clone().as_str()).to_string_lossy().to_string(),
        }),
        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
    }
}

#[derive(Deserialize)]
struct CaptionData {
    #[serde(rename = "type")]
    caption_type: String,
}

#[derive(Serialize)]
struct UpdateCaptionResponse {
    success: bool,
    message: String,
    path: String,
}

#[get("/config")]
async fn get_config(
    _pool: web::Data<SqlitePool>,
) -> impl Responder {
    let root_dir = PathBuf::from("./datasets");
    let data_source = CachedFileSystemDataSource::new(root_dir, (300, 300), (1024, 1024));
    let config = ConfigResponse {
        thumbnail_size: data_source.thumbnail_size,
        preview_size: data_source.preview_size,
    };
    HttpResponse::Ok().json(config)
}

#[derive(Serialize)]
struct ConfigResponse {
    thumbnail_size: (u32, u32),
    preview_size: (u32, u32),
}

#[get("/download/{path:.*}")]
async fn download_image(
    pool: web::Data<SqlitePool>,
    path: web::Path<String>,
    req: HttpRequest,
) -> impl Responder {
    let root_dir = PathBuf::from("./datasets");
    let image_path = match resolve_path(&path, &root_dir) {
        Ok(p) => p,
        Err(_) => return HttpResponse::BadRequest().body("Invalid path"),
    };

    match NamedFile::open(image_path.clone()) {
        Ok(file) => file
            .use_last_modified(true)
            .set_content_disposition(actix_web::http::header::ContentDisposition {
                disposition: actix_web::http::header::DispositionType::Attachment,
                parameters: vec![actix_web::http::header::DispositionParam::Filename(
                    image_path.file_name()
                        .and_then(|n| n.to_str())
                        .unwrap_or("download")
                        .to_string(),
                )],
            })
            .into_response(&req),
        Err(_) => HttpResponse::NotFound().body("File not found"),
    }
}

#[get("/preview/{path:.*}")]
async fn get_preview(
    pool: web::Data<SqlitePool>,
    path: web::Path<String>,
) -> impl Responder {
    let root_dir = PathBuf::from("./datasets");
    let image_path = match resolve_path(&path, &root_dir) {
        Ok(p) => p,
        Err(e) => return HttpResponse::BadRequest().body(e.to_string()),
    };

    let data_source = CachedFileSystemDataSource::new(root_dir, (300, 300), (1024, 1024));
    match data_source.get_preview(image_path.as_path()).await {
        Ok(Some(preview_data)) => {
            HttpResponse::Ok()
                .content_type("image/webp")
                .insert_header(("Cache-Control", "public, max-age=31536000"))
                .body(preview_data)
        }
        Ok(None) => HttpResponse::NotFound().body("Preview not found"),
        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
    }
}

#[delete("/api/caption/{path:.*}")]
async fn delete_caption(
    pool: web::Data<SqlitePool>,
    path: web::Path<String>,
    caption_type: web::Query<CaptionType>,
) -> impl Responder {
    let root_dir = PathBuf::from("./datasets");
    let image_path = match resolve_path(&path, &root_dir) {
        Ok(p) => p,
        Err(e) => return HttpResponse::BadRequest().body(e.to_string()),
    };

    let data_source = CachedFileSystemDataSource::new(root_dir, (300, 300), (1024, 1024));
    match data_source.delete_caption(image_path.as_path(), caption_type.as_ref()).await {
        Ok(_) => HttpResponse::Ok().json(DeleteCaptionResponse {
            success: true,
            message: format!("Caption {} deleted successfully", caption_type.as_ref()),
            path: image_path.with_extension(caption_type.as_ref()).to_str().unwrap_or("").to_string(),
        }),
        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
    }
}

#[derive(Deserialize, Clone, Debug)]
struct CaptionType(String);

impl AsRef<str> for CaptionType {
    fn as_ref(&self) -> &str {
        &self.0
    }
}

#[derive(Deserialize)]
struct Confirm {
    confirm: bool,
}

#[delete("/api/browse/{path:.*}")]
async fn delete_image(
    pool: web::Data<SqlitePool>,
    path: web::Path<String>,
    confirm: web::Query<Confirm>,
) -> impl Responder {
    let root_dir = PathBuf::from("./datasets"); // Adjust as needed
    let image_path = match resolve_path(&path, &root_dir) {
        Ok(p) => p,
        Err(e) => return HttpResponse::BadRequest().body(e.to_string()),
    };

    let data_source = CachedFileSystemDataSource::new(root_dir, (300, 300), (1024, 1024));
    match data_source.delete_image(image_path.as_path(), confirm.confirm).await {
        Ok((captions, files)) => {
            HttpResponse::Ok().json(DeleteImageResponse {
                confirm: confirm.confirm,
                deleted_suffixes: captions,
                deleted_files: files,
            })
        }
        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
    }
}

#[derive(Serialize)]
struct DeleteImageResponse {
    confirm: bool,
    deleted_suffixes: Vec<String>,
    deleted_files: Vec<String>,
}

#[get("/api/browse")]
async fn browse(
    pool: web::Data<SqlitePool>,
    req: HttpRequest,
    query: web::Query<BrowseQuery>,
) -> impl Responder {
    let path = &query.path;
    let page = query.page;
    let page_size = query.page_size;

    let root_dir = PathBuf::from("./datasets"); // You might want to pass this as a config
    let target_path = resolve_path(path, &root_dir);

    // TODO: Implement If-Modified-Since handling

    // Fetch directory contents
    let browse_header = BrowseHeader {
        mtime: "2023-10-10T10:00:00Z".to_string(), // Placeholder
        page,
        pages: 1,
        folders: vec!["folder1".to_string(), "folder2".to_string()],
        images: vec!["image1.jpg".to_string(), "image2.png".to_string()],
        total_folders: 2,
        total_images: 2,
    };

    HttpResponse::Ok().json(browse_header)
}

#[derive(Deserialize)]
pub struct BrowseQuery {
    pub path: String,
    #[serde(default = "default_page")]
    pub page: u32,
    #[serde(default = "default_page_size")]
    pub page_size: u32,
}

fn default_page() -> u32 {
    1
}

fn default_page_size() -> u32 {
    50
}
