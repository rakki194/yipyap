use chrono::Utc;
use rusqlite::Connection;
use yipyap::models::image::Image;

#[test]
fn test_create_and_find_image() {
    let conn = Connection::open_in_memory().unwrap();
    
    // Create tables
    conn.execute(
        "CREATE TABLE images (
            id INTEGER PRIMARY KEY,
            file_path TEXT NOT NULL,
            file_name TEXT NOT NULL,
            mime_type TEXT NOT NULL,
            file_size INTEGER NOT NULL,
            created_at INTEGER NOT NULL,
            updated_at INTEGER NOT NULL,
            caption TEXT
        )",
        [],
    ).unwrap();

    let now = Utc::now();
    let image = Image {
        id: 0,
        file_path: "/test/path".to_string(),
        file_name: "test.jpg".to_string(),
        mime_type: "image/jpeg".to_string(),
        file_size: 1024,
        created_at: now,
        updated_at: now,
        caption: Some("Test image".to_string()),
        tags: vec![],
    };

    let id = Image::create(&conn, &image).unwrap();
    let found = Image::find_by_id(&conn, id).unwrap().unwrap();

    assert_eq!(found.file_path, image.file_path);
    assert_eq!(found.file_name, image.file_name);
    assert_eq!(found.mime_type, image.mime_type);
}