// @generated automatically by Diesel CLI.

diesel::table! {
    credentials (id) {
        id -> Int4,
        encrypted_creds -> Text,
        created_at -> Timestamp,
        user_id -> Int4,
    }
}

diesel::table! {
    devices (id) {
        id -> Int4,
        device_id_hash -> Text,
        created_at -> Timestamp,
        user_id -> Int4,
    }
}

diesel::table! {
    users (id) {
        id -> Int4,
        auth_pub_key -> Text,
    }
}

diesel::joinable!(credentials -> users (user_id));
diesel::joinable!(devices -> users (user_id));

diesel::allow_tables_to_appear_in_same_query!(
    credentials,
    devices,
    users,
);
