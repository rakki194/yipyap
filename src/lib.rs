pub mod api;
pub mod models;
pub mod handlers;
pub mod db;
pub mod error;

pub use db::pool::DbPool;
pub use error::{AppError, Result};