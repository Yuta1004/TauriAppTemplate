use rfd::FileDialog;
use tauri::InvokeError;

use crate::project::Project;

#[tauri::command]
pub fn save_project() -> Result<(), InvokeError> {
    let _ = FileDialog::new()
        .add_filter("TypedCFG Project (.tcfg)", &["tcfg"])
        .set_file_name("mysyntax.tcfg")
        .save_file()
        .ok_or(InvokeError::from("File not specified."))?;

    let project = Project::new();
    let _ = serde_xml_rs::to_string(&project).unwrap();

    // let mut f = File::create(path).unwrap();
    // write!(&mut f, "{}", project).unwrap();

    Ok(())
}
