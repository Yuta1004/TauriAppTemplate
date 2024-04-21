#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod command;
mod project;

fn main() -> anyhow::Result<()> {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            command::open_project,
            command::save_project,
            command::export_project,
            command::create_subprocess,
            command::connect_subprocess,
            command::finish_subprocess,
        ])
        .run(tauri::generate_context!())?;
    Ok(())
}
