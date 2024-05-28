import { FunctionComponent, useState } from 'react';
import './Structure.css';

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

const Structure: FunctionComponent<StructureProps> = ({ files, setFilePath }) => {
    const [openDirs, setOpenDirs] = useState<string[]>([]);

    const toggleDir = (dir: string) => {
        if (openDirs.includes(dir)) {
            setOpenDirs(openDirs.filter(openDir => openDir !== dir));
        } else {
            setOpenDirs([...openDirs, dir]);
        }
    };

    const renderFiles = (files: File[]) => (
        <>
            {files.map((file: File, index: number) => (
                <div key={index}>
                    {file.type === 'file' ? (
                        <div className="file item">
                            <button
                                onClick={() => {
                                    setFilePath(file.dir);
                                }}
                            >{file.filename}</button>
                        </div>
                    ) : (
                        <div className="directory item">
                            <button
                                onClick={() => toggleDir(file.dir)}
                                style={{ textDecoration: openDirs.includes(file.dir) ? 'underline' : 'none' }}
                            >
                                {openDirs.includes(file.dir) ? '\u25BE' : '\u25B8'} {file.dirname}
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

    return (
        <div className="structure-container">
            {renderFiles(files)}
        </div>
    );
};

export default Structure;
