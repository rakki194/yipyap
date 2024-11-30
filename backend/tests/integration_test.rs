// backend/tests/integration_test.rs

use actix_web::{test, web, App};
use backend::handlers::{init_routes, ConfigResponse};
use backend::data_access::CachedFileSystemDataSource;
use tempfile::tempdir;

#[actix_web::test]
async fn test_browse_endpoint() {
    let dir = tempdir().unwrap();
    let root_dir = dir.path().to_path_buf();
    let data_source = CachedFileSystemDataSource::new(root_dir.clone(), (300, 300), (1024, 1024));

    let app = test::init_service(
        App::new()
            .app_data(web::Data::new(data_source))
            .configure(backend::handlers::init_routes)
    ).await;

    let req = test::TestRequest::get()
        .uri("/api/browse?path=/&page=1&page_size=10")
        .to_request();

    let resp: backend::models::BrowseHeader = test::call_and_read_body_json(&app, req).await;
    assert_eq!(resp.page, 1);
    assert_eq!(resp.pages, 1);
    assert_eq!(resp.folders.len(), 2);
    assert_eq!(resp.images.len(), 2);
}
