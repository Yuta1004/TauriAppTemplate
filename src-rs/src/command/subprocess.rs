use std::io::{BufRead, BufReader, Write};
use std::process::{Child, Command};
use std::sync::{Arc, Mutex};
use std::thread;

use os_pipe::PipeWriter;
use tauri::{AppHandle, InvokeError, Manager};

static mut SUBPROCESS: Option<Arc<Mutex<Subprocess>>> = None;

#[tauri::command]
pub fn create_subprocess(app: AppHandle) -> Result<(), InvokeError> {
    unsafe {
        if SUBPROCESS.is_some() {
            return Err(InvokeError::from("Subprocess is already launched."));
        }
    }

    let stdout_handler = move |line: &str| {
        app.emit_all("subprocess_stdout", line).unwrap();
    };

    match Subprocess::new("bash", stdout_handler) {
        Ok(subprocess) => {
            unsafe {
                SUBPROCESS = Some(subprocess);
            }
            Ok(())
        }
        Err(err) => Err(InvokeError::from(format!("{}", err))),
    }
}

#[tauri::command]
pub fn connect_subprocess(msg: &str) -> Result<(), InvokeError> {
    let subprocess = unsafe {
        match &SUBPROCESS {
            Some(subprocess) => subprocess,
            None => return Err(InvokeError::from("Subprocess is not launched.")),
        }
    };

    Subprocess::stdin(Arc::clone(subprocess), msg).unwrap();

    Ok(())
}

#[tauri::command]
pub fn finish_subprocess() -> Result<(), InvokeError> {
    let subprocess = unsafe {
        match &SUBPROCESS {
            Some(subprocess) => subprocess,
            None => return Err(InvokeError::from("Subprocess is not launched.")),
        }
    };

    Subprocess::kill(Arc::clone(subprocess)).unwrap();
    unsafe {
        SUBPROCESS = None;
    }

    Ok(())
}

struct Subprocess {
    process: Child,
    stdin: PipeWriter,
    stdout_handler: Box<dyn Fn(&str) + Send>,
}

impl Subprocess {
    #[allow(clippy::manual_flatten)]
    pub fn new<F>(cmd: &str, stdout_handler: F) -> anyhow::Result<Arc<Mutex<Self>>>
    where
        F: Fn(&str) + Send + 'static,
    {
        // Spawn subprocess
        let (stdin_process, stdin_us) = os_pipe::pipe()?;
        let (stdout_us, stdout_process) = os_pipe::pipe()?;
        let process = Command::new(cmd)
            .stdin(stdin_process)
            .stdout(stdout_process.try_clone().unwrap())
            .stderr(stdout_process)
            .spawn()?;

        // Init myself
        let subprocess = Subprocess {
            process,
            stdin: stdin_us,
            stdout_handler: Box::new(stdout_handler),
        };
        let subprocess = Arc::new(Mutex::new(subprocess));

        // Start thread to capture stdout
        let subprcess_in_thread = Arc::clone(&subprocess);
        thread::spawn(move || {
            for line in BufReader::new(stdout_us).lines() {
                if let Ok(line) = line {
                    subprcess_in_thread.lock().unwrap().stdout_handler.as_ref()(&line);
                }
            }
        });

        Ok(subprocess)
    }

    pub fn stdin(subprocess: Arc<Mutex<Self>>, input: &str) -> anyhow::Result<()> {
        let mut stdin = &subprocess.lock().unwrap().stdin;
        write!(&mut stdin, "{}", input)?;
        Ok(())
    }

    pub fn kill(subprocess: Arc<Mutex<Self>>) -> anyhow::Result<()> {
        subprocess.lock().unwrap().process.kill()?;
        Ok(())
    }
}
