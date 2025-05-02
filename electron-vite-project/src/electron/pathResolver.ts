import path from 'node:path'
import {fileURLToPath} from 'node:url'
import {dirname} from 'node:path'
import {isDev} from './util.js'
import {pathToFileURL} from "url";

const __dirname = dirname(fileURLToPath(import.meta.url))

export function getAssetPath() {
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
        const indexHtml = path.join(process.resourcesPath, 'dist', 'index.html')
        return pathToFileURL(indexHtml).toString()
    }
}