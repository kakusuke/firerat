interface _ServiceState {
  sessionId: string
  url: string
  label: string
}

interface Services {
  select(data: {index: number});

  set(fn: (data: _ServiceState[]) => _ServiceState[]);

  save(): void;

  editPreference(): void;

  on(event: string, cb: (states: _ServiceState[]) => void);

  off(event: string, cb: (states: _ServiceState[]) => void);
}

declare const services: Services;
