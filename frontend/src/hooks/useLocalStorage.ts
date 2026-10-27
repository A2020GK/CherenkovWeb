import { useState } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value: T | ((prev: T) => T)) => {
    setStoredValue((prev) => {
      const nextValue =
        typeof value === "function" ? (value as (prev: T) => T)(prev) : value;

      try {
        window.localStorage.setItem(key, JSON.stringify(nextValue));
      } catch {
        console.error("Failed to set localStorage item");
      }

      return nextValue;
    });
  };

  return [storedValue, setValue];
}
