'use strict';

import { app, protocol, BrowserWindow, dialog, ipcMain } from 'electron';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer';
const isDevelopment = process.env.NODE_ENV !== 'production';
import path from 'path';
const fs = require('fs');

let mainWin = null;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
    { scheme: 'app', privileges: { secure: true, standard: true } },
]);

/**
 * ファイルパスのプレフィックスを取得
 * @return {string}
 */
function getFilePathPrefix() {
    if (process.env.NODE_ENV === 'development') {
        return process.cwd() + '/public/';
    }
    return __dirname;
}

/**
 *
 */
async function createWindow() {
    const filePathPrefix = getFilePathPrefix();
    // Create the browser window.
    const win = new BrowserWindow({
        width: 1200,
        height: 1000,
        webPreferences: {
            // Use pluginOptions.nodeIntegration, leave this alone
            // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
            nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
            // contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
            // Node環境のglobalオブジェクトとChromiumのwindowオブジェクトを独立させない（＝紐づけする）
            contextIsolation: false,
            // プリロード処理を下記スクリプトに記載
            preload: path.join(filePathPrefix, 'preload.js'),
        },
    });
    mainWin = win;

    if (process.env.WEBPACK_DEV_SERVER_URL) {
        // Load the url of the dev server if in development mode
        await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
        if (!process.env.IS_TEST) win.webContents.openDevTools();
    } else {
        createProtocol('app');
        // Load the index.html when not in development
        win.loadURL('app://./index.html');
    }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
    if (isDevelopment && !process.env.IS_TEST) {
        // Install Vue Devtools
        try {
            await installExtension(VUEJS_DEVTOOLS);
        } catch (e) {
            console.error('Vue Devtools failed to install:', e.toString());
        }
    }
    createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
    if (process.platform === 'win32') {
        process.on('message', (data) => {
            if (data === 'graceful-exit') {
                app.quit();
            }
        });
    } else {
        process.on('SIGTERM', () => {
            app.quit();
        });
    }
}

ipcMain.handle('file-open', async (event) => {
    const paths = dialog.showOpenDialogSync(mainWin);
    const path = paths[0];
    return {
        status: true,
        path: path,
        text: JSON.parse(fs.readFileSync(path, 'utf-8')),
    };
});
