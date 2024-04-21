import { useState } from "react";

import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import StatusPanel from "./StatusPanel";
import TerminalPanel from "./TerminalPanel";

type SideViewProps = {};

export default function SideView(props: SideViewProps) {
    const [tabStat, setTabStat] = useState<number>(0);

    return (
        <Box>
            <Tabs
                value={tabStat}
                onChange={(_, newStat) => setTabStat(newStat)}
                centered
            >
                <Tab label="Status" />
                <Tab label="Terminal" />
            </Tabs>
            <div style={{
                margin: "8px",
                height: "calc(100vh - 128px)",
                overflowY: "auto"
            }}>
                <div style={{ display: tabStat === 0 ? "inline" : "none" }}>
                    <StatusPanel />
                </div>
                <div style={{ display: tabStat === 1 ? "inline" : "none" }}>
                    <TerminalPanel />
                </div>
            </div>
        </Box>
    );
}
