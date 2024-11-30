use crate::models::{BrowseHeader, DirectoryModel, ImageModel};
use serde_json::json;
use serde::Serialize;
use sqlx::{SqlitePool, Row};
use std::path::{Path, PathBuf};
use tokio::fs;
use log::{info, error};
use anyhow::{Result, anyhow};
use std::collections::HashMap;

pub struct CachedFileSystemDataSource {
    root_dir: PathBuf,
    thumbnail_size: (u32, u32),
    preview_size: (u32, u32),
    db_pool: SqlitePool,
    // Add other fields as needed
}

impl CachedFileSystemDataSource {
    pub fn new(root_dir: PathBuf, thumbnail_size: (u32, u32), preview_size: (u32, u32)) -> Self {
        // Initialize SQLx pool and other necessary setups
        let db_path = root_dir.join("cache.db");
        let db_pool = sqlx::SqlitePool::connect_lazy(&format!("sqlite://{}", db_path.to_string_lossy()))
            .expect("Failed to create SQLite pool");
        
        Self {
            root_dir,
            thumbnail_size,
            preview_size,
            db_pool,
        }
    }

    /// Save a caption to a file and update the cache
    pub async fn save_caption(&self, path: PathBuf, caption: &str, caption_type: &str) -> Result<()> {
        // Construct caption file path by replacing image extension with .{caption_type}
        let caption_path = path.with_extension(caption_type);
        
        // Save to file
        fs::write(&caption_path, caption).await?;
        info!("Saved caption to {:?}", caption_path);
        
        // Update cache
        let directory = path.parent().ok_or_else(|| anyhow!("No parent directory"))?;
        let name = path.file_name()
            .and_then(|n| n.to_str())
            .ok_or_else(|| anyhow!("Invalid file name"))?;
        
        // Fetch existing info
        let record = sqlx::query("SELECT info FROM image_info WHERE directory = ? AND name = ? AND deleted = 0")
            .bind(directory.to_str())
            .bind(name)
            .fetch_optional(&self.db_pool)
            .await?;
        
        if let Some(record) = record {
            let mut info: ImageModel = serde_json::from_str(&record.get::<String, _>("info"))?;
            // Update the caption in the cached info
            info.captions = info.captions.iter().map(|(t, c)| {
                if t == caption_type {
                    (t.clone(), caption.to_string())
                } else {
                    (t.clone(), c.clone())
                }
            }).collect();
            
            // Update cache
            sqlx::query("UPDATE image_info SET info = ?, cache_time = ? WHERE directory = ? AND name = ?")
                .bind(serde_json::to_string(&info)?)
                .bind(chrono::Utc::now().timestamp())
                .bind(directory.to_str())
                .bind(name)
                .execute(&self.db_pool)
                .await?;
        } else {
            error!("No cached info found for {:?}, cannot update caption", path);
            return Err(anyhow!("No cached info found for {:?}, cannot update caption", path));
        }
        
        Ok(())
    }

    /// Delete a specific caption and update the cache
    pub async fn delete_caption(&self, path: PathBuf, caption_type: &str) -> Result<()> {
        // Construct caption file path by replacing image extension with .{caption_type}
        let caption_path = path.with_extension(caption_type);
        
        // Delete the file if it exists
        if caption_path.exists() {
            fs::remove_file(&caption_path).await?;
            info!("Deleted caption file {:?}", caption_path);
        } else {
            error!("Caption file not found: {:?}", caption_path);
            return Err(anyhow!("Caption file not found"));
        }
        
        // Update cache
        let directory = path.parent().ok_or_else(|| anyhow!("No parent directory"))?;
        let name = path.file_name()
            .and_then(|n| n.to_str())
            .ok_or_else(|| anyhow!("Invalid file name"))?;
        
        // Fetch existing info
        let record = sqlx::query("SELECT info FROM image_info WHERE directory = ? AND name = ? AND deleted = 0")
            .bind(directory.to_str())
            .bind(name)
            .fetch_optional(&self.db_pool)
            .await?;
        
        if let Some(record) = record {
            let mut info: ImageModel = serde_json::from_str(&record.get::<String, _>("info"))?;
            // Remove the caption from cached info
            info.captions.retain(|(t, _)| t != caption_type);
            
            // Update cache
            sqlx::query("UPDATE image_info SET info = ?, cache_time = ? WHERE directory = ? AND name = ?")
                .bind(serde_json::to_string(&info)?)
                .bind(chrono::Utc::now().timestamp())
                .bind(directory.to_str())
                .bind(name)
                .execute(&self.db_pool)
                .await?;
        } else {
            error!("No cached info found for {:?}, cannot delete caption", path);
            return Err(anyhow!("No cached info found for {:?}, cannot delete caption", path));
        }
        
        Ok(())
    }

    /// Delete an image and its associated caption files
    pub async fn delete_image(&self, path: PathBuf, confirm: bool) -> Result<(Vec<String>, Vec<String>)> {
        let mut captions = Vec::new();
        let mut files = Vec::new();

        // Iterate through sidecar files
        for entry in path.parent().ok_or_else(|| anyhow!("No parent directory"))?.glob(&format!("{}.*", path.file_stem().unwrap_or_default().to_str().unwrap_or(""))) {
            let entry = entry?;
            let suffix = entry.extension()
                .and_then(|s| s.to_str())
                .unwrap_or("")
                .to_string();
            
            match suffix.as_str() {
                "caption" | "txt" | "tags" => captions.push(suffix),
                _ => files.push(suffix),
            }

            if confirm {
                fs::remove_file(entry.path()).await?;
            }
        }

        if confirm {
            fs::remove_file(&path).await?;
            // Soft-delete in cache
            sqlx::query("UPDATE image_info SET deleted = 1 WHERE directory = ? AND name = ?")
                .bind(path.parent().unwrap().to_str())
                .bind(path.file_name().and_then(|n| n.to_str()).unwrap_or(""))
                .execute(&self.db_pool)
                .await?;
            info!("Soft-deleted image {:?}", path);
        }

        Ok((captions, files))
    }

    pub async fn get_preview(&self, path: PathBuf) -> Result<Option<Vec<u8>>> {
        // Check cache first
        let record = sqlx::query("SELECT thumbnail_webp FROM image_info WHERE directory = ? AND name LIKE ? AND deleted = 0")
            .bind(path.parent().and_then(|p| p.to_str()))
            .bind(format!("{}.%", path.file_name().and_then(|n| n.to_str()).unwrap_or("")))
            .fetch_optional(&self.db_pool)
            .await?;
        
        if let Some(record) = record {
            let thumbnail_data: Vec<u8> = record.get("thumbnail_webp");
            return Ok(Some(thumbnail_data));
        }

        // If not cached, generate thumbnail
        // Implement actual image processing here
        // For simplicity, return None
        Ok(None)
    }

}
