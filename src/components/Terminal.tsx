import React, { useEffect, useRef } from 'react';
import { ITerminalOptions, Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';
import { ipcRenderer } from '../electron/ipcHandlers';
import { Unicode11Addon } from '@xterm/addon-unicode11';
import { WebglAddon } from '@xterm/addon-webgl';

const XTermComponent: React.FC = () => {
    const terminalRef = useRef<HTMLDivElement>(null);
    const xterm = useRef<Terminal | null>(null);
    const fitAddon = useRef<FitAddon>(new FitAddon());
    const unicode11Addon = useRef<Unicode11Addon>(new Unicode11Addon());
    const webglAddon = useRef<WebglAddon>(new WebglAddon());

    useEffect(() => {
        const options: ITerminalOptions = {
            theme: {
                background: '#1c1c1c',
                foreground: '#ffffff'
            },
            allowProposedApi: true
        };
        
        xterm.current = new Terminal(options);
        xterm.current.loadAddon(fitAddon.current);
        xterm.current.loadAddon(unicode11Addon.current);
        xterm.current.loadAddon(webglAddon.current);
    
        if (terminalRef.current) {
            xterm.current.open(terminalRef.current);
            requestAnimationFrame(() => {
                fitAddon.current.fit(); // Вызывается на следующем кадре анимации
            });
        }
    
        ipcRenderer.on('terminal.incomingData', (_: any, data: any) => {
            xterm.current?.write(data);
        });
    
        xterm.current.onData(input => {
            ipcRenderer.send('terminal.keystroke', input);
        });

        ipcRenderer.send('terminal.keystroke', "clear\r");    
        const handleResize = () => {
            if (fitAddon.current) {
                requestAnimationFrame(() => {
                    fitAddon.current.fit(); // Вызывается на следующем кадре анимации
                });
            }
        };
    
        window.addEventListener('resize', handleResize);
    
        return () => {
            ipcRenderer.removeAllListeners('terminal.incomingData');
            window.removeEventListener('resize', handleResize);
            xterm.current?.dispose();
        };
    }, []);
    

    return <div ref={terminalRef} style={{ width: '100%', height: '100%' }} />;
};

export default XTermComponent;
