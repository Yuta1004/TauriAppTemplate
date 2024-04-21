import { useState, useEffect } from "react";

import AppBar from "@mui/material/AppBar";
import ToolBar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { AlertColor } from "@mui/material/Alert";

import Split from "react-split";

import Editor from "../components/Editor";
import SideView from "../components/SideView";
import AlertPopup from "../components/AlertPopup";

import {
    openProject,
    saveProject,
    exportProject,
} from "../tauri/Command";

export default function App() {
    const [status, setStatus] = useState<[AlertColor, string]>(["success", ""]);

    return (<>
        <AppBar position="static">
            <ToolBar>
                <Typography
                    variant="h5"
                    component="div"
                    sx={{ flexGrow: 1 }}
                >
                    App
                </Typography>
                <Button
                    color="inherit"
                    onClick={() => openProject(() => {
                        setStatus(["success", "The project has been successfully opened."]);
                    })}
                >
                    Open
                </Button>
                <Button
                    color="inherit"
                    onClick={() => saveProject(() => {
                        setStatus(["success", "The project has been successfully saved."]);
                    })}
                >
                    Save
                </Button>
                <Button
                    color="inherit"
                    onClick={() => exportProject(() => {
                        setStatus(["success", "The project has been successfully exported."]);
                    })}
                >
                    Export
                </Button>
            </ToolBar>
        </AppBar>
        <Split
            className="split-flex"
            gutterSize={5}
            sizes={[60, 40]}
            direction="horizontal"
        >
            <Editor/>
            <SideView/>
        </Split>
        <AlertPopup
            posX="10px"
            posY="calc(100vh - 92px)"
            kind={status[0]}
            message={status[1]}
        />
    </>);
}
