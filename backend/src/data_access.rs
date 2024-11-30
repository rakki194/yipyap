use crate::models::{ImageModel, BrowseHeader, DirectoryModel};
//use crate::utils::resolve_path;
use anyhow::Result;
use sqlx::{SqlitePool, Row};
use std::path::{Path, PathBuf};
//use futures::future::join_all;
use log::{info, error};
//use std::sync::Arc;

#[derive(Clone)]
pub struct CachedFileSystemDataSource {
    pub root_dir: PathBuf,
    pub thumbnail_size: (u32, u32),
    pub preview_size: (u32, u32),
    db_pool: SqlitePool,
}

impl CachedFileSystemDataSource {
    pub fn new(root_dir: PathBuf, thumbnail_size: (u32, u32), preview_size: (u32, u32)) -> Self {
        // Initialize SQLx pool and other necessary setups
        let db_path = root_dir.join("cache.db");
        let db_pool = sqlx::SqlitePool::connect_lazy(&format!("sqlite://{}", db_path.to_string_lossy()))
            .expect("Failed to create SQLite pool")
            .clone(); // Clone to use in the spawn

        // Initialize database tables
        let db_pool_clone = db_pool.clone();
        tokio::spawn(async move {
            if let Err(e) = sqlx::query(
                r#"
                CREATE TABLE IF NOT EXISTS image_info (
                    directory TEXT NOT NULL,
                    name TEXT NOT NULL,
                    info TEXT NOT NULL,
                    cache_time INTEGER NOT NULL,
                    thumbnail_webp BLOB NOT NULL,
                    deleted INTEGER NOT NULL DEFAULT 0,
                    PRIMARY KEY (directory, name)
                )
                "#
            )
            .execute(&db_pool_clone)
            .await
            {
                error!("Failed to create image_info table: {:?}", e);
            }
        });

        Self {
            root_dir,
            thumbnail_size,
            preview_size,
            db_pool,
        }
    }

    /// Save a caption to a file and update the cache
    pub async fn save_caption(&self, path: &Path, caption: &str, caption_type: &str) -> Result<()> {
        sqlx::query(
            "INSERT INTO captions (path, caption, caption_type) VALUES (?1, ?2, ?3)"
        )
        .bind(path.to_string_lossy())
        .bind(caption)
        .bind(caption_type)
        .execute(&self.db_pool)
        .await?;
        Ok(())
    }

    /// Delete a specific caption and update the cache
    pub async fn delete_caption(&self, path: &Path, caption_type: &str) -> Result<()> {
        sqlx::query(
            "DELETE FROM captions WHERE path = ?1 AND caption_type = ?2"
        )
        .bind(path.to_string_lossy())
        .bind(caption_type)
        .execute(&self.db_pool)
        .await?;
        Ok(())
    }

    /// Delete an image and its associated caption files
    pub async fn delete_image(&self, path: &Path, confirm: bool) -> Result<(Vec<String>, Vec<String>)> {
        if confirm {
            sqlx::query(
                "DELETE FROM images WHERE path = ?1"
            )
            .bind(path.to_string_lossy())
            .execute(&self.db_pool)
            .await?;
    
            let captions: Vec<String> = sqlx::query(
                "SELECT caption_type FROM captions WHERE path = ?1"
            )
            .bind(path.to_string_lossy())
            .fetch_all(&self.db_pool)
            .await?
            .iter()
            .map(|record| record.get::<String, _>("caption_type"))
            .collect();
    
            sqlx::query(
                "DELETE FROM captions WHERE path = ?1"
            )
            .bind(path.to_string_lossy())
            .execute(&self.db_pool)
            .await?;
    
            let deleted_files = vec![path.to_string_lossy().to_string()];
            Ok((captions, deleted_files))
        } else {
            Err(anyhow::anyhow!("Deletion not confirmed"))
        }
    }

    /// Get preview image data
    pub async fn get_preview(&self, path: &Path) -> Result<Option<Vec<u8>>> {
        let record = sqlx::query(
            "SELECT preview_data FROM previews WHERE path = ?1"
        )
        .bind(path.to_string_lossy())
        .fetch_optional(&self.db_pool)
        .await?;
    
        Ok(record.map(|r| r.get::<Vec<u8>, _>("preview_data")))
    }

    /// Get thumbnail image data
    pub async fn get_thumbnail(&self, path: &Path) -> Result<Option<Vec<u8>>> {
        let record = sqlx::query(
            "SELECT thumbnail_webp FROM image_info WHERE path = ?1 AND deleted = 0"
        )
        .bind(path.to_string_lossy())
        .fetch_optional(&self.db_pool)
        .await?;
    
        Ok(record.map(|r| r.get::<Vec<u8>, _>("thumbnail_webp")))
    }

    /// Scan directory and get items with pagination
    pub async fn scan_directory(
        &self,
        directory: &Path,
        page: u32,
        page_size: u32,
    ) -> Result<BrowseHeader> {
        // Implement the directory scanning and pagination logic
        // Fetch directories and images from the filesystem and cache as needed
        // This is a placeholder implementation
        let folders = vec!["folder1".to_string(), "folder2".to_string()];
        let images = vec!["image1.jpg".to_string(), "image2.png".to_string()];
        let total_folders = folders.len();
        let total_images = images.len();
        let total_pages = ((total_folders + total_images) as f64 / page_size as f64).ceil() as u32;
    
        let browse_header = BrowseHeader {
            mtime: chrono::Utc::now().to_rfc3339(),
            page,
            pages: total_pages,
            folders,
            images,
            total_folders,
            total_images,
        };
    
        Ok(browse_header)
    }

    /// Get image information with caching
    pub async fn get_image_info(&self, path: &Path) -> Result<ImageModel> {
        let record = sqlx::query(
            "SELECT info, cache_time, deleted FROM image_info WHERE path = ?1 AND deleted = 0"
        )
        .bind(path.to_string_lossy())
        .fetch_optional(&self.db_pool)
        .await?;

        if let Some(record) = record {
            let info_json: String = record.get("info");
            let cache_time: i64 = record.get("cache_time");
            let deleted: i32 = record.get("deleted");

            if deleted == 0 {
                let image_model: ImageModel = serde_json::from_str(&info_json)?;
                // You can add logic to check if cache_time is still valid
                return Ok(image_model);
            }
        }

        // If not found in cache, fetch from filesystem and cache it
        // Placeholder for actual implementation
        Err(anyhow::anyhow!("Image info not found"))
    }

    /// Ensure thumbnail exists
    pub async fn ensure_thumbnail(&self, path: &Path) -> Result<PathBuf> {
        // Placeholder for thumbnail generation logic
        // Return the path to the thumbnail
        let thumbnail_path = path.with_extension("webp");
        Ok(thumbnail_path)
    }

    /// Get caption for an image
    pub async fn get_caption(&self, path: &Path) -> Result<String> {
        let record = sqlx::query(
            "SELECT caption FROM captions WHERE path = ?1"
        )
        .bind(path.to_string_lossy())
        .fetch_one(&self.db_pool)
        .await?;

        let caption: String = record.get("caption");
        Ok(caption)
    }
} 