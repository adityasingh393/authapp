import { useEffect, useState } from 'react';
import localforage from 'localforage';

export function useLocalForage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    (async () => {
      const value = await localforage.getItem<T>(key);
      if (value) {
        setStoredValue(value);
      }
    })();
  }, [key]);

  const setValue = async (value: T) => {
    setStoredValue(value);
    await localforage.setItem(key, value);
  };

  return [storedValue, setValue] as const;
}
