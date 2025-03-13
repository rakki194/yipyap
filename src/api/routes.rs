use axum::{
    routing::{get, post, delete},
    Router,
};
use crate::{handlers::{images, captions, thumbnails}, DbPool};

pub fn create_router(pool: DbPool) -> Router {
    Router::new()
        .with_state(pool)
        // Image routes
        .route("/images/upload", post(images::upload_image))
        .route("/images/{id}", get(images::get_image))
        .route("/images/{id}", delete(images::delete_image))
        .route("/images/batch", post(images::batch_upload))
        
        // Directory browsing
        .route("/browse/{path}", get(images::browse_directory))
        .route("/preview/{id}", get(images::get_preview))
        
        // Thumbnail routes
        .route("/thumbnail/{id}", get(thumbnails::get_thumbnail))
        .route("/thumbnail/generate/{id}", post(thumbnails::generate_thumbnail))
        
        // Caption routes
        .route("/caption/{id}", get(captions::get_caption))
        .route("/caption/{id}", post(captions::update_caption))
        .route("/caption/generate/{id}", post(captions::generate_caption))
        .route("/caption/batch", post(captions::batch_update))
        
        // Asset routes
        .route("/assets/{path}", get(images::serve_asset))
}