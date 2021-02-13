import { createDispatcher, createSyncFilter, createAsyncFilter } from './mod'

test('dispatcher', () => {
  const mock1 = jest.fn()
  const mock2 = jest.fn()
  const mock3 = jest.fn().mockReturnValue(Promise.resolve())

  const dispatcher = createDispatcher<[text: string]>()
  dispatcher.on(mock1)
  dispatcher.on(mock2)
  const off = dispatcher.on(mock3)

  dispatcher.emit('t')
  expect(mock1).toBeCalledTimes(1)
  expect(mock1).toBeCalledWith('t')
  expect(mock2).toBeCalledTimes(1)
  expect(mock2).toBeCalledWith('t')
  expect(mock3).toBeCalledTimes(1)
  expect(mock3).toBeCalledWith('t')

  off()
  dispatcher.emit('test')
  expect(mock1).toBeCalledTimes(2)
  expect(mock1).toBeCalledWith('test')
  expect(mock2).toBeCalledTimes(2)
  expect(mock2).toBeCalledWith('test')
  expect(mock3).toBeCalledTimes(1)
})

test('syncFilter', () => {
  const mock1 = jest.fn((text) => text + ',1')
  const mock2 = jest.fn((text) => text + ',2')
  const mock3 = jest.fn((text) => text + ',3')

  const filter = createSyncFilter<string, [context: number]>()
  filter.on(mock1)
  filter.on(mock2)
  const off = filter.on(mock3)

  expect(filter.emit('0', 8)).toBe('0,1,2,3')
  expect(mock1).toBeCalledTimes(1)
  expect(mock1).toBeCalledWith('0', 8)
  expect(mock2).toBeCalledTimes(1)
  expect(mock2).toBeCalledWith('0,1', 8)
  expect(mock3).toBeCalledTimes(1)
  expect(mock3).toBeCalledWith('0,1,2', 8)

  off()
  expect(filter.emit('0', 8)).toBe('0,1,2')
  expect(mock1).toBeCalledTimes(2)
  expect(mock1).toBeCalledWith('0', 8)
  expect(mock2).toBeCalledTimes(2)
  expect(mock2).toBeCalledWith('0,1', 8)
  expect(mock3).toBeCalledTimes(1)
})

test('asyncFilter', async () => {
  const mock1 = jest.fn((text) => text + ',1')
  const mock2 = jest.fn((text) => Promise.resolve(text + ',2'))
  const mock3 = jest.fn((text) => text + ',3')

  const filter = createAsyncFilter<string, [context: number]>()
  filter.on(mock1)
  filter.on(mock2)
  const off = filter.on(mock3)

  expect(await filter.emit('0', 8)).toBe('0,1,2,3')
  expect(mock1).toBeCalledTimes(1)
  expect(mock1).toBeCalledWith('0', 8)
  expect(mock2).toBeCalledTimes(1)
  expect(mock2).toBeCalledWith('0,1', 8)
  expect(mock3).toBeCalledTimes(1)
  expect(mock3).toBeCalledWith('0,1,2', 8)

  off()
  expect(await filter.emit('0', 8)).toBe('0,1,2')
  expect(mock1).toBeCalledTimes(2)
  expect(mock1).toBeCalledWith('0', 8)
  expect(mock2).toBeCalledTimes(2)
  expect(mock2).toBeCalledWith('0,1', 8)
  expect(mock3).toBeCalledTimes(1)
})
