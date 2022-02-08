/// <reference path="@types/preload.d.ts"/>
import { contextBridge, ipcRenderer } from 'electron';
import { ServiceState, ServiceStatesConsumer, ServiceStatesFilter } from "./type/ServiceState";

let services: ServiceState[] = []
const listener: {[event: string]: ServiceStatesConsumer[]} = {
  change: [states => services = states]
}

const api: Services = {
  select(data: {index: number}) {
    ipcRenderer.send('selectservice', data)
  },
  set(fn: ServiceStatesFilter) {
    ipcRenderer.send('setservice', fn(services))
  },
  save() {
    ipcRenderer.send('saveservice', services)
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
