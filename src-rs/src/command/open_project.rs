use std::fs;

use rfd::FileDialog;
use tauri::InvokeError;

use crate::project::Project;

#[tauri::command]
pub fn open_project() -> Result<Option<()>, InvokeError> {
    let path = FileDialog::new()
        .add_filter("TypeCFG Project (.tcfg)", &["tcfg"])
        .set_file_name("mysyntax.tcfg")
        .pick_file()
        .ok_or(InvokeError::from("File not selected."))?;

    let project_file = fs::read_to_string(path).unwrap();
    let _ = serde_xml_rs::from_str::<Project>(&project_file).unwrap();

    Ok(Some(()))
}
