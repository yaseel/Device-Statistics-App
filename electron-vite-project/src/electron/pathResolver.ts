import {app} from 'electron'
import path from 'node:path'
import {fileURLToPath, pathToFileURL} from 'node:url'
import {dirname} from 'node:path'
import {isDev} from './util.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

export function getAssetPath(): string {
    if (isDev()) {
        return path.join(__dirname, '..', 'src', 'ui', 'assets')
    } else {
        return path.join(process.resourcesPath, 'assets')
    }
}

export function getUIPath(): string {
    if (isDev()) {
        return process.env.VITE_DEV_SERVER_URL!
    } else {
        const appAsarPath = app.getAppPath()
        const indexHtml = path.join(appAsarPath, 'dist', 'index.html')
        return pathToFileURL(indexHtml).toString()
    }
}
