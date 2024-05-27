# CodeSpark
## CodeSpark - это редактор кода, написанный на Typescript React + Electron, аналог VS Code

### Как запустить?
1. Склонировать репозиторий:
```bash
git clone https://github.com/dimabreus/codesparkts.git
```
2. Перейти в директорию проекта:
```bash
cd codesparkts
```
3. Установить зависимости:
```bash
npm i
```
4. Запустить Front-end (React) часть приложения:
```bash
npm run rstart
```
5. Заменить URL к React приложению на актуальный на `18` строчке `app/main.cjs`
6. Запустить Back-end (Electron) часть приложения:
```bash
npm run estart
```

### Библиотеки из Visual Studio Code:
1. [Monaco Editor](https://www.npmjs.com/package/monaco-editor)
2. [Xterm.js](https://www.npmjs.com/package/@xterm/xterm)
- 2.1 [node-pty](https://www.npmjs.com/package/node-pty)
