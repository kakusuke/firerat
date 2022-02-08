import { atom, selectorFamily } from "recoil";
import { ServiceState } from "../type/ServiceState";

export const servicesState = atom<ServiceState[]>({
  key: 'servicesState',
  default: [],
  effects:[
    ({setSelf}) => {
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
