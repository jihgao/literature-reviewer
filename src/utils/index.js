export { exportJson } from './exportJson';

export const isFunction = (arg) => Object.prototype.toString.call(arg) === '[object Function]';

export const isString = (arg) => Object.prototype.toString.call(arg) === '[object String]';

export const groupBy = (arr, keyOrFn) => {
  return arr.reduce((ret, record) => {
    if(record){
      let mapKey = isFunction(keyOrFn) ? keyOrFn(record) : record[keyOrFn];
      if(mapKey) {
        if(!ret[mapKey]) {
          ret[mapKey] = [];
        }
        ret[mapKey].push(record);
      }
    }
    return ret;
  }, {});
};


export const getReferenceListFromText = (text) => {
  const matchText = text?.replace(/］/gm, ']')?.replace(/［/gm, '[')?.replace(/．/gm, '.')?.replace(/\[(\d+)\]/gm, '=$1=');
  const reg = /=(\d+)=([^=]+)/gm;
  let ret = reg.exec(matchText);
  let nextList = [];
  while(ret) {
    const index = ret[1].trim();
    const reference = ret[2].trim();
    nextList.push({
      index,
      reference,
    });
    ret = reg.exec(matchText);
  }
  return nextList;
};