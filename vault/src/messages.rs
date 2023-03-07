use crate::db_models::{Credential};
use actix::Message;
use diesel::QueryResult;

#[derive(Message)]
#[rtype(result = "QueryResult<Vec<Credential>>")]
pub struct FetchCreds;

#[derive(Message)]
#[rtype(result = "QueryResult<Vec<Credential>>")]
pub struct FetchUserCreds {
  pub user_id: i32,
}

#[derive(Message)]
#[rtype(result = "QueryResult<String>")]
pub struct CreateUser {
  pub auth_pub_key: String,
}