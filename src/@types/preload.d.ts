interface _ServiceState {
  sessionId: string
  url: string
  label: string
}

interface Services {
  select(data: {index: number});

  set(data: _ServiceState[]);

  editPreference(): void;

  on(event: string, cb: (states: _ServiceState[]) => void);

  off(event: string, cb: (states: _ServiceState[]) => void);
}

declare const services: Services;
