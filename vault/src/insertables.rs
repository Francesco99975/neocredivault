use crate::schema::users;
use crate::schema::credentials;
use crate::schema::devices;
use diesel::Insertable;
use serde::Serialize;

#[derive(Insertable, Serialize, Clone)]
#[diesel(table_name=users)]
pub struct NewUser {
  pub auth_pub_key: String,
}

#[derive(Insertable, Serialize, Clone)]
#[diesel(table_name=credentials)]
pub struct NewCredential {
  pub encrypted_creds: String,
  pub user_id: i32,
}

#[derive(Insertable, Serialize, Clone)]
#[diesel(table_name=devices)]
pub struct NewDevice {
  pub device_id_hash: String,
  pub user_id: i32,
}