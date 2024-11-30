// backend/src/models.rs

use serde::{Deserialize, Serialize};

/// Represents the response header for browsing directories.
///
/// Includes metadata about the browsing session and lists of folders and images.
#[derive(Serialize, Deserialize)]
pub struct BrowseHeader {
    /// The modification time of the directory in ISO 8601 format.
    pub mtime: String, // ISO 8601 format
    /// The current page number.
    pub page: u32,
    /// The total number of pages available.
    pub pages: u32,
    /// A list of folder names in the current directory.
    pub folders: Vec<String>,
    /// A list of image file names in the current directory.
    pub images: Vec<String>,
    /// The total number of folders.
    pub total_folders: usize,
    /// The total number of images.
    pub total_images: usize,
}

/// Represents detailed information about an image.
///
/// Includes metadata and associated captions.
#[derive(Serialize, Deserialize)]
pub struct ImageModel {
    /// The type of the item (e.g., "image").
    pub type_field: String, // "image"
    /// The name of the image file.
    pub name: String,
    /// The modification time of the image in ISO 8601 format.
    pub mtime: String,
    /// The size of the image file in bytes.
    pub size: u64,
    /// The MIME type of the image.
    pub mime: String,
    /// The MD5 checksum of the image.
    pub md5sum: String,
    /// The width of the image in pixels.
    pub width: u32,
    /// The height of the image in pixels.
    pub height: u32,
    /// A list of captions associated with the image.
    pub captions: Vec<(String, String)>,
}

/// Represents information about a directory.
///
/// Includes metadata about the directory.
#[derive(Serialize, Deserialize)]
pub struct DirectoryModel {
    /// The type of the item (e.g., "directory").
    pub type_field: String, // "directory"
    /// The name of the directory.
    pub name: String,
    /// The modification time of the directory in ISO 8601 format.
    pub mtime: String,
}

/// Represents the response for a browse operation.
///
/// Currently a placeholder and can be expanded as needed.
#[derive(Serialize, Deserialize)]
pub struct BrowseResponse {
    /// A list of items (directories and images) in JSON format.
    pub items: Vec<serde_json::Value>,
    /// The total number of pages available.
    pub total_pages: u32,
}

/// Represents the response after deleting a caption.
///
/// Includes the success status, a descriptive message, and the path to the affected file.
#[derive(Serialize)]
pub struct DeleteCaptionResponse {
    /// Indicates whether the deletion was successful.
    pub success: bool,
    /// A message describing the result of the deletion.
    pub message: String,
    /// The path to the affected file.
    pub path: String,
}
