/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import { app } from 'electron';
import AppUpdater from './core/app-updater';
import WindowManager from './core/window-manager';
import registerAllHandlers from './handlers';

// 初始化核心模块
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const appUpdater = new AppUpdater();
const windowManager = new WindowManager();

// 设置生产环境的 source map 支持
if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

// 设置开发环境的调试工具
const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug').default();
}

// 创建窗口的函数
const createWindow = async () => {
  await windowManager.createWindow();
};

// 初始化 IPC 通信
registerAllHandlers();

/**
 * 应用事件监听器
 */
app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (windowManager.getMainWindow() === null) {
        createWindow();
      }
    });
  })
  .catch(console.log);
