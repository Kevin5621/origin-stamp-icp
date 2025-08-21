use std::cell::RefCell;
use std::collections::HashMap;
use crate::types::{PhysicalArtSession, UploadFileData};
use crate::utils::generate_random_id;

thread_local! {
    static PHYSICAL_ART_SESSIONS: RefCell<HashMap<String, PhysicalArtSession>> = RefCell::new(HashMap::new());
}

// Create physical art session
#[ic_cdk::update]
pub fn create_physical_art_session(
    username: String,
    art_title: String,
    description: String,
) -> Result<String, String> {
    let session_id = generate_random_id();
    let session = PhysicalArtSession {
        session_id: session_id.clone(),
        username: username.clone(),
        art_title,
        description,
        uploaded_photos: Vec::new(),
        status: "draft".to_string(),
        created_at: ic_cdk::api::time(),
        updated_at: ic_cdk::api::time(),
    };

    PHYSICAL_ART_SESSIONS.with(|sessions| {
        sessions.borrow_mut().insert(session_id.clone(), session);
    });

    Ok(session_id)
}

// Upload photo to session (record the uploaded photo)
#[ic_cdk::update]
pub fn upload_photo_to_session(session_id: String, photo_url: String) -> Result<bool, String> {
    PHYSICAL_ART_SESSIONS.with(|sessions| {
        let mut sessions_map = sessions.borrow_mut();
        match sessions_map.get_mut(&session_id) {
            Some(session) => {
                session.uploaded_photos.push(photo_url);
                session.updated_at = ic_cdk::api::time();
                Ok(true)
            }
            None => Err("Session not found".to_string()),
        }
    })
}

// Get session details
#[ic_cdk::query]
pub fn get_session_details(session_id: String) -> Option<PhysicalArtSession> {
    PHYSICAL_ART_SESSIONS.with(|sessions| sessions.borrow().get(&session_id).cloned())
}

// Get user sessions
#[ic_cdk::query]
pub fn get_user_sessions(username: String) -> Vec<PhysicalArtSession> {
    PHYSICAL_ART_SESSIONS.with(|sessions| {
        sessions
            .borrow()
            .values()
            .filter(|session| session.username == username)
            .cloned()
            .collect()
    })
}

// Update session status
#[ic_cdk::update]
pub fn update_session_status(session_id: String, status: String) -> Result<bool, String> {
    PHYSICAL_ART_SESSIONS.with(|sessions| {
        let mut sessions_map = sessions.borrow_mut();
        match sessions_map.get_mut(&session_id) {
            Some(session) => {
                session.status = status;
                session.updated_at = ic_cdk::api::time();
                Ok(true)
            }
            None => Err("Session not found".to_string()),
        }
    })
}

// Remove photo from session
#[ic_cdk::update]
pub fn remove_photo_from_session(session_id: String, photo_url: String) -> Result<bool, String> {
    PHYSICAL_ART_SESSIONS.with(|sessions| {
        let mut sessions_map = sessions.borrow_mut();
        match sessions_map.get_mut(&session_id) {
            Some(session) => {
                session.uploaded_photos.retain(|url| url != &photo_url);
                session.updated_at = ic_cdk::api::time();
                Ok(true)
            }
            None => Err("Session not found".to_string()),
        }
    })
}

