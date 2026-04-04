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
LSDB React bindings
