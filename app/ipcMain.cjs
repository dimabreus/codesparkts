const { ipcMain, dialog } = require('electron');
const fs = require('fs').promises;
const { exec } = require('child_process');
let currentDir = process.cwd();  // начальная директория установлена на директорию запуска приложения

ipcMain.handle('run-command', (event, command) => {
    // Обработка команды cd особенно, чтобы обновить currentDir
    if (command.trim().startsWith('cd ')) {
        const newDir = command.trim().substring(3).trim();
        try {
            process.chdir(newDir);  // пытаемся сменить директорию
            currentDir = process.cwd();  // обновляем текущую директорию
            return Promise.resolve(`Changed directory to ${currentDir}`);
        } catch (error) {
            return Promise.reject(`Error changing directory: ${error.message}`);
        }
    }

    const powershellCommand = `$OutputEncoding = [Console]::OutputEncoding = [System.Text.Encoding]::UTF8; ${command}`;
    return new Promise((resolve, reject) => {
        exec(powershellCommand, { shell: 'bash', cwd: currentDir, encoding: 'utf8' }, (error, stdout, stderr) => {
            if (error) {
                reject(stderr);
            } else {
                resolve(stdout);
            }
        });
    });
});

ipcMain.handle('dialog:openFile', async () => {
    const { filePaths } = await dialog.showOpenDialog({
        properties: ['openFile']
    });
    if (filePaths.length === 0) {
        return null;
    } else {
        return filePaths[0];
    }
});

ipcMain.handle('dialog:saveFile', async () => {
    const { filePath } = await dialog.showSaveDialog({
        properties: ['showOverwriteConfirmation']
    });
    return filePath;
});

ipcMain.handle('read-file', async (event, filePath) => {
    return fs.readFile(filePath, 'utf-8');
});

ipcMain.handle('save-file', async (event, filePath, content) => {
    return fs.writeFile(filePath, content, 'utf-8');
});