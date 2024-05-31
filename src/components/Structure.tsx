import { FunctionComponent, useState, useEffect, useRef } from 'react';
import './Structure.css';
import { getIconForFile, getIconForFolder, getIconForOpenFolder } from 'vscode-icons-js';
import { ipcRenderer } from '../electron/ipcHandlers';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

interface StructureProps {
    files: File[];
    setFilePath: (path: string) => void;
}

interface File {
    dir: string;
    type: 'file' | 'dir';
    filename?: string;
    dirname?: string;
    files?: File[];
}

const ignoredFiles = [
    '.git', '.DS_Store', 'Thumbs.db',
    '.idea', '.vscode', 'venv', 'vendor', '*.log', 'tmp', '*.swp', '.svn', '.hg'
];

const shouldIgnoreFile = (file: File): boolean => {
    if (file.type === 'file' && file.filename) {
        return ignoredFiles.some(ignored => file.filename!.includes(ignored));
    }
    if (file.type === 'dir' && file.dirname) {
        return ignoredFiles.includes(file.dirname);
    }
    return false;
};

const Structure: FunctionComponent<StructureProps> = ({ files, setFilePath }) => {
    const [openDirs, setOpenDirs] = useState<string[]>([]);
    const [renamePath, setRenamePath] = useState<string | null>(null);
    const [newName, setNewName] = useState<string>('');
    const [deletePath, setDeletePath] = useState<string | null>(null);

    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (renamePath && inputRef.current) {
            inputRef.current.focus();
        }
    }, [renamePath]);

    const toggleDir = (dir: string) => {
        if (openDirs.includes(dir)) {
            setOpenDirs(openDirs.filter(openDir => openDir !== dir));
        } else {
            setOpenDirs([...openDirs, dir]);
        }
    };

    const handleRename = async (path: string) => {
        const newPath = path.split('/').slice(0, -1).concat(newName).join('/');
        console.log(`Renaming ${path} to ${newPath}`);
        const response = await ipcRenderer.invoke('rename-path', path, newPath);
        if (response.success) {
            console.log('Rename successful');
            setRenamePath(null);
            setNewName('');
            setFilePath('');
            setFilePath(newPath);
        } else {
            console.error('Error renaming path:', response.error);
        }
    };

    const handleDelete = async (path: string) => {
        console.log(`Deleting ${path}`);
        const response = await ipcRenderer.invoke('delete-path', path);
        if (response.success) {
            console.log('Delete successful');
            setDeletePath(null);
            setFilePath('');
            setFilePath(path.split('/').slice(0, -1).join('/'));
        } else {
            console.error('Error deleting path:', response.error);
        }
    };

    const renderFiles = (files: File[]) => {
        const filteredAndSortedFiles = [...files]
            .filter(file => !shouldIgnoreFile(file))
            .sort((a, b) => {
                if (a.type === b.type) {
                    return 0;
                }
                return a.type === 'dir' ? -1 : 1;
            });

        return (
            <>
                {filteredAndSortedFiles.map((file: File, index: number) => (
                    <div key={index}>
                        {file.type === 'file' ? (
                            <div className="file item">
                                <button onClick={() => setFilePath(file.dir)}>
                                    <img className='icon' src={'./src/assets/icons/' + getIconForFile(file.filename!)} />
                                    <span>{file.filename}</span>
                                </button>
                                <button onClick={() => setRenamePath(file.dir)}>Rename</button>
                                <button onClick={() => setDeletePath(file.dir)}>Delete</button>
                            </div>
                        ) : (
                            <div className="directory item">
                                <button onClick={() => toggleDir(file.dir)} style={{ textDecoration: openDirs.includes(file.dir) ? 'underline' : 'none' }}>
                                    <img className='icon' src={'./src/assets/icons/' + (openDirs.includes(file.dir) ? getIconForOpenFolder(file.dirname!) : getIconForFolder(file.dirname!))} />
                                    <span>{file.dirname}</span>
                                </button>
                                <button onClick={() => setRenamePath(file.dir)}>Rename</button>
                                <button onClick={() => setDeletePath(file.dir)}>Delete</button>
                                {openDirs.includes(file.dir) && (
                                    <div style={{ marginLeft: '20px' }}>
                                        {renderFiles(file.files || [])}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </>
        );
    };

    const handleKeyDownRename = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && renamePath) {
            handleRename(renamePath);
        }
    };

    const handleKeyDownDelete = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter' && deletePath) {
            handleDelete(deletePath);
        }
    };

    return (
        <div className="structure-container">
            {renderFiles(files)}
            {/* Модальное окно для переименования */}
            {renamePath && (
                <Modal show={true} onHide={() => setRenamePath(null)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Enter new name:</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <input
                            type="text"
                            className="form-control"
                            value={newName}
                            onChange={e => setNewName(e.target.value)}
                            onKeyDown={handleKeyDownRename}
                            ref={inputRef}
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={() => handleRename(renamePath)}>Rename</Button>
                        <Button variant="secondary" onClick={() => setRenamePath(null)}>Cancel</Button>
                    </Modal.Footer>
                </Modal>
            )}

            {/* Модальное окно для удаления */}
            {deletePath && (
                <Modal show={true} onHide={() => setDeletePath(null)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Are you sure you want to delete this item?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body tabIndex={0} onKeyDown={handleKeyDownDelete}>
                        Press Enter to confirm deletion.
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={() => handleDelete(deletePath)}>Delete</Button>
                        <Button variant="secondary" onClick={() => setDeletePath(null)}>Cancel</Button>
                    </Modal.Footer>
                </Modal>
            )}
        </div>
    );
};

export default Structure;
