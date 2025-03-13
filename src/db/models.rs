use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct User {
    pub id: i32,
    pub username: String,
    pub email: String,
    pub created_at: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Image {
    pub id: i32,
    pub user_id: i32,
    pub url: String,
    pub caption: String,
    pub created_at: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Caption {
    pub id: i32,
    pub image_id: i32,
    pub text: String,
    pub created_at: String,
}