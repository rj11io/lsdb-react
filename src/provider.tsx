"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo } from "react";
import { LSDBClient } from "@rj11io/lsdb";
import type { LSDBClientOptions } from "@rj11io/lsdb";
import { LSDBContext } from "./context";

export interface LSDBProviderProps {
  children: ReactNode;
  client?: LSDBClient;
  options?: LSDBClientOptions;
}

export function LSDBProvider({ children, client, options }: LSDBProviderProps) {
  const resolvedClient = useMemo(() => {
    return client ?? new LSDBClient(options);
  }, [client, options?.delayMs, options?.idGenerator, options?.namespace, options?.storage]);

  useEffect(() => {
    if (client) {
      return;
    }

    return () => {
      resolvedClient.destroy();
    };
  }, [client, resolvedClient]);

  return <LSDBContext.Provider value={resolvedClient}>{children}</LSDBContext.Provider>;
}
