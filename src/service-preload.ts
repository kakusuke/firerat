import { contextBridge, ipcRenderer } from 'electron';

const api = {
  selectNotification: () => {
    ipcRenderer.send('selectnotification')
  }
}
contextBridge.exposeInMainWorld('__api', api)
