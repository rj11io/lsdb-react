import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { LSDBClient, getCollectionKey } from "@rj11io/lsdb";
import { LSDBProvider, useLSDB } from "../../src";

declare global {
  interface Window {
    __lsdbExports: {
      LSDBClient: typeof LSDBClient;
      getCollectionKey: typeof getCollectionKey;
    };
    __lsdbHelpers: {
      clearNamespace(namespace: string): void;
    };
    __lsdbReactReady: boolean;
    __lsdbReact: ReturnType<typeof useLSDB> | null;
  }
}

window.__lsdbExports = {
  LSDBClient,
  getCollectionKey,
};

window.__lsdbHelpers = {
  clearNamespace(namespace: string) {
    const prefix = getCollectionKey(namespace, "");
    const keys: string[] = [];

    for (let index = 0; index < window.localStorage.length; index += 1) {
      const key = window.localStorage.key(index);
      if (key && key.startsWith(prefix)) {
        keys.push(key);
      }
    }

    keys.forEach((key) => {
      window.localStorage.removeItem(key);
    });
  },
};

function ReactHarness() {
  const lsdb = useLSDB();

  useEffect(() => {
    window.__lsdbReact = lsdb;
    window.__lsdbReactReady = true;

    return () => {
      window.__lsdbReact = null;
      window.__lsdbReactReady = false;
    };
  }, [lsdb]);

  return <div data-testid="react-ready">ready</div>;
}

function App() {
  return (
    <LSDBProvider options={{ namespace: "react-harness", delayMs: 0 }}>
      <ReactHarness />
    </LSDBProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
