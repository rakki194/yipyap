use r2d2_sqlite::SqliteConnectionManager;
use r2d2::Pool;
use anyhow::Result;

pub type DbPool = Pool<SqliteConnectionManager>;

pub fn create_pool(database_url: &str) -> Result<DbPool> {
    let manager = SqliteConnectionManager::file(database_url);
    let pool = Pool::new(manager)?;
    
    // Initialize the first connection and run migrations
    let conn = pool.get()?;
    crate::db::migrations::run_migrations(&conn)?;
    
    Ok(pool)
}