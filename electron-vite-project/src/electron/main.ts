// src/electron/main.ts
import {app, BrowserWindow} from 'electron'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
import {pollResources, getStaticData} from './resourceManager.js'
import {ipcMainHandle, ipcMainOn} from './util.js'
import {getAssetPath} from './pathResolver.js'
import {createTray} from './tray.js'
import {createMenu} from "./menu.js";

// 1) Register IPC handlers once
ipcMainHandle('getStaticData', () => getStaticData())
ipcMainOn('sendFrameAction', (action) => {
    const win = BrowserWindow.getAllWindows()[0]
    if (!win) return
    switch (action) {
        case 'CLOSE':
            win.close();
            break
        case 'MINIMIZE':
            win.minimize();
            break
        case 'MAXIMIZE':
            win.maximize();
            break
    }
})

// 2) __dirname for ESM
const __dirname = path.dirname(fileURLToPath(import.meta.url))

function createWindow(): BrowserWindow {
    const win = new BrowserWindow({
        icon: path.join(getAssetPath(), 'appicon.png'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.mjs'),
            contextIsolation: true,
            nodeIntegration: false,
        },
    })

    // 3) Correctly load your UI:
    if (process.env.NODE_ENV === 'development' && process.env.VITE_DEV_SERVER_URL) {
        // Dev → Vite server (HMR)
        win.loadURL(process.env.VITE_DEV_SERVER_URL)
        win.webContents.openDevTools({mode: 'detach'})
    } else {
        // Prod → bundled index.html *inside* your ASAR
        // Resources folder contains app.asar with dist/ inside
        win.loadFile(
            path.join(process.resourcesPath, 'app.asar', 'dist', 'index.html')
        )
    }

    // 4) Ping when ready
    win.webContents.on('did-finish-load', () => {
        win.webContents.send('main-process-message', new Date().toLocaleString())
    })

    return win
}

function setupCloseBehavior(win: BrowserWindow) {
    let quitting = false
    win.on('close', (e) => {
        if (!quitting) {
            e.preventDefault()
            win.hide()
            app.dock?.hide()
        }
    })
    app.on('before-quit', () => {
        quitting = true
    })
    win.on('show', () => {
        quitting = false
    })
}

function initApp() {
    const mainWindow = createWindow()
    pollResources(mainWindow)
    createTray(mainWindow)
    setupCloseBehavior(mainWindow)
    createMenu(mainWindow)
}

app
    .whenReady()
    .then(initApp)
    .catch(console.error)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) initApp()
})