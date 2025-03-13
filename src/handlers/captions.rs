use axum::{
    extract::Path,
    response::IntoResponse,
    http::StatusCode,
};

pub async fn get_caption(Path(_id): Path<String>) -> impl IntoResponse {
    StatusCode::NOT_FOUND
}

pub async fn update_caption(Path(_id): Path<String>) -> impl IntoResponse {
    StatusCode::NOT_FOUND
}

pub async fn generate_caption(Path(_id): Path<String>) -> impl IntoResponse {
    StatusCode::NOT_FOUND
}

pub async fn batch_update() -> impl IntoResponse {
    StatusCode::NOT_IMPLEMENTED
}