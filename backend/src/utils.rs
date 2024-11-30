// backend/src/utils.rs

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
/// # use backend::utils::resolve_path;
/// # use std::path::Path;
/// let root = Path::new("/var/www");
/// let resolved = resolve_path("images/photo.jpg", root).unwrap();
/// assert_eq!(resolved, Path::new("/var/www/images/photo.jpg"));
/// ```
pub fn resolve_path(path: &str, root: &Path) -> Result<PathBuf, String> {
    if path.is_empty() || path == "/" {
        return Ok(root.to_path_buf());
    }

    let mut resolved_path = root.to_path_buf();

    for comp in Path::new(path).components() {
        match comp {
            std::path::Component::Normal(c) => resolved_path.push(c),
            _ => return Err("Access denied".to_string()),
        }
    }

    if resolved_path.starts_with(root) {
        Ok(resolved_path)
    } else {
        Err("Access denied".to_string())
    }
}

/// Converts a file size in bytes to a human-readable string.
///
/// # Examples
///
/// ```
/// # use backend::utils::get_human_readable_size;
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

#[cfg(test)]
mod tests {
    use super::*;
    use std::path::Path;

    #[test]
    fn test_resolve_path_valid() {
        let root = Path::new("/var/www");
        let path = "images/photo.jpg";
        let resolved = resolve_path(path, root).unwrap();
        assert_eq!(resolved, root.join("images/photo.jpg"));
    }

    #[test]
    fn test_resolve_path_empty() {
        let root = Path::new("/var/www");
        let path = "";
        let resolved = resolve_path(path, root).unwrap();
        assert_eq!(resolved, root);
    }

    #[test]
    fn test_resolve_path_traversal() {
        let root = Path::new("/var/www");
        let path = "../../etc/passwd";
        let result = resolve_path(path, root);
        assert!(result.is_err());
        assert_eq!(result.unwrap_err(), "Access denied");
    }

    #[test]
    fn test_get_human_readable_size_bytes() {
        let size = 500;
        let readable = get_human_readable_size(size);
        assert_eq!(readable, "500.0 B");
    }

    #[test]
    fn test_get_human_readable_size_kb() {
        let size = 2048;
        let readable = get_human_readable_size(size);
        assert_eq!(readable, "2.0 KB");
    }

    #[test]
    fn test_get_human_readable_size_mb() {
        let size = 5 * 1024 * 1024;
        let readable = get_human_readable_size(size);
        assert_eq!(readable, "5.0 MB");
    }

    #[test]
    fn test_get_human_readable_size_gb() {
        let size = 3 * 1024 * 1024 * 1024;
        let readable = get_human_readable_size(size);
        assert_eq!(readable, "3.0 GB");
    }

    #[test]
    fn test_get_human_readable_size_tb() {
        let size = 1 * 1024 * 1024 * 1024 * 1024;
        let readable = get_human_readable_size(size);
        assert_eq!(readable, "1.0 TB");
    }
}
