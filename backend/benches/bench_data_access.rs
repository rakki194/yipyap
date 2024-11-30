use criterion::{black_box, criterion_group, criterion_main, Criterion};
use backend::data_access::CachedFileSystemDataSource;
use std::path::PathBuf;
use tokio::runtime::Runtime;

/// Benchmarks the `get_thumbnail` function.
fn bench_get_thumbnail(c: &mut Criterion) {
    c.bench_function("get_thumbnail", |b| {
        // Initialize the Tokio runtime once.
        let rt = Runtime::new().expect("Failed to create Tokio runtime");
        let root_dir = PathBuf::from("./datasets");
        let data_source = CachedFileSystemDataSource::new(root_dir, (300, 300), (1024, 1024));
        let image_path = PathBuf::from("images/photo.jpg");

        b.iter(|| {
            rt.block_on(async {
                let _ = black_box(data_source.get_thumbnail(&image_path).await);
            });
        })
    });
}

/// Benchmarks the `get_preview` function.
fn bench_get_preview(c: &mut Criterion) {
    c.bench_function("get_preview", |b| {
        // Initialize the Tokio runtime once.
        let rt = Runtime::new().expect("Failed to create Tokio runtime");
        let root_dir = PathBuf::from("./datasets");
        let data_source = CachedFileSystemDataSource::new(root_dir, (300, 300), (1024, 1024));
        let image_path = PathBuf::from("images/photo.jpg");

        b.iter(|| {
            rt.block_on(async {
                let _ = black_box(data_source.get_preview(&image_path).await);
            });
        })
    });
}

#[cfg(test)]
mod benchmarks {
    use super::*;
    use criterion::{BenchmarkId, Criterion};
    use std::path::PathBuf;
    use tokio::runtime::Runtime;

    pub fn bench_data_access(c: &mut Criterion) {
        let rt = Runtime::new().unwrap();
        let root_dir = PathBuf::from("./datasets");
        let data_source = CachedFileSystemDataSource::new(root_dir.clone(), (300, 300), (1024, 1024));
        let image_path = PathBuf::from("images/photo.jpg");

        c.bench_with_input(BenchmarkId::new("get_thumbnail", "existing"), &image_path, |b, path| {
            b.iter(|| {
                rt.block_on(async {
                    let _ = black_box(data_source.get_thumbnail(path).await);
                })
            })
        });

        c.bench_with_input(BenchmarkId::new("get_thumbnail", "nonexistent"), &PathBuf::from("images/nonexistent.jpg"), |b, path| {
            b.iter(|| {
                rt.block_on(async {
                    let _ = black_box(data_source.get_thumbnail(path).await);
                })
            })
        });

        c.bench_with_input(BenchmarkId::new("save_caption", "new_caption"), &image_path, |b, path| {
            b.iter(|| {
                rt.block_on(async {
                    let _ = black_box(data_source.save_caption(path, "Test Caption", "test_type").await);
                })
            })
        });

        c.bench_with_input(BenchmarkId::new("delete_caption", "existing_caption"), &image_path, |b, path| {
            b.iter(|| {
                rt.block_on(async {
                    let _ = black_box(data_source.delete_caption(path, "test_type").await);
                })
            })
        });
    }

    criterion_group!(benches, bench_data_access);
    criterion_main!(benches);
}

criterion_main!(benches); 