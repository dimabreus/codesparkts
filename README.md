# CodeSpark
## CodeSpark - это редактор кода, написанный на Typescript React + Electron, аналог VS Code
![image](https://github.com/dimabreus/codesparkts/assets/125917095/3b68b7dd-4007-49de-a299-6f8ed2a0b909)

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

### Путеводитель:
- `app/`
  - `main.cjs` - главный файл Electron'a
  - `ipcMain.cjs` - настройка ipcMain
- `src/`
  - `App.tsx` - главная компонента, соединяет `Structure`, `FileOpener` и `Terminal` в одно, использует react split pane, объявляет основные переменные
  - `App.css` - главные стили
  - `components/`
    - `FileOpener.tsx` - компонента с эдитором и функционалом открытия/сохранения файлов, использует компоненту `MonacoEditorSetup`
    - `MonacoEditorSetup.tsx` - компонента с базовыми настройками `Monaco Editor`
    - `Structure.tsx` - компонента со структурой файлов в директории
    - `Terminal.tsx` - компонента с терминалом
  - `electron/`
    - `IpcHandlers.ts` - файл с IpcRenderer
  - `utils/`
    - `fileLanguageMapper.ts`- файл для перевода расширения файла в название языка для `Monaco Editor`
