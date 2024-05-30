const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');
const pty = require('node-pty');
const os = require('os');

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    win.loadURL('http://localhost:5176/'); // URL вашего React-приложения
    // win.loadFile(path.join(__dirname, 'index.html'));
    win.webContents.openDevTools();

    const menu = Menu.buildFromTemplate([
        {
            label: 'File',
            submenu: [
                {
                    label: 'Open',
                    accelerator: 'CmdOrCtrl+O',
                    click: () => win.webContents.send('open-file')
                },
                {
                    label: 'Save',
                    accelerator: 'CmdOrCtrl+S',
                    click: () => win.webContents.send('save-file')
                },
                {
                    label: 'Reload',
                    accelerator: 'CmdOrCtrl+R',
                    click: () => win.webContents.reload()
                },
                {
                    label: 'Quit',
                    accelerator: 'CmdOrCtrl+Q',
                    click: () => app.quit()
                }
            ]
        }
    ]);

    Menu.setApplicationMenu(menu);

    const shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';
    const ptyProcess = pty.spawn(shell, [], {
        name: 'xterm-color',
        cwd: './',
        env: { ...process.env, PS1: '\\u@\\h \\W $ ' }
        // env: process.env
    });

    ptyProcess.on('data', function (data) {
        win.webContents.send('terminal.incomingData', data);
    });

    ipcMain.on('terminal.keystroke', (event, input) => {
        ptyProcess.write(input);
    });
}

require("./ipcMain.cjs")

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});