import { useState, useEffect, useCallback, useRef } from 'react';
import { database } from '../firebase';
import { ref, onValue, set } from 'firebase/database';

type SetStateParam<T> = T | ((prevState: T) => T);

const useFirebaseState = <T,>(dbPath: string, initialState: T): [T, (value: SetStateParam<T>) => void, boolean] => {
  const [state, setState] = useState<T>(initialState);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const initialStateRef = useRef(initialState);
  const lastValidStateRef = useRef<T>(initialState);

  const setFirebaseState = useCallback((valueOrUpdater: SetStateParam<T>) => {
    setState(prevState => {
      const newState = valueOrUpdater instanceof Function ? valueOrUpdater(prevState) : valueOrUpdater;
      // Update Firebase asynchronously.
      set(ref(database, dbPath), newState).catch(error => {
        console.error("Firebase write failed: ", error);
        // Optionally, revert local state or show an error to the user.
      });
      return newState;
    });
  }, [dbPath]);

  useEffect(() => {
    const dbRef = ref(database, dbPath);
    let isInitialLoad = true;

    const unsubscribe = onValue(dbRef, (snapshot) => {
      const value = snapshot.val();
      if (value && typeof value === 'object' && Object.keys(value).length > 0) {
        // Data exists, update local state.
        console.log("Firebase data received:", Object.keys(value).length, "racks");
        // Clean the data to ensure properties are not undefined.
        Object.keys(value).forEach(rackKey => {
            if (Array.isArray(value[rackKey])) {
                value[rackKey] = value[rackKey].map(shelf => ({
                    ...shelf,
                    startTime: shelf.startTime || null,
                    manualOffset: shelf.manualOffset || 0,
                    stationId: shelf.stationId || '',
                }));
            }
        });
        setState(value);
        lastValidStateRef.current = value; // Backup valid state
      } else if (isInitialLoad) {
        // Data doesn't exist, initialize it in Firebase.
        console.warn(`No data at path '${dbPath}'. Snapshot exists: ${snapshot.exists()}. Initializing with default state.`);
        set(dbRef, initialStateRef.current).catch(err => console.error("Failed to initialize Firebase state:", err));
        setState(initialStateRef.current);
      } else {
        // Data was cleared/corrupted after initial load - this is the bug!
        console.error("Firebase data was cleared or corrupted! Snapshot exists:", snapshot.exists(), "Value:", value);
        // Don't reset to initial state - keep current state or show error
      }
      
      if (isLoading) {
          setIsLoading(false);
      }
      isInitialLoad = false;
    }, (error) => {
      console.error("Firebase read failed: ", error);
      setIsLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [dbPath, isLoading]);

  return [state, setFirebaseState, isLoading];
};

export default useFirebaseState;
