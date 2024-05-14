import { FitAddon } from "@xterm/addon-fit";
import { useEffect, useRef } from "react";
import { Terminal as XtermTerminal } from '@xterm/xterm';
import { ipcRenderer } from "../electron/ipcHandlers";
import '@xterm/xterm/css/xterm.css';

const Terminal = () => {
    const terminalRef = useRef<HTMLDivElement | null>(null);
    const terminal = useRef<XtermTerminal | null>(null);
    const fitAddon = useRef<FitAddon>(new FitAddon());

    useEffect(() => {
        terminal.current = new XtermTerminal({
            cursorBlink: true,
            theme: {
                background: '1e1e1e',
                foreground: '#ffffff'
            }
        });

        terminal.current.loadAddon(fitAddon.current);
        if (terminalRef.current != null) {
            terminal.current.open(terminalRef.current);
        };
        setTimeout(() => fitAddon.current.fit(), 0)

        const handleResize = () => {
            setTimeout(() => fitAddon.current.fit(), 0);
        };
        window.addEventListener('resize', handleResize);

        let commandBuffer: string = '';

        terminal.current.write('$ ');

        terminal.current.onData(data => {
            switch (data) {
                case '\r':
                    processCommand(commandBuffer);
                    commandBuffer = '';
                    break;
                case '\u007F':
                    if (terminal.current?.buffer.active.cursorX && terminal.current?.buffer.active.cursorX > 2) {
                        commandBuffer = commandBuffer.slice(0, -1);
                        terminal.current?.write('\b \b');
                    }
                    break;
                default:
                    commandBuffer += data;
                    terminal.current?.write(data);
                    break;
            };
            console.log(`Current command: ${commandBuffer}`);
        });

        const processCommand = async (command: string) => {
            console.log(`Executing command: ${command}`);
            if (!command.trim()) return
            terminal.current?.writeln('');
            try {
                const result: string = await ipcRenderer.invoke('run-command', command);
                terminal.current?.writeln(result);
                console.log(`Result of ${command}:`, result);
            } catch (error) {
                console.error(error);
                terminal.current?.writeln(`Error ${error}`);
            }
            terminal.current?.write('$ ');
        };

        return () => {
            terminal.current?.dispose();
            window.removeEventListener('resize', handleResize);
        }
    }, [])
    return (
        <div className="Terminal" style={{ width: '100%', height: '100%' }}>
            <div ref={terminalRef} style={{ width: '100%', height: '100%' }} />
        </div>
    )
}

export default Terminal