import {app, BrowserWindow} from 'electron'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
import {getAssetPath} from './pathResolver.js'
import {getStaticData, pollResources} from './resourceManager.js'
import {ipcMainHandle, ipcMainOn, isDev} from './util.js'
import {createTray} from './tray.js'

ipcMainHandle('getStaticData', () => getStaticData())
ipcMainOn('sendFrameAction', (action) => {
    const win = BrowserWindow.getAllWindows()[0]
    if (!win) return
    switch (action) {
        case 'CLOSE':
            win.close()
            break
        case 'MINIMIZE':
            win.minimize()
            break
        case 'MAXIMIZE':
            win.maximize()
            break
    }
})

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

    if (isDev() && process.env['VITE_DEV_SERVER_URL']) {
        win.loadURL(process.env['VITE_DEV_SERVER_URL']!)
    } else {
        win.loadFile(path.join(__dirname, '../dist/index.html'))
    }

    if (isDev()) {
        win.webContents.openDevTools({mode: 'detach'})
    }

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