# CodeSpark
## CodeSpark - это редактор кода, написанный на Typescript React + Electron, аналог VS Code

![image](https://github.com/dimabreus/codesparkts/assets/125917095/3c1d5e09-f77e-44a0-97cf-b2a16f3e6ec9)

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



### Исправление проблемы с модулем `node-pty` в проекте

Если при запуске проекта возникает ошибка, связанная с модулем `node-pty`, вот несколько шагов для её исправления:

1. **Удаление `node-pty` и переустановка с пересборкой:**
   ```bash
   npm uninstall node-pty
   npm cache clean --force
   npm install node-pty
   npm rebuild
   ```

2. **Использование `electron-rebuild`:**
   Установите `electron-rebuild` и запустите его:
   ```bash
   npm install --save-dev electron-rebuild
   npx electron-rebuild
   ```

### Как внести вклад

Мы рады любому вкладу в проект CodeSpark! Вот несколько способов, как вы можете помочь:

1. **Создание запросов на изменение (Pull Requests):**
   Если у вас есть идеи для новых функций, исправления ошибок или улучшения кода, создайте pull request. Постарайтесь, чтобы ваш код был чистым и сопровождался описанием внесенных изменений.

2. **Сообщение об ошибках (Issues):**
   Нашли баг или у вас есть предложение? Создайте issue! Чем подробнее вы опишете проблему или идею, тем лучше. Скриншоты и примеры кода тоже очень помогают.

3. **Тестирование и отзывы:**
   Попробуйте наш проект, и расскажите нам, что думаете! Ваши отзывы о том, что работает, а что нет, очень важны для нас.

### Библиотеки из Visual Studio Code:
1. [Monaco Editor](https://www.npmjs.com/package/monaco-editor)
2. [Xterm.js](https://www.npmjs.com/package/@xterm/xterm)
- 2.1 [node-pty](https://www.npmjs.com/package/node-pty)
3. [JsChardet](https://www.npmjs.com/package/jschardet)

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
  - `assets/`
    - `icons/` - папка с иконками файлов и директорий
