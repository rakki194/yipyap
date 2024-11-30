// backend/src/handlers.rs

use actix_files::NamedFile;
use actix_web::{delete, get, put, web, HttpRequest, HttpResponse, Responder};
use serde::{Deserialize, Serialize};
use sqlx::SqlitePool;
use std::path::PathBuf;

use crate::models::{BrowseHeader, DeleteCaptionResponse};
use crate::utils::resolve_path;
use crate::data_access::CachedFileSystemDataSource;

/// Initializes all HTTP routes for the backend application.
///
/// # Arguments
///
/// * `cfg` - The Actix web service configuration.
///
/// # Example
///
/// ```rust
/// init_routes(&mut web::ServiceConfig::default());
/// ```
pub fn init_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(browse);
    cfg.service(delete_image);
    cfg.service(get_preview);
    cfg.service(download_image);
    cfg.service(get_config);
    cfg.service(update_caption);
    cfg.service(delete_caption);
    cfg.service(get_thumbnail);
}

/// Handles the `PUT /caption/{path}` endpoint to update a caption.
///
/// # Arguments
///
/// * `path` - The image path extracted from the URL.
/// * `caption_data` - The JSON payload containing caption information.
///
/// # Returns
///
/// An `HttpResponse` indicating the result of the operation.
#[put("/caption/{path:.*}")]
async fn update_caption(
    path: web::Path<String>,
    caption_data: web::Json<CaptionData>,
) -> impl Responder {
    log::debug!("Entering `update_caption` with path: {:?}", path);
    let root_dir = PathBuf::from("./datasets");
    let image_path = match resolve_path(&path, &root_dir) {
        Ok(p) => p,
        Err(e) => {
            log::error!("Path resolution failed: {:?}", e);
            return HttpResponse::BadRequest().body(e.to_string());
        },
    };

    let data_source = CachedFileSystemDataSource::new(root_dir, (300, 300), (1024, 1024));
    match data_source.delete_caption(&image_path, caption_data.caption_type.as_str()).await {
        Ok(_) => {
            log::info!("Successfully deleted caption of type '{}' for image: {:?}", caption_data.caption_type, image_path);
            HttpResponse::Ok().json(DeleteCaptionResponse {
                success: true,
                message: format!("Caption {} deleted successfully", caption_data.caption_type),
                path: image_path.with_extension(caption_data.caption_type.clone().as_str()).to_string_lossy().to_string(),
            })
        },
        Err(e) => {
            log::error!("Failed to delete caption: {:?}", e);
            HttpResponse::InternalServerError().body(e.to_string())
        },
    }
}

/// Represents the data structure for caption-related requests.
///
/// This struct is used to deserialize JSON payloads for caption operations.
#[derive(Deserialize)]
struct CaptionData {
    /// The type or category of the caption.
    #[serde(rename = "type")]
    caption_type: String,
}

/// Represents the response after updating a caption.
///
/// This struct is serialized to JSON and sent as an HTTP response.
#[derive(Serialize)]
struct UpdateCaptionResponse {
    /// Indicates whether the operation was successful.
    success: bool,
    /// A message describing the result.
    message: String,
    /// The path to the affected file.
    path: String,
}

/// Handles the `GET /config` endpoint to retrieve configuration settings.
///
/// # Arguments
///
/// * `_pool` - The SQLite connection pool (unused).
///
/// # Returns
///
/// An `HttpResponse` containing configuration details in JSON format.
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

/// Represents the configuration settings sent in responses.
///
/// Includes sizes for thumbnails and preview images.
#[derive(Serialize)]
struct ConfigResponse {
    /// The dimensions for thumbnails.
    thumbnail_size: (u32, u32),
    /// The dimensions for preview images.
    preview_size: (u32, u32),
}

/// Handles the `GET /download/{path}` endpoint to download an image.
///
/// # Arguments
///
/// * `path` - The image path extracted from the URL.
/// * `req` - The HTTP request.
///
/// # Returns
///
/// An `HttpResponse` that serves the requested file or an error message.
#[get("/download/{path:.*}")]
async fn download_image(
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

/// Handles the `GET /preview/{path}` endpoint to retrieve a preview image.
///
/// # Arguments
///
/// * `path` - The image path extracted from the URL.
///
/// # Returns
///
/// An `HttpResponse` containing the preview image or an error message.
#[get("/preview/{path:.*}")]
async fn get_preview(
    path: web::Path<String>,
) -> impl Responder {
    log::debug!("Entering `get_preview` with path: {:?}", path);
    let root_dir = PathBuf::from("./datasets");
    let image_path = match resolve_path(&path, &root_dir) {
        Ok(p) => p,
        Err(e) => {
            log::error!("Path resolution failed: {:?}", e);
            return HttpResponse::BadRequest().body(e.to_string());
        },
    };

    let data_source = CachedFileSystemDataSource::new(root_dir, (300, 300), (1024, 1024));
    match data_source.get_preview(image_path.as_path()).await {
        Ok(Some(preview_data)) => {
            log::info!("Preview found for image: {:?}", image_path);
            HttpResponse::Ok()
                .content_type("image/webp")
                .insert_header(("Cache-Control", "public, max-age=31536000"))
                .body(preview_data)
        }
        Ok(None) => {
            log::warn!("No preview found for image: {:?}", image_path);
            HttpResponse::NotFound().body("Preview not found")
        },
        Err(e) => {
            log::error!("Error retrieving preview: {:?}", e);
            HttpResponse::InternalServerError().body(e.to_string())
        },
    }
}

/// Handles the `DELETE /api/caption/{path}` endpoint to delete a specific caption.
///
/// # Arguments
///
/// * `path` - The image path extracted from the URL.
/// * `caption_type` - The type/category of the caption to delete.
///
/// # Returns
///
/// An `HttpResponse` indicating the result of the deletion.
#[delete("/api/caption/{path:.*}")]
async fn delete_caption(
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

/// Represents the type/category of a caption.
///
/// This struct is used to deserialize query parameters for caption operations.
#[derive(Deserialize, Clone, Debug)]
struct CaptionType(String);

impl AsRef<str> for CaptionType {
    fn as_ref(&self) -> &str {
        &self.0
    }
}

/// Handles the `DELETE /api/browse/{path}` endpoint to delete an image.
///
/// # Arguments
///
/// * `path` - The image path extracted from the URL.
/// * `confirm` - Query parameter to confirm deletion.
///
/// # Returns
///
/// An `HttpResponse` indicating the result of the deletion.
#[delete("/api/browse/{path:.*}")]
async fn delete_image(
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

/// Represents the confirmation status for deletion operations.
///
/// This struct is used to deserialize query parameters for image deletion.
#[derive(Deserialize)]
struct Confirm {
    /// Indicates whether the deletion is confirmed.
    confirm: bool,
}

/// Represents the response after deleting an image.
///
/// Includes details about the deletion confirmation, removed captions, and deleted files.
#[derive(Serialize)]
struct DeleteImageResponse {
    /// Whether the deletion was confirmed.
    confirm: bool,
    /// A list of deleted caption types.
    deleted_suffixes: Vec<String>,
    /// A list of deleted file paths.
    deleted_files: Vec<String>,
}

/// Handles the `GET /api/browse` endpoint to browse directory contents.
///
/// # Arguments
///
/// * `query` - The query parameters containing path and pagination info.
///
/// # Returns
///
/// An `HttpResponse` containing directory and image information in JSON format.
#[get("/api/browse")]
async fn browse(
    query: web::Query<BrowseQuery>,
) -> impl Responder {
    let path = &query.path;
    let page = query.page;

    let root_dir = PathBuf::from("./datasets"); // You might want to pass this as a config

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

/// Represents the query parameters for browsing directories.
///
/// Includes the target path and pagination details.
#[derive(Deserialize)]
pub struct BrowseQuery {
    /// The directory path to browse.
    pub path: String,
    /// The current page number.
    #[serde(default = "default_page")]
    pub page: u32,
    /// The number of items per page.
    #[serde(default = "default_page_size")]
    pub page_size: u32,
}

fn default_page() -> u32 {
    1
}

fn default_page_size() -> u32 {
    50
}

/// Handles the `GET /thumbnail/{path}` endpoint to retrieve a thumbnail image.
///
/// # Arguments
///
/// * `data_source` - Shared data source with caching capabilities.
/// * `path` - The image path extracted from the URL.
///
/// # Returns
///
/// An `HttpResponse` containing the thumbnail image or an error message.
#[get("/thumbnail/{path:.*}")]
async fn get_thumbnail(
    data_source: web::Data<CachedFileSystemDataSource>,
    path: web::Path<String>,
) -> impl Responder {
    let root_dir = &data_source.root_dir;
    let image_path = match resolve_path(&path, root_dir) {
        Ok(p) => p,
        Err(e) => return HttpResponse::BadRequest().body(e.to_string()),
    };

    match data_source.get_thumbnail(&image_path).await {
        Ok(Some(thumbnail_data)) => HttpResponse::Ok()
            .content_type("image/webp")
            .insert_header(("Cache-Control", "public, max-age=31536000"))
            .body(thumbnail_data),
        Ok(None) => HttpResponse::NotFound().body("Thumbnail not found"),
        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
    }
}
