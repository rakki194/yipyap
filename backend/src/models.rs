use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct BrowseHeader {
    pub mtime: String, // ISO 8601 format
    pub page: u32,
    pub pages: u32,
    pub folders: Vec<String>,
    pub images: Vec<String>,
    pub total_folders: usize,
    pub total_images: usize,
}

#[derive(Serialize, Deserialize)]
pub struct ImageModel {
    pub type_field: String, // "image"
    pub name: String,
    pub mtime: String,
    pub size: u64,
    pub mime: String,
    pub md5sum: String,
    pub width: u32,
    pub height: u32,
    pub captions: Vec<(String, String)>,
}

#[derive(Serialize, Deserialize)]
pub struct DirectoryModel {
    pub type_field: String, // "directory"
    pub name: String,
    pub mtime: String,
}

#[derive(Serialize, Deserialize)]
pub struct BrowseResponse {
    pub items: Vec<serde_json::Value>,
    pub total_pages: u32,
}

#[derive(Serialize)]
pub struct DeleteCaptionResponse {
    pub success: bool,
    pub message: String,
    pub path: String,
}
