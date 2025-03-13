use rusqlite::Connection;
use anyhow::Result;

const MIGRATIONS: &[&str] = &[
    // 001 - Initial schema
    "CREATE TABLE IF NOT EXISTS images (
        id INTEGER PRIMARY KEY,
        file_path TEXT NOT NULL,
        file_name TEXT NOT NULL,
        mime_type TEXT NOT NULL,
        file_size INTEGER NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        caption TEXT
    )",
    // 002 - Add tags table
    "CREATE TABLE IF NOT EXISTS tags (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL UNIQUE
    )",
    // 003 - Add image_tags table
    "CREATE TABLE IF NOT EXISTS image_tags (
        image_id INTEGER NOT NULL,
        tag_id INTEGER NOT NULL,
        PRIMARY KEY (image_id, tag_id),
        FOREIGN KEY (image_id) REFERENCES images(id) ON DELETE CASCADE,
        FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
    )",
];

pub fn run_migrations(conn: &Connection) -> Result<()> {
    conn.execute_batch("PRAGMA foreign_keys = ON")?;

    // Create migrations table if it doesn't exist
    conn.execute(
        "CREATE TABLE IF NOT EXISTS migrations (
            id INTEGER PRIMARY KEY,
            version INTEGER NOT NULL,
            applied_at INTEGER NOT NULL
        )",
        [],
    )?;

    let mut stmt = conn.prepare("SELECT MAX(version) FROM migrations")?;
    let current_version: i64 = stmt.query_row([], |row| row.get(0)).unwrap_or(0);

    for (version, migration) in MIGRATIONS.iter().enumerate() {
        let version = (version + 1) as i64;
        if version > current_version {
            conn.execute(migration, [])?;
            conn.execute(
                "INSERT INTO migrations (version, applied_at) VALUES (?, ?)",
                [version, chrono::Utc::now().timestamp()],
            )?;
            tracing::info!("Applied migration {}", version);
        }
    }

    Ok(())
}