"use client";

import { useEffect, useRef, useState } from "react";

/** Restore preferences after hydration, then persist subsequent changes. */
export function useTableStorage<T>(key: string, initialValue: T) {
  const initial = useRef(initialValue);
  const [value, setValue] = useState<T>(initialValue);
  const [restoredKey, setRestoredKey] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(key);
      setValue(saved === null ? initial.current : JSON.parse(saved));
    } catch {
      setValue(initial.current);
    }
    setRestoredKey(key);
  }, [key]);

  useEffect(() => {
    if (restoredKey !== key) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // The table remains usable when browser storage is unavailable or full.
    }
  }, [key, restoredKey, value]);

  return [value, setValue] as const;
}
