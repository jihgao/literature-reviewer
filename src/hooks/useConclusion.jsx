import useLocalCache from './useLocalCache';

function useConclusion(defaultValue){
  return useLocalCache('conclusion-text', defaultValue);
}

export default useConclusion;
