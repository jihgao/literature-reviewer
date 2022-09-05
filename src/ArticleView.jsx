import React from 'react';
const isFunction = (arg) => Object.prototype.toString.call(arg) === '[object Function]';
const isString = (arg) => Object.prototype.toString.call(arg) === '[object String]';
const groupBy = (arr, keyOrFn) => {
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

function tagGroupByIterator(record) {
    if(Array.isArray(record.tags)){
      return record.tags.join();
    } else {
      return record.tags;
    }
}

export default ({dataSource}) => {
  const regions = groupBy(dataSource, 'region');
  let references = [];
  return (
    <article className="page-view-article">
      <h1>文献综述</h1>
      {
        Object.keys(regions).map((region) => {
          const tagsGroup = groupBy(regions[region], tagGroupByIterator);
          return (
            <section key={region}>
              <h2>{region}研究现状</h2>
              {
                Object.keys(tagsGroup).map((tag, ii) => {
                  const list = tagsGroup[tag];
                  return (
                    <section key={tag}>
                      <h3>({ii+1})关于{tag}方面的研究</h3>
                      <p>
                        {
                          list.map(({id, content, reference}) => {
                            references.push(reference);
                            return (
                              <React.Fragment key={id}>
                                {content}
                              </React.Fragment>
                            );
                          })
                        }
                      </p>
                    </section>
                  )
                })
              }
            </section>
          );
        })
      }
      <h2>引用文献</h2>
      <ol>
        {
          references.map((reference) => {
            return (
              <li key={reference}>
                {reference}
              </li>
            )
          })
        }
      </ol>
    </article>
  )
};