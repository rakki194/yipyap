use axum::{
    http::StatusCode,
    response::{IntoResponse, Response},
};
use thiserror::Error;
use tracing::{error, warn};

#[derive(Error, Debug)]
pub enum AppError {
    #[error("Database error: {0}")]
    Database(#[from] rusqlite::Error),

    #[error("Image processing error: {0}")]
    ImageProcessing(#[from] image::ImageError),

    #[error("Multipart error: {0}")]
    Multipart(#[from] axum::extract::multipart::MultipartError),

    #[error("Pool error: {0}")]
    Pool(#[from] r2d2::Error),

    #[error("Not found: {0}")]
    NotFound(String),

    #[error("Invalid input: {0}")]
    InvalidInput(String),

    #[error("Internal server error: {0}")]
    Internal(#[from] anyhow::Error),

    #[error("IO error: {0}")]
    Io(#[from] std::io::Error),
}

impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        let (status, message) = match &self {
            AppError::Database(err) => {
                error!(error = ?err, "Database error occurred");
                (StatusCode::INTERNAL_SERVER_ERROR, self.to_string())
            }
            AppError::ImageProcessing(err) => {
                error!(error = ?err, "Image processing error occurred");
                (StatusCode::BAD_REQUEST, self.to_string())
            }
            AppError::NotFound(msg) => {
                warn!(message = msg, "Resource not found");
                (StatusCode::NOT_FOUND, self.to_string())
            }
            AppError::InvalidInput(msg) => {
                warn!(message = msg, "Invalid input received");
                (StatusCode::BAD_REQUEST, self.to_string())
            }
            AppError::Internal(err) => {
                error!(error = ?err, "Internal server error occurred");
                (StatusCode::INTERNAL_SERVER_ERROR, self.to_string())
            }
            AppError::Io(err) => {
                error!(error = ?err, "IO error occurred");
                (StatusCode::INTERNAL_SERVER_ERROR, self.to_string())
            }
        };

        let body = serde_json::json!({
            "error": message,
            "status": status.as_u16()
        });

        (status, axum::Json(body)).into_response()
    }
}

pub type Result<T> = std::result::Result<T, AppError>;