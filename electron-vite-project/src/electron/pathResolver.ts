import {app} from "electron";
import path from 'path';
import {isDev} from "./util.js";

export function getUIPath() {
    return path.join(app.getAppPath(), '/dist-react')
}

export function getAssetPath() {
    return path.join(app.getAppPath(), isDev() ? '.' : '..', '/src/ui/assets');
}