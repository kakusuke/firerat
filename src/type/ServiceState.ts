export interface ServiceState {
  sessionId: string
  url: string
  label: string
}

export type ServiceStatesConsumer = (states: ServiceState[]) => void;
export type ServiceStatesFilter = (states: ServiceState[]) => ServiceState[];
