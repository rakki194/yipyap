use axum::{
    extract::Path,
    response::IntoResponse,
    http::StatusCode,
};

pub async fn get_thumbnail(Path(_id): Path<String>) -> impl IntoResponse {
    StatusCode::NOT_FOUND
}

pub async fn generate_thumbnail(Path(_id): Path<String>) -> impl IntoResponse {
    StatusCode::NOT_FOUND
}