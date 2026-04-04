"use client";

import { createContext } from "react";
import type { LSDBClient } from "@rj11io/lsdb";

export const LSDBContext = createContext<LSDBClient | null>(null);
