use yipyap::error::AppError;
use axum::http::StatusCode;

pub async fn assert_error_response(error: AppError, expected_status: StatusCode) {
    let response = error.into_response();
    assert_eq!(response.status(), expected_status);
}

pub fn create_test_db() -> rusqlite::Connection {
    let conn = rusqlite::Connection::open_in_memory().unwrap();
    // Add test schema setup here
    conn
}