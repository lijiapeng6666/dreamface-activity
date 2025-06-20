import path from 'path';
import { app, BrowserWindow, shell } from 'electron';
import installer, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';
import { resolveHtmlPath } from '../util';
import MenuBuilder from '../menu';

export default class WindowManager {
  private mainWindow: BrowserWindow | null = null;

  async createWindow(): Promise<BrowserWindow> {
    const isDebug =
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true';

    if (isDebug) {
      await WindowManager.installExtensions();
    }

    const RESOURCES_PATH = app.isPackaged
      ? path.join(process.resourcesPath, 'assets')
      : path.join(__dirname, '../../../assets');

    const getAssetPath = (...paths: string[]): string => {
      return path.join(RESOURCES_PATH, ...paths);
    };

    this.mainWindow = new BrowserWindow({
      show: false,
      width: 1024,
      height: 728,
      icon: getAssetPath('icon.png'),
      webPreferences: {
        preload: app.isPackaged
          ? path.join(__dirname, 'preload.js')
          : path.resolve(app.getAppPath(), '.erb/dll/preload.js'),
        contextIsolation: true,
        nodeIntegration: false,
      },
    });

    this.mainWindow.loadURL(resolveHtmlPath('index.html'));

    this.mainWindow.on('ready-to-show', () => {
      if (!this.mainWindow) {
        throw new Error('"mainWindow" is not defined');
      }
      if (process.env.START_MINIMIZED) {
        this.mainWindow.minimize();
      } else {
        this.mainWindow.show();
      }
    });

    this.mainWindow.on('closed', () => {
      this.mainWindow = null;
    });

    const menuBuilder = new MenuBuilder(this.mainWindow);
    menuBuilder.buildMenu();

    // Open urls in the user's browser
    this.mainWindow.webContents.setWindowOpenHandler((edata) => {
      shell.openExternal(edata.url);
      return { action: 'deny' };
    });

    return this.mainWindow;
  }

  private static async installExtensions(): Promise<void> {
    const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
    const extensions = [REACT_DEVELOPER_TOOLS];

    return installer(extensions, { forceDownload })
      .then(() => undefined)
      .catch(console.log);
  }

  getMainWindow(): BrowserWindow | null {
    return this.mainWindow;
  }

  closeWindow(): void {
    if (this.mainWindow) {
      this.mainWindow.close();
    }
  }
}
