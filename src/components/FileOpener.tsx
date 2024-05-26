import { useEffect, useState, FunctionComponent } from 'react';
import MonacoEditorSetup from "./MonacoEditorSetup";
import fileLanguageMapper from "../utils/fileLanguageMapper";
import { ipcRenderer } from "../electron/ipcHandlers";
import * as monaco from 'monaco-editor';

interface FileOpenerProps {
    filePath: string
    setFilePath: (path: string) => void
}
const FileOpener: FunctionComponent<FileOpenerProps> = ({ filePath, setFilePath }) => {
    // const [filePath, setFilePath] = useState<string>('');
    const [fileLanguage, setFileLanguage] = useState<string>('javascript');
    const [editorValue, setEditorValue] = useState<string>("// Hello, World!");
    const [_, setEditor] = useState<monaco.editor.IStandaloneCodeEditor | null>(null);

    async function handleOpen() {
        const path: string = await ipcRenderer.invoke('dialog:openFile');
        if (path) {
            setFilePath(path);
        };
    };

    async function open(path: string) {
        if (path) {
            const extension: string | undefined = path.split('.').pop();
            const language: string = fileLanguageMapper(extension || '');
            console.log(`Language ${language}`);
            setFileLanguage(language);
            const content: string = await ipcRenderer.invoke('read-file', path);
            setEditorValue(content);
        }
    }

    useEffect(() => {
        open(filePath)
    }, [filePath])

    async function handleSave() {
        if (!filePath) {
            const newPath: string = await ipcRenderer.invoke('dialog:saveFile');
            if (newPath) {
                setFilePath(newPath);
            } else {
                return;
            };
        };
        await ipcRenderer.invoke('save-file', filePath, editorValue);
    };

    useEffect(() => {
        ipcRenderer.on('open-file', handleOpen);
        ipcRenderer.on('save-file', handleSave);

        return () => {
            ipcRenderer.removeListener('open-file', handleOpen);
            ipcRenderer.removeListener('save-file', handleSave);
        }
    }, [handleOpen, handleSave])

    useEffect(() => {
        const directory = filePath.split('/');
        directory.pop();
        ipcRenderer.send('terminal.keystroke', `cd ${directory.join('/')}\r`);
    }, [filePath])

    return (
        <div className="FileOpener">
            <MonacoEditorSetup
                onEditorMounted={setEditor}
                language={fileLanguage}
                editorValue={editorValue}
                setEditorValue={setEditorValue}
            />
        </div>
    )
}

export default FileOpener