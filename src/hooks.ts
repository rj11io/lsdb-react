"use client";

import { useContext } from "react";
import { LSDBContext } from "./context";

export function useLSDB() {
  const context = useContext(LSDBContext);
  if (!context) {
    throw new Error("useLSDB must be used within an LSDBProvider.");
  }

  return context;
}
