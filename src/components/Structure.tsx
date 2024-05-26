import { FunctionComponent, useState } from 'react';

interface StructureProps {
    files: File[];
    setFilePath: (path: string) => void
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

    return (
        <div>
            {files.map((file: File, index: number) => (
                <div key={index}>
                    {file.type === 'file' ? (
                        <div className="file">
                            <button
                                onClick={() => {
                                    setFilePath(file.dir);
                                    // TODO: вызвать метод, открытия файла с file.path из FileOpener
                                }}
                            >{file.filename}</button>
                        </div>
                    ) : (
                        <div className="directory">
                            <button
                                onClick={() => toggleDir(file.dir)}
                                style={{ textDecoration: openDirs.includes(file.dir) ? 'underline' : 'none' }}
                            >
                                {openDirs.includes(file.dir) ? '\u25BE' : '\u25B8'} {file.dirname}
                            </button>
                            {openDirs.includes(file.dir) && (
                                <div style={{ marginLeft: '20px' }}>
                                    {/* Рекурсивно вызываем Structure для отображения вложенных директорий */}
                                    <Structure files={file.files || []} setFilePath={setFilePath} />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default Structure;
