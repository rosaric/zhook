# 🪝 zhook

Tiny hook library, with event dispatcher and filters (aka waterfall hook),
mostly for creating plugin system.

> This library is still experimental and its APIs may change in the future.

## ✨ Features

- **Small**: No dependencies. Size is less than **130 bytes** (minified and gzipped), controlled by [Size Limit](https://github.com/ai/size-limit).
- **Works on All Runtime**: It doesn't rely on any platform API, so you can use it at browsers, Node.js or Deno.
- **Simple**: Simple API, and doesn't rely on `this`.
- **TypeScript Friendly**: Source code is written in TypeScript with better types.
- **Modern**: Shipped as ES Modules, and targets to ES2017.

## 💿 Install

### Node.js

Note that this library requires Node.js 12 or newer.

```
$ npm i zhook
```

Then you can import it with ES Modules:

```js
import { /* */ } from 'zhook'
```

### Browsers (No bundlers)

```js
import { /* */ } from 'https://cdn.jsdelivr.net/npm/zhook@0.1.0/dist/mod.js'
```

### Deno

```ts
import { /* */ } from 'https://cdn.jsdelivr.net/npm/zhook@0.1.0/mod.ts'
```

## 🎬 Usage

### `createDispatcher`

Dispatcher is similar to Node.js `EventEmitter` but it's decentralized and isolated for each event.
So, each event can be easily typed.

```ts
import { createDispatcher } from 'zhook'

const dispatcher = createDispatcher<[x: number, y: number]>()

dispatcher.on((x, y) => console.log(x, y))
dispatcher.on((x, y) => Promise.resolve([x, y]))
dispatcher.emit(1, 2)
```

### `createSyncFilter`

Filter is similar to waterfall hook in webpack [Tapable](https://github.com/webpack/tapable).

All arguments will be passed in the order of registered listeners.
All registered listeners *must* return a value and that value will be passed as
the first argument to next listener, while the rest arguments won't be changed.

Note that all listeners must be synchronous,
so listeners can't be `async/await` function or return a `Promise`.
If your listeners need to be asynchronous, see below.

```ts
import { createSyncFilter } from 'zhook'

const filter = createSyncFilter<[value: number, context: number]>()

filter.on((value, context) => value + 1)
filter.on((value, context) => value + 2)
const result = filter.emit(/* initial value */ 1, 'some text')
```

### `createAsyncFilter`

`AsyncFilter` is similar to `SyncFilter`, but
this allows you to create filter while its listeners can be synchronous or asynchronous.

```ts
import { createAsyncFilter } from 'zhook'

const filter = createAsyncFilter<[value: number, context: number]>()

filter.on((value, context) => value + 1)
filter.on((value, context) => Promise.resolve(value + 2))
const result = await filter.emit(/* initial value */ 1, 'some text')
```

## 📃 License

MIT License

2021-present (c) Pig Fang
