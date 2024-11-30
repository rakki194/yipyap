use actix_web::Result;
use std::path::{Path, PathBuf};

/// Resolves a user-supplied path relative to the root directory.
///
/// This function sanitizes the input path to prevent directory traversal vulnerabilities.
///
/// # Arguments
///
/// * `path` - The user-supplied path as a string slice.
/// * `root` - The root directory against which the path is resolved.
///
/// # Returns
///
/// * `Ok(PathBuf)` - The sanitized and resolved path.
/// * `Err(String)` - An error message if the path is invalid.
///
/// # Examples
///
/// ```
/// let root = Path::new("/var/www");
/// let resolved = resolve_path("images/photo.jpg", root).unwrap();
/// assert_eq!(resolved, Path::new("/var/www/images/photo.jpg"));
/// ```
pub fn resolve_path(path: &str, root: &Path) -> Result<PathBuf, String> {
    if path.is_empty() || path == "/" {
        return Ok(root.to_path_buf());
    }

    let resolved_path = Path::new(path).components().fold(root.to_path_buf(), |mut acc, comp| {
        match comp {
            std::path::Component::Normal(c) => acc.push(c),
            _ => (),
        }
        acc
    });

    if resolved_path.starts_with(root) {
        Ok(resolved_path)
    } else {
        Err("Access denied".to_string())
    }
}

/// Converts a file size in bytes to a human-readable string.
///
/// # Arguments
///
/// * `size` - The file size in bytes.
///
/// # Returns
///
/// A `String` representing the human-readable file size.
///
/// # Examples
///
/// ```
/// let readable = get_human_readable_size(2048);
/// assert_eq!(readable, "2.0 KB");
/// ```
pub fn get_human_readable_size(size: u64) -> String {
    const UNITS: [&str; 5] = ["B", "KB", "MB", "GB", "TB"];
    let mut size = size as f64;
    let mut unit = 0;
    while size >= 1024.0 && unit < UNITS.len() - 1 {
        size /= 1024.0;
        unit += 1;
    }
    format!("{:.1} {}", size, UNITS[unit])
}
