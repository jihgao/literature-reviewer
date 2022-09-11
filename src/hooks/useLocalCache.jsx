import React, { useEffect, useState } from 'react';
import { useCallback } from 'react';

function useLocalCache(key, defaultValue){
  const [text, setText] = useState(defaultValue);
  useEffect(() => {
    const cachedText = window.localStorage.getItem(key);
    if(cachedText){
      setText(cachedText);
    }
  }, [key]);
  const saveValue = useCallback(() => {
    setText(text);
    window.localStorage.setItem(key, text);
  }, [text, key]);

  return [text, setText, saveValue];
}

export default useLocalCache;
