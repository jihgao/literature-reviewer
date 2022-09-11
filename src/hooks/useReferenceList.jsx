import useLocalCache from './useLocalCache';

function useReferenceList(defaultValue){
  return useLocalCache('reference-list', defaultValue, true);
}

export default useReferenceList;
