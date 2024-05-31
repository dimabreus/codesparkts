const { ipcMain, dialog } = require('electron');
const fs = require('fs');
const jschardet = require('jschardet');
const path = require('path');

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
    try {
        const buffer = await fs.promises.readFile(filePath);

        const detected = jschardet.detect(buffer);
        console.log(`Detected encoding: ${detected.encoding}`)
        const encoding = detected.encoding || 'utf-8';

        const text = buffer.toString(encoding);

        return text;
    } catch (error) {
        console.error('Error reading file:', error);
        throw error;
    }
});

ipcMain.handle('save-file', async (event, filePath, content) => {
    return fs.promises.writeFile(filePath, content, 'utf-8');
});

function readFiles(directoryPath) {
    const result = [];
    const files = fs.readdirSync(directoryPath);

    files.forEach(file => {
        const filePath = path.join(directoryPath, file);

        const stats = fs.statSync(filePath);

        const item = {
            dir: filePath,
        };

        if (stats.isFile()) {
            item.type = 'file';
            item.filename = file;
        } else if (stats.isDirectory()) {
            item.type = 'dir';
            item.dirname = file;
            item.files = readFiles(filePath);
        }

        result.push(item);
    });

    return result;
};

ipcMain.handle('read-directory', async (event, directory) => {
    return readFiles(directory)
});