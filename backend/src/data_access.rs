use crate::models::{ImageModel, BrowseHeader, DirectoryModel};
use anyhow::Result;
use sqlx::{SqlitePool, Row};
use std::path::{Path, PathBuf};
use log::{info, error};

/// Represents a cached file system data source with thumbnail and preview capabilities.
#[derive(Clone)]
pub struct CachedFileSystemDataSource {
    /// The root directory for the data source.
    pub root_dir: PathBuf,
    /// The size for thumbnails (width, height).
    pub thumbnail_size: (u32, u32),
    /// The size for preview images (width, height).
    pub preview_size: (u32, u32),
    /// The SQLite connection pool.
    db_pool: SqlitePool,
}

impl CachedFileSystemDataSource {
    /// Creates a new `CachedFileSystemDataSource`.
    ///
    /// This function initializes the SQLite database and ensures that necessary tables are created.
    ///
    /// # Arguments
    ///
    /// * `root_dir` - The root directory path.
    /// * `thumbnail_size` - Tuple specifying thumbnail dimensions.
    /// * `preview_size` - Tuple specifying preview image dimensions.
    ///
    /// # Returns
    ///
    /// A new instance of `CachedFileSystemDataSource`.
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

    /// Saves a caption to the database for a specific image.
    ///
    /// # Arguments
    ///
    /// * `path` - The path to the image.
    /// * `caption` - The caption text to save.
    /// * `caption_type` - The type/category of the caption.
    ///
    /// # Returns
    ///
    /// A `Result` indicating success or containing an error.
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

    /// Deletes a specific caption from the database for a given image.
    ///
    /// # Arguments
    ///
    /// * `path` - The path to the image.
    /// * `caption_type` - The type/category of the caption to delete.
    ///
    /// # Returns
    ///
    /// A `Result` indicating success or containing an error.
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

    /// Deletes an image and its associated captions if confirmed.
    ///
    /// # Arguments
    ///
    /// * `path` - The path to the image.
    /// * `confirm` - A boolean indicating whether to proceed with deletion.
    ///
    /// # Returns
    ///
    /// A tuple containing vectors of deleted caption types and file paths.
    ///
    /// # Errors
    ///
    /// Returns an error if deletion is not confirmed or fails.
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

    /// Retrieves the preview image data from the cache.
    ///
    /// # Arguments
    ///
    /// * `path` - The path to the image.
    ///
    /// # Returns
    ///
    /// An optional vector of bytes representing the preview image.
    ///
    /// # Errors
    ///
    /// Returns an error if the database query fails.
    pub async fn get_preview(&self, path: &Path) -> Result<Option<Vec<u8>>> {
        let record = sqlx::query(
            "SELECT preview_data FROM previews WHERE path = ?1"
        )
        .bind(path.to_string_lossy())
        .fetch_optional(&self.db_pool)
        .await?;

        Ok(record.map(|r| r.get::<Vec<u8>, _>("preview_data")))
    }

    /// Retrieves the thumbnail image data from the cache.
    ///
    /// # Arguments
    ///
    /// * `path` - The path to the image.
    ///
    /// # Returns
    ///
    /// An optional vector of bytes representing the thumbnail image.
    ///
    /// # Errors
    ///
    /// Returns an error if the database query fails.
    pub async fn get_thumbnail(&self, path: &Path) -> Result<Option<Vec<u8>>> {
        let record = sqlx::query(
            "SELECT thumbnail_webp FROM image_info WHERE path = ?1 AND deleted = 0"
        )
        .bind(path.to_string_lossy())
        .fetch_optional(&self.db_pool)
        .await?;

        Ok(record.map(|r| r.get::<Vec<u8>, _>("thumbnail_webp")))
    }

    /// Scans a directory and retrieves items with pagination.
    ///
    /// # Arguments
    ///
    /// * `directory` - The directory path to scan.
    /// * `page` - The current page number.
    /// * `page_size` - The number of items per page.
    ///
    /// # Returns
    ///
    /// A `BrowseHeader` containing directory and image information.
    ///
    /// # Errors
    ///
    /// Returns an error if directory scanning fails.
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

    /// Retrieves image information from the cache or filesystem.
    ///
    /// # Arguments
    ///
    /// * `path` - The path to the image.
    ///
    /// # Returns
    ///
    /// An `ImageModel` containing image metadata.
    ///
    /// # Errors
    ///
    /// Returns an error if image information is not found or deserialization fails.
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

    /// Ensures that a thumbnail exists for the given image, generating it if necessary.
    ///
    /// # Arguments
    ///
    /// * `path` - The path to the image.
    ///
    /// # Returns
    ///
    /// The path to the thumbnail image.
    ///
    /// # Errors
    ///
    /// Returns an error if thumbnail generation fails.
    pub async fn ensure_thumbnail(&self, path: &Path) -> Result<PathBuf> {
        // Placeholder for thumbnail generation logic
        // Return the path to the thumbnail
        let thumbnail_path = path.with_extension("webp");
        Ok(thumbnail_path)
    }

    /// Retrieves the caption for a specific image.
    ///
    /// # Arguments
    ///
    /// * `path` - The path to the image.
    ///
    /// # Returns
    ///
    /// A `String` containing the caption.
    ///
    /// # Errors
    ///
    /// Returns an error if the database query fails.
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