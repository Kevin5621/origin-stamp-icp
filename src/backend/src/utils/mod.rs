// Generate random ID
pub fn generate_random_id() -> String {
    let timestamp = ic_cdk::api::time();
    let random_part = simple_hash(&timestamp.to_string());
    format!(
        "{:x}{:x}",
        timestamp & 0xFFFFFFFF,
        random_part
            .chars()
            .take(8)
            .collect::<String>()
            .parse::<u32>()
            .unwrap_or(0)
    )
}

// Simple hash function for password (Note: In production, use proper password hashing like bcrypt)
fn simple_hash(password: &str) -> String {
    // This is a very basic hash - in production, use proper password hashing
    let char_sum: u32 = password.chars().map(|c| c as u32).sum::<u32>();
    format!("{:x}", (password.len() as u32) * 42 + char_sum)
}
