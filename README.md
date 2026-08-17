# `@rj11io/lsdb-react`

React bindings for [`@rj11io/lsdb`](https://github.com/rj11io/lsdb).

## Install

```sh
npm install @rj11io/lsdb-react react
```

## Usage

```tsx
import { LSDBProvider, useLSDB } from "@rj11io/lsdb-react";

type Todo = {
  id: string;
  title: string;
  done: boolean;
};

function TodoList() {
  const lsdb = useLSDB();

  async function addTodo() {
    await lsdb.collection<Todo>("todos").insert({
      title: "Ship the feature",
      done: false,
    });
  }

  return <button onClick={() => void addTodo()}>Add todo</button>;
}

export function App() {
  return (
    <LSDBProvider options={{ namespace: "app" }}>
      <TodoList />
    </LSDBProvider>
  );
}
```

## Server rendering

`@rj11io/lsdb-react` is a client entry point. `LSDBProvider` can be prerendered because
creating its client does not access browser storage. Keep collection reads and writes in
effects, event handlers, or other browser-only code. The first data operation requires
`localStorage` unless you pass an explicit storage implementation.
