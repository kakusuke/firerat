import { contextBridge, ipcRenderer } from 'electron';
import { ServiceState, ServiceStatesConsumer } from "./type/ServiceState";

const listener: {[event: string]: ServiceStatesConsumer[]} = {
}

const api: Services = {
  select(data: {index: number}) {
    ipcRenderer.send('selectservice', data)
  },
  set(services: ServiceState[]) {
    ipcRenderer.send('setservice', services)
  },
  editPreference() {
    ipcRenderer.send("editpreference")
  },
  on(event: string, cb: ServiceStatesConsumer) {
    listener[event] = listener[event] || []
    listener[event].push(cb)
  },
  off(event: string, cb: ServiceStatesConsumer) {
    listener[event] = listener[event] || []
    listener[event] = listener[event].filter(l => l !== cb)
  }
}
contextBridge.exposeInMainWorld('services', api)

ipcRenderer.on('changeservice', (e, services) => {
  (listener.change || []).forEach(l => l(services))
})
