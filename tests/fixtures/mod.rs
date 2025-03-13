use rusqlite::Connection;
use tempfile::TempDir;
use std::env;

pub struct TestContext {
    pub db: Connection,
    pub uploads_dir: TempDir,
}

impl TestContext {
    pub fn new() -> Self {
        let db = Connection::open_in_memory().unwrap();
        let uploads_dir = TempDir::new().unwrap();
        
        // Set up test environment
        env::set_var("UPLOADS_DIR", uploads_dir.path());
        
        // Run migrations
        yipyap::db::migrations::run_migrations(&db).unwrap();
        
        Self { db, uploads_dir }
    }
}