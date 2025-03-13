use axum::{
    body::Body,
    http::{Request, StatusCode},
};
use tower::ServiceExt;
use yipyap::{api::routes, db::pool::create_pool};

async fn test_route(method: &str, uri: &str) -> axum::response::Response {
    let pool = create_pool(":memory:").unwrap();
    let app = routes::create_router(pool);
    app.oneshot(
        Request::builder()
            .method(method)
            .uri(uri)
            .body(Body::empty())
            .unwrap(),
    )
    .await
    .unwrap()
}

#[tokio::test]
async fn test_search_endpoint() {
    let response = test_route("GET", "/search?q=test&page=1").await;
    assert_eq!(response.status(), StatusCode::NOT_FOUND);
}

#[tokio::test]
async fn test_browse_directory() {
    let response = test_route("GET", "/browse/test_dir").await;
    assert_eq!(response.status(), StatusCode::OK);
}

#[tokio::test]
async fn test_image_upload() {
    let response = test_route("POST", "/images/upload").await;
    assert_eq!(response.status(), StatusCode::OK);
}

#[tokio::test]
async fn test_image_routes() {
    let response = test_route("GET", "/images/1").await;
    assert_eq!(response.status(), StatusCode::NOT_FOUND);

    let response = test_route("DELETE", "/images/1").await;
    assert_eq!(response.status(), StatusCode::NOT_FOUND);
}

#[tokio::test]
async fn test_thumbnail_routes() {
    let response = test_route("GET", "/thumbnail/1").await;
    assert_eq!(response.status(), StatusCode::NOT_FOUND);

    let response = test_route("POST", "/thumbnail/generate/1").await;
    assert_eq!(response.status(), StatusCode::NOT_FOUND);
}

#[tokio::test]
async fn test_caption_routes() {
    let response = test_route("GET", "/caption/1").await;
    assert_eq!(response.status(), StatusCode::NOT_FOUND);

    let response = test_route("POST", "/caption/generate/1").await;
    assert_eq!(response.status(), StatusCode::NOT_FOUND);
}

#[tokio::test]
async fn test_browse_routes() {
    let response = test_route("GET", "/browse/test_dir").await;
    assert_eq!(response.status(), StatusCode::NOT_FOUND);

    let response = test_route("GET", "/preview/1").await;
    assert_eq!(response.status(), StatusCode::NOT_FOUND);
}