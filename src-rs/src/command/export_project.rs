use rfd::FileDialog;
use tauri::InvokeError;

use crate::project::Project;

#[tauri::command]
pub fn export_project() -> Result<(), InvokeError> {
    let dir_path = FileDialog::new()
        .pick_folder()
        .ok_or(InvokeError::from("Directory not selected."))?;
    let _ = dir_path.join("project");

    let project = Project::new();
    let _ = serde_xml_rs::to_string(&project).unwrap();

    // TODO

    Ok(())
}
