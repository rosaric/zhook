const pushListener = <Args extends unknown[], Return>(
  listeners: Array<(...args: Args) => Return>,
  listener: (...args: Args) => Return
) => {
  listeners.push(listener)

  return () => {
    listeners.splice(listeners.indexOf(listener), 1)
  }
}

export interface Dispatcher<Args extends unknown[]> {
  on(listener: (...args: Args) => void): () => void
  emit(...args: Args): void
}

export function createDispatcher<
  Args extends unknown[] = []
>(): Dispatcher<Args> {
  const listeners: Array<(...args: Args) => void> = []

  return {
    on: (listener) => pushListener(listeners, listener),
    emit(...args) {
      listeners.forEach((listener) => listener(...args))
    },
  }
}

export interface SyncFilter<Return, Args extends unknown[]> {
  on(listener: (value: Return, ...args: Args) => Return): () => void
  emit(value: Return, ...args: Args): Return
}

export function createSyncFilter<
  Return,
  Args extends unknown[] = []
>(): SyncFilter<Return, Args> {
  const listeners: Array<(value: Return, ...args: Args) => Return> = []

  return {
    on: (listener) => pushListener(listeners, listener),
    emit: (initValue, ...args) =>
      listeners.reduce(
        (returnValue, fn) => fn(returnValue, ...args),
        initValue
      ),
  }
}

export interface AsyncFilter<Return, Args extends unknown[]> {
  on(
    listener: (value: Return, ...args: Args) => Return | Promise<Return>
  ): () => void
  emit(value: Return, ...args: Args): Promise<Return>
}

export function createAsyncFilter<
  Return,
  Args extends unknown[] = []
>(): AsyncFilter<Return, Args> {
  const listeners: Array<
    (value: Return, ...args: Args) => Return | Promise<Return>
  > = []

  return {
    on: (listener) => pushListener(listeners, listener),
    async emit(initValue, ...args) {
      for (const listener of listeners) {
        initValue = await listener(initValue, ...args)
      }
      return initValue
    },
  }
}
