import { FunctionComponent, useState } from 'react';
import './Structure.css';
import { getIconForFile, getIconForFolder, getIconForOpenFolder } from 'vscode-icons-js';

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

// Список игнорируемых файлов и директорий
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

    const toggleDir = (dir: string) => {
        if (openDirs.includes(dir)) {
            setOpenDirs(openDirs.filter(openDir => openDir !== dir));
        } else {
            setOpenDirs([...openDirs, dir]);
        }
    };

    const renderFiles = (files: File[]) => {
        // Фильтрация и сортировка файлов: директории впереди
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
                                <button
                                    onClick={() => {
                                        setFilePath(file.dir);
                                    }}
                                >
                                    <img className='icon' src={'./src/assets/icons/' + getIconForFile(file.filename!)} />
                                    <span>{file.filename}</span>
                                </button>
                            </div>
                        ) : (
                            <div className="directory item">
                                <button
                                    onClick={() => toggleDir(file.dir)}
                                    style={{ textDecoration: openDirs.includes(file.dir) ? 'underline' : 'none' }}
                                >
                                    <img className='icon' src={'./src/assets/icons/' + (openDirs.includes(file.dir) ? getIconForOpenFolder(file.dirname!) : getIconForFolder(file.dirname!))} />
                                    <span>{file.dirname}</span>
                                </button>
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

    return (
        <div className="structure-container">
            {renderFiles(files)}
        </div>
    );
};

export default Structure;
