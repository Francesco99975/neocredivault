
use actix_web::{
    get, post,
    web::{Data, Json, Path},
    Responder, HttpResponse,
};
use serde::Deserialize;
use crate::{
    messages::{FetchCreds, FetchUserCreds, CreateUser},
    AppState, DbActor
};
use actix::Addr;


#[derive(Deserialize)]
struct AsymmetricEncryptionData {
    public_key: String,
}

#[post("/signup")]
async fn signup(state: Data<AppState>, body: Json<AsymmetricEncryptionData>) -> impl Responder {
    let db: Addr<DbActor> = state.as_ref().db.clone();

    match db.send(CreateUser {
        auth_pub_key: body.public_key.to_string()
    }).await
    {
        Ok(Ok(info)) => HttpResponse::Ok().json(info),
        _ => HttpResponse::InternalServerError().json("Failed to create user"),
    }
}

#[post("/login")]
async fn verify_auth_key(data: Json<AsymmetricEncryptionData>) -> impl Responder {

    HttpResponse::Ok().body("Successfully Stored Public Key")
}