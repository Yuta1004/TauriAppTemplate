import { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import Switch from "@mui/material/Switch";

import Terminal, { ColorMode, TerminalOutput } from "react-terminal-ui";

import {
    createSubprocess,
    connectSubprocess,
    finishSubprocess
} from "../tauri/Command";

const Dark = ColorMode.Dark;
const Light = ColorMode.Light;

type TerminalPanelProps = {}

export default function TerminalPanel(props: TerminalPanelProps) {
    // States
    const [color, setColor] = useState<ColorMode>(ColorMode.Light);
    const [lines, setLines] = useState<JSX.Element[]>([
        <TerminalOutput>Welcome to Terminal.</TerminalOutput>,
        <TerminalOutput>Type 'help' to show available commmands.</TerminalOutput>
    ]);

    // Subprocess
    useEffect(() => {
        createSubprocess(
            (line) => {
                setLines(lines => {
                    return [
                        ...lines,
                        <TerminalOutput>{line}</TerminalOutput>,
                    ];
                });
            },
            () => {}
        );
    }, []);

    const evalInput = (input: string) => {
        setLines(lines => {
            return [
                ...lines,
                <TerminalOutput>{">> " + input}</TerminalOutput>,
            ];
        });
        connectSubprocess(input+"\n", () => {});
    };

    // Setup terminal scroll
    (() => {
        if (typeof document !== "undefined") {
            const terminal = document.getElementsByClassName("react-terminal")[0] as HTMLDivElement;
            if (terminal != null) {
                const observer = new MutationObserver(() => {
                    terminal.scroll(0, terminal.scrollHeight - terminal.clientHeight);
                });
                observer.observe(terminal, { childList: true });
            }
        }
    })();

    return (
        <Box style={{ height: "100%" }}>
            <div
                style={{
                    position: "absolute",
                    right: "8px",
                    zIndex: 9999,
                }}
            >
                <Switch onChange={(event) => setColor(event.target.checked ? Dark : Light)}/>
            </div>
            <Terminal
                height="100%"
                colorMode={color}
                prompt=">>"
                onInput={evalInput}
            >
                { lines }
            </Terminal>
        </Box>
    );
}
