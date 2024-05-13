function fileLanguageMapper(extension: string): string {
    const mapping: { [key: string]: string } = {
        'js': 'javascript',
        'ts': 'typescript',
        'py': 'python',
        'md': 'markdown',
        'txt': 'plaintext'
    };

    return mapping[extension] || 'plaintext';
}

export default fileLanguageMapper;