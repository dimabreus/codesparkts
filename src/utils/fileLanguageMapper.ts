function fileLanguageMapper(extension: string): string {
    const mapping: { [key: string]: string } = {
        'js': 'javascript',
        'cjs': 'javascript',
        'ts': 'typescript',
        'tsx': 'typescript',
        'json': 'json',
        'svg': 'svg',
        'py': 'python',
        'md': 'markdown',
        'html': 'html',
        'txt': 'plaintext'
    };

    return mapping[extension] || 'plaintext';
}

export default fileLanguageMapper;