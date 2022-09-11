import useLocalCache from './useLocalCache';

function useReference(defaultValue){
  return useLocalCache('reference-text', defaultValue);
}

export default useReference;
