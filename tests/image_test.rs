use axum::{
    body::Body,
    http::{Request, StatusCode, header},
};
use tower::ServiceExt;
use crate::fixtures::TestContext;

#[tokio::test]
async fn test_image_upload() {
    let ctx = TestContext::new();
    let app = yipyap::api::routes::create_router();
    
    // Create test image data
    let boundary = "test_boundary";
    let body = format!(
        "--{boundary}\r\n\
         Content-Disposition: form-data; name=\"file\"; filename=\"test.jpg\"\r\n\
         Content-Type: image/jpeg\r\n\r\n\
         [binary data]\r\n\
         --{boundary}--\r\n",
    );

    let response = app
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/images/upload")
                .header(
                    header::CONTENT_TYPE,
                    format!("multipart/form-data; boundary={boundary}"),
                )
                .body(Body::from(body))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(response.status(), StatusCode::OK);
}