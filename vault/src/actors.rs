use crate::db_models::{User, Credential, Device};
use crate::db_utils::DbActor;
use crate::schema::users::{dsl::*, id as user_id};
use crate::schema::credentials::{dsl::*, id as cred_id, user_id as cred_created_by};
use crate::schema::devices::{dsl::*, id as dev_id, user_id as dev_created_by};
use crate::messages::{FetchCreds, FetchUserCreds, CreateUser};
use crate::insertables::{NewUser, NewCredential, NewDevice};
use actix::Handler;
use diesel::{self, prelude::*};

impl Handler<FetchCreds> for DbActor {
  type Result = QueryResult<Vec<Credential>>;

  fn handle(&mut self, _msg: FetchCreds, _ctx: &mut Self::Context) -> Self::Result {
    let mut conn = self.0.get().expect("Fetch Creds: Unable to establish connection");

    credentials.get_results::<Credential>(&mut conn)
  }
}

impl Handler<FetchUserCreds> for DbActor {
  type Result = QueryResult<Vec<Credential>>;

  fn handle(&mut self, msg: FetchUserCreds, _ctx: &mut Self::Context) -> Self::Result {
    let mut conn = self.0.get().expect("Fetch User Creds: Unable to establish connection");

    credentials.filter(cred_created_by.eq(msg.user_id)).get_results::<Credential>(&mut conn)
  }
}

impl Handler<CreateUser> for DbActor {
  type Result = QueryResult<String>;

  fn handle(&mut self, msg: CreateUser, _ctx: &mut Self::Context) -> Self::Result {
    let mut conn = self.0.get().expect("Create User: Unable to establish connection");

    let new_user = NewUser {
        auth_pub_key: msg.auth_pub_key
    };

    diesel::insert_into(users)
      .values(new_user)
      .returning(auth_pub_key)
      .get_result::<String>(&mut conn)
  }
}