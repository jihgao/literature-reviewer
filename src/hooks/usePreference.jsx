import useLocalCache from './useLocalCache';

function usePreference(defaultValue){
  return useLocalCache('preference-text', defaultValue);
}

export default usePreference;
