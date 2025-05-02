import {contextBridge, ipcRenderer, IpcRendererEvent} from 'electron'

contextBridge.exposeInMainWorld(
    'electron',
    {
        subscribeStatistics: (
            callback: (stats: Statistics) => void
        ): UnsubscribeFunction => {
            const listener = (
                _evt: IpcRendererEvent,
                stats: EventPayloadMapping['statistics']
            ) => {
                callback(stats)
            }
            ipcRenderer.on('statistics', listener)
            return () => {
                ipcRenderer.off('statistics', listener)
            }
        },

        getStaticData: (): Promise<StaticData> =>
            ipcRenderer.invoke('getStaticData'),

        subscribeChangeView: (
            callback: (view: View) => void
        ): UnsubscribeFunction => {
            const listener = (
                _evt: IpcRendererEvent,
                view: EventPayloadMapping['changeView']
            ) => {
                callback(view)
            }
            ipcRenderer.on('changeView', listener)
            return () => {
                ipcRenderer.off('changeView', listener)
            }
        },

        sendFrameAction: (
            payload: FrameWindowAction
        ): void => {
            ipcRenderer.send('sendFrameAction', payload)
        }
    } satisfies Window['electron']
)