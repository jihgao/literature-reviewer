import { useEffect, useState } from 'react';
import { useCallback } from 'react';

function useLocalCache(key, defaultValue, stringify){
  const [value, setValue] = useState(defaultValue);
  useEffect(() => {
    const cachedText = window.localStorage.getItem(key);
    let cachedValue;
    if(cachedText?.trim()){
      if(stringify){
        try {
          cachedValue = JSON.parse(cachedText);
        } catch (error) {
            console.error(error);
        }
      } else {
        cachedValue = cachedText;
      }
      setValue(cachedValue);
    }
  }, [key, stringify]);
  const saveValue = useCallback((nextValue) => {
    setValue(nextValue);
    const cacheValue = stringify ? JSON.stringify(nextValue) : nextValue;
    window.localStorage.setItem(key, cacheValue);
  }, [key, stringify]);

  return [value, saveValue, setValue];
}

export default useLocalCache;
