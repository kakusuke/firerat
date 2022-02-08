import { atom, selectorFamily } from "recoil";
import { ServiceState } from "../type/ServiceState";

export const servicesState = atom<ServiceState[]>({
  key: 'servicesState',
  default: [],
  effects:[
    ({setSelf, onSet}) => {
      onSet(states => services.set(_ => states));

      const cb = (states: ServiceState[]) => setSelf(states)
      services.on('change', cb)
      return () => services.off('change', cb)
    }
  ]
})

export const serviceState = selectorFamily<ServiceState | null, number>({
  key: 'serviceState',
  get: (index: number) => ({get}) => {
    const services = get(servicesState)
    return services[index] || null
  }
})

export const serviceDraftsState = atom<ServiceState[]>({
  key: 'serviceDraftsState',
  default: [],
  effects:[
    ({setSelf}) => {
      const cb = (states: ServiceState[]) => setSelf(states)
      services.on('change', cb)
      return () => services.off('change', cb)
    }
  ]
})

export const serviceDraftState = selectorFamily<ServiceState | null, number>({
  key: 'serviceState',
  get: (index: number) => ({get}) => {
    const services = get(serviceDraftsState)
    return services[index] || null
  },
  set: (index: number) => ({set}, value: ServiceState | null) => {
    set(serviceDraftsState, curVal => {
      if (value == null) return curVal.filter((_, i) => i !== index)
      return curVal.map((s, i) => i === index ? value : s)
    })
  }
})
