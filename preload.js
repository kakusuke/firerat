const { contextBridge, ipcRenderer } = require('electron')

let services = []
const listener = {
  change: [state => services = state]
}
contextBridge.exposeInMainWorld(
  'services',
  {
    select(data) {
      ipcRenderer.send('selectservice', data)
    },
    set(fn) {
      ipcRenderer.send('setservice', fn(services))
    },
    save() {
      ipcRenderer.send('saveservice', services)
    },
    on(event, cb) {
      listener[event] = listener[event] || []
      listener[event].push(cb)
    },
    off(event, cb) {
      listener[event] = listener[event] || []
      listener[event] = listener[event].filter(l => l !== cb)
    }
  }
)

ipcRenderer.on('changeservice', (e, services) => {
  (listener.change || []).forEach(l => l(services))
})
