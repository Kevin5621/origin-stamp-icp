use candid::CandidType;
use ic_cdk::export_candid;
use ic_llm::{ChatMessage, Model};
use std::cell::RefCell;
use std::collections::HashMap;

#[derive(Clone, Debug, CandidType)]
pub struct User {
    pub username: String,
    pub password_hash: String,
    pub created_at: u64,
}

// Login result structure
#[derive(Clone, Debug, CandidType)]
pub struct LoginResult {
    pub success: bool,
    pub message: String,
    pub username: Option<String>,
}

#[ic_cdk::update]
async fn prompt(prompt_str: String) -> String {
    ic_llm::prompt(Model::Llama3_1_8B, prompt_str).await
}

#[ic_cdk::update]
async fn chat(messages: Vec<ChatMessage>) -> String {
    let response = ic_llm::chat(Model::Llama3_1_8B)
        .with_messages(messages)
        .send()
        .await;

    // A response can contain tool calls, but we're not calling tools in this project,
    // so we can return the response message directly.
    response.message.content.unwrap_or_default()
}

thread_local! {
    static USERS: RefCell<HashMap<String, User>> = RefCell::new(HashMap::new());
}

// Simple hash function for password (Note: In production, use proper password hashing like bcrypt)
fn simple_hash(password: &str) -> String {
    // This is a very basic hash - in production, use proper password hashing
    let char_sum: u32 = password.chars().map(|c| c as u32).sum::<u32>();
    format!("{:x}", (password.len() as u32) * 42 + char_sum)
}

#[ic_cdk::update]
fn register_user(username: String, password: String) -> LoginResult {
    if username.is_empty() || password.is_empty() {
        return LoginResult {
            success: false,
            message: "Username and password cannot be empty".to_string(),
            username: None,
        };
    }

    USERS.with(|users: &RefCell<HashMap<String, User>>| {
        let mut users_map: std::cell::RefMut<'_, HashMap<String, User>> = users.borrow_mut();

        if users_map.contains_key(&username) {
            LoginResult {
                success: false,
                message: "Username already exists".to_string(),
                username: None,
            }
        } else {
            let user = User {
                username: username.clone(),
                password_hash: simple_hash(&password),
                created_at: ic_cdk::api::time(),
            };

            users_map.insert(username.clone(), user);

            LoginResult {
                success: true,
                message: "User registered successfully".to_string(),
                username: Some(username),
            }
        }
    })
}

#[ic_cdk::update]
fn login(username: String, password: String) -> LoginResult {
    if username.is_empty() || password.is_empty() {
        return LoginResult {
            success: false,
            message: "Username and password cannot be empty".to_string(),
            username: None,
        };
    }

    USERS.with(|users| {
        let users_map = users.borrow();

        match users_map.get(&username) {
            Some(user) => {
                let password_hash = simple_hash(&password);

                if user.password_hash == password_hash {
                    LoginResult {
                        success: true,
                        message: "Login successful".to_string(),
                        username: Some(username),
                    }
                } else {
                    LoginResult {
                        success: false,
                        message: "Invalid password".to_string(),
                        username: None,
                    }
                }
            }
            None => LoginResult {
                success: false,
                message: "User not found".to_string(),
                username: None,
            },
        }
    })
}

#[ic_cdk::query]
fn get_all_users() -> Vec<String> {
    USERS.with(|users| users.borrow().keys().cloned().collect())
}

#[ic_cdk::query]
fn get_user_info(username: String) -> Option<(String, u64)> {
    USERS.with(|users| {
        users
            .borrow()
            .get(&username)
            .map(|user| (user.username.clone(), user.created_at))
    })
}

#[ic_cdk::query]
fn get_user_count() -> usize {
    USERS.with(|users| users.borrow().len())
}

export_candid!();
