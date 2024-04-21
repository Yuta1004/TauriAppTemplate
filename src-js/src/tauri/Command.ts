import { invoke } from "@tauri-apps/api/tauri";
import { listen } from "@tauri-apps/api/event";

export function openProject(callback: () => void) {
    const wrappedCallback = (xml: string|null) => xml && callback();
    const ipc = async () => {
        invoke<string | null>("open_project", {}).then(wrappedCallback);
    };
    ipc();
};

export async function saveProject(callback: () => void) {
    const ipc = async () => {
        invoke<void>("save_project", {}).then(callback);
    };
    ipc();
};

export async function exportProject(callback: () => void) {
    const ipc = async () => {
        invoke<string>("export_project", {}).then(callback);
    };
    ipc();
};

export function createSubprocess(stdout_handler: (line: string) => void, callback: () => void) {
    const ipc = async () => {
        listen("subprocess_stdout", event => {
            stdout_handler(typeof event.payload === "string" ? event.payload : "")
        });
        invoke<void>("create_subprocess", {}).then(callback);
    };
    ipc();
}

export function connectSubprocess(msg: string, callback: () => void) {
    const ipc = async () => {
        invoke<void>("connect_subprocess", { msg }).then(callback);
    };
    ipc();
}

export function finishSubprocess(callback: () => void) {
    const ipc = async () => {
        invoke<void>("finish_subprocess", {}).then(callback);
    };
    ipc();
}
