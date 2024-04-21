use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Project {}

impl Project {
    pub fn new() -> Self {
        Project {}
    }
}
