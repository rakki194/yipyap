use actix_web::Result;
use std::path::{Path, PathBuf};

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
