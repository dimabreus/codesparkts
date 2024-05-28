import FileOpener from './components/FileOpener';
import "./App.css";
import Terminal from './components/Terminal';
import Structure from './components/Structure';
import { ipcRenderer } from './electron/ipcHandlers';
import { useEffect, useState } from 'react';
import SplitPane, { Pane } from 'split-pane-react';
import 'split-pane-react/esm/themes/default.css';

function App() {
  const [files, setFiles] = useState([]);
  const [filePath, setFilePath] = useState<string>('');
  const [sizes, setSizes] = useState([150, 'auto']);
  const [sizes2, setSizes2] = useState(['70%', 'auto']);

  const resize = () => {
    const resizeEvent = new Event('resize');
    window.dispatchEvent(resizeEvent);
  };

  useEffect(() => {
    requestAnimationFrame(resize);
  }, []);

  const setSizesAndResize = (setSizesFunc: (args: any) => void, args: any) => {
    resize();
    setSizesFunc(args);
  };

  const layoutCSS = {
    height: '100%',
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const directory = filePath.split('/');
        directory.pop();
        const filesFromIPC = await ipcRenderer.invoke('read-directory', directory.join('/') || process.cwd());
        setFiles(filesFromIPC);
      } catch (error) {
        console.error('Ошибка при получении файлов:', error);
      }
    };

    fetchData();
  }, [filePath]);

  return (
    <>
      <SplitPane // Structure and EditorTerminal
        split='vertical'
        sizes={sizes}
        onChange={(args) => setSizesAndResize(setSizes, args)}
      >
        <Pane minSize={150} maxSize='30%'>
          <div className="Structure" style={{ ...layoutCSS }}>
            <Structure
              files={files}
              setFilePath={setFilePath}
            />
          </div>
        </Pane>
        <SplitPane // Editor and terminal
          className='EditorTerminal'
          split='horizontal'
          sizes={sizes2}
          onChange={(args) => setSizesAndResize(setSizes2, args)}
        >
          <Pane minSize={150} maxSize='80%'>
            <div className="EditorContainer">
              <FileOpener
                filePath={filePath}
                setFilePath={setFilePath}
              />
            </div>
          </Pane>
          <div className="Terminal">
            <Terminal />
          </div>
        </SplitPane>
      </SplitPane>
      <div className="container flex">
      </div>
    </>
  )
}

export default App
