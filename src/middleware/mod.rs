use axum::{
    middleware::from_fn,
    Router,
};
use tower_http::{
    trace::TraceLayer,
    compression::CompressionLayer,
    cors::CorsLayer,
};

pub fn apply_middleware(router: Router) -> Router {
    router
        .layer(TraceLayer::new_for_http())
        .layer(CompressionLayer::new())
        .layer(CorsLayer::permissive())
}