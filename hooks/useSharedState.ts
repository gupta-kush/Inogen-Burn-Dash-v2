import { useState, useEffect, useCallback } from 'react';

const useSharedState = <T,>(key: string, initialState: T): [T, (value: T | ((prevState: T) => T)) => void] => {
  const [state, setState] = useState<T>(() => {
    try {
      const storedValue = window.localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : initialState;
    } catch (error) {
      console.error("Error reading from localStorage", error);
      return initialState;
    }
  });

  const setSharedState = useCallback((valueOrUpdater: T | ((prevState: T) => T)) => {
      // Use the functional update form of setState to ensure we always have the latest state.
      // This prevents race conditions and stale state bugs when updates happen in quick succession.
      setState(prevState => {
        try {
          const newState = valueOrUpdater instanceof Function ? valueOrUpdater(prevState) : valueOrUpdater;
          const serializedValue = JSON.stringify(newState);
          window.localStorage.setItem(key, serializedValue);
          return newState;
        } catch (error) {
          console.error("Error writing to localStorage", error);
          // In case of an error, return the previous state to avoid breaking the app.
          return prevState;
        }
      });
    }, [key]);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.newValue) {
        try {
          setState(JSON.parse(event.newValue));
        } catch (error) {
          console.error("Error parsing storage event value", error);
        }
      } else if (event.key === key && !event.newValue) {
        // Handle case where localStorage is cleared
        setState(initialState);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key, initialState]);

  return [state, setSharedState];
};

export default useSharedState;