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

criterion_group!(benches, bench_get_thumbnail, bench_get_preview);
criterion_main!(benches); 