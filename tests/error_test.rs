use axum::{
    response::IntoResponse,
    http::StatusCode,
};
use yipyap::error::AppError;

#[test]
fn test_error_responses() {
    // Test NotFound error
    let err = AppError::NotFound("Image not found".to_string());
    let response = err.into_response();
    assert_eq!(response.status(), StatusCode::NOT_FOUND);

    // Test InvalidInput error
    let err = AppError::InvalidInput("Invalid file format".to_string());
    let response = err.into_response();
    assert_eq!(response.status(), StatusCode::BAD_REQUEST);
}