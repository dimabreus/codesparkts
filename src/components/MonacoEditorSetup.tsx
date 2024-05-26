import { FunctionComponent, useRef } from 'react'
import MonacoEditor, { loader } from '@monaco-editor/react'
import * as monaco from 'monaco-editor';

loader.config({
    paths: {
        vs: './node_modules/monaco-editor/min/vs'
    }
});

interface MonacoEditorSetupProps {
    onEditorMounted: (editor: monaco.editor.IStandaloneCodeEditor | null) => void;
    language: string;
    editorValue: string;
    setEditorValue: (value: string) => void;
}

const MonacoEditorSetup: FunctionComponent<MonacoEditorSetupProps> = ({ onEditorMounted, language, editorValue, setEditorValue }) => {
    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

    function handleEditorDidMount(editor: monaco.editor.IStandaloneCodeEditor) {
        editorRef.current = editor;
        onEditorMounted(editor);
    }

    function handleEditorChange(value: string | undefined) {
        if (value !== undefined) {
            setEditorValue(value);
        }
    }

    return (
        <div className='Editor'>
        {/* <div> */}
            <MonacoEditor
                key={language}
                // height="70vh"
                // height={'100%'}
                defaultLanguage={language}
                value={editorValue}
                onChange={handleEditorChange}
                theme='vs-dark'
                onMount={handleEditorDidMount}
            />
        </div>

    )
}

export default MonacoEditorSetup