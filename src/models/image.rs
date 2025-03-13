use rusqlite::{Result, OptionalExtension};
use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};

#[derive(Debug, Serialize, Deserialize)]
pub struct Image {
    pub id: i64,
    pub file_path: String,
    pub file_name: String,
    pub mime_type: String,
    pub file_size: i64,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub caption: Option<String>,
    pub tags: Vec<String>,
}

impl Image {
    pub fn create(conn: &rusqlite::Connection, image: &Image) -> Result<i64> {
        let mut stmt = conn.prepare(
            "INSERT INTO images (file_path, file_name, mime_type, file_size, caption, created_at, updated_at)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7) RETURNING id"
        )?;
        
        stmt.query_row(
            [
                &image.file_path,
                &image.file_name,
                &image.mime_type,
                &image.file_size.to_string(),
                &image.caption.as_ref().unwrap_or(&String::new()),
                &image.created_at.timestamp().to_string(),
                &image.updated_at.timestamp().to_string(),
            ],
            |row| row.get(0),
        )
    }

    pub fn find_by_id(conn: &rusqlite::Connection, id: i64) -> Result<Option<Image>> {
        let mut stmt = conn.prepare(
            "SELECT id, file_path, file_name, mime_type, file_size, created_at, updated_at, caption
             FROM images WHERE id = ?"
        )?;

        stmt.query_row([id], |row| {
            let created_at_ts: i64 = row.get(5)?;
            let updated_at_ts: i64 = row.get(6)?;
            
            Ok(Image {
                id: row.get(0)?,
                file_path: row.get(1)?,
                file_name: row.get(2)?,
                mime_type: row.get(3)?,
                file_size: row.get(4)?,
                created_at: DateTime::from_timestamp(created_at_ts, 0).unwrap_or_default(),
                updated_at: DateTime::from_timestamp(updated_at_ts, 0).unwrap_or_default(),
                caption: row.get(7)?,
                tags: Vec::new(),
            })
        }).optional()
    }
}