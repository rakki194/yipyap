use axum::{
    extract::{Multipart, Path},
    response::{IntoResponse, Response},
    Json,
};
use hyper::StatusCode;
use image::{ImageFormat, DynamicImage};
use std::path::PathBuf;
use crate::{error::AppError, models::image::Image, DbPool};

pub async fn upload_image(
    pool: axum::extract::State<DbPool>,
    mut multipart: Multipart,
) -> Result<impl IntoResponse, AppError> {
    while let Some(field) = multipart.next_field().await? {
        let file_name = field.file_name().map(String::from).ok_or_else(|| {
            AppError::InvalidInput("Missing filename".into())
        })?;
        
        let data = field.bytes().await?;
        let img = image::load_from_memory(&data)?;
        
        // Save image to disk
        let file_path = save_image(&file_name, &img)?;
        
        // Create database record
        let conn = pool.get()?;
        let image = Image::create(&conn, &Image {
            id: 0,
            file_path: file_path.to_string_lossy().into_owned(),
            file_name,
            mime_type: "image/jpeg".to_string(), // TODO: Detect mime type
            file_size: data.len() as i64,
            created_at: chrono::Utc::now(),
            updated_at: chrono::Utc::now(),
            caption: None,
            tags: vec![],
        })?;
        
        return Ok(Json(image));
    }
    
    Err(AppError::InvalidInput("No file uploaded".into()))
}

fn save_image(file_name: &str, img: &DynamicImage) -> Result<PathBuf, AppError> {
    let uploads_dir = std::env::var("UPLOADS_DIR")
        .unwrap_or_else(|_| "uploads".to_string());
    
    std::fs::create_dir_all(&uploads_dir)?;
    
    let file_path = PathBuf::from(uploads_dir).join(file_name);
    img.save(&file_path)?;
    
    Ok(file_path)
}

pub async fn get_image(Path(_id): Path<String>) -> impl IntoResponse {
    StatusCode::NOT_FOUND
}

pub async fn delete_image(Path(_id): Path<String>) -> impl IntoResponse {
    StatusCode::NOT_FOUND
}

pub async fn batch_upload() -> impl IntoResponse {
    StatusCode::NOT_IMPLEMENTED
}

pub async fn browse_directory(Path(_path): Path<String>) -> impl IntoResponse {
    StatusCode::NOT_FOUND
}

pub async fn get_preview(Path(_id): Path<String>) -> impl IntoResponse {
    StatusCode::NOT_FOUND
}

pub async fn serve_asset(Path(_path): Path<String>) -> impl IntoResponse {
    StatusCode::NOT_FOUND
}