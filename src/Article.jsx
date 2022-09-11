import React, { useState, useEffect, useLayoutEffect, createRef} from 'react';
import {
  Row,
  Col
} from 'antd';
import usePreference from './hooks/usePreference';
import useReferenceList from './hooks/useReferenceList';

const isFunction = (arg) => Object.prototype.toString.call(arg) === '[object Function]';
// const isString = (arg) => Object.prototype.toString.call(arg) === '[object String]';
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

const Preference = () => {
  const [text] = usePreference('');
  const pList = text?.split("\n")?.filter(Boolean);
  if(pList?.length) {
    return (
      <>
        <h2>前言</h2>
        {
          pList.map((pText, index) => (
            <p
              key={index}
            >
              {pText}
            </p>
          ))
        }
      </>
    );
  } else {
    return '';
  }
};

const ArticleView = () => {
  const $container = createRef();
  const [dataSource] = useReferenceList([]);
  const [wordCount, setWordCount] = useState(0);
  const [myDataSource, setMyDataSource] = useState([]);
  useEffect(() => {
    if(Array.isArray(dataSource)) {
      setMyDataSource(dataSource.filter((record) => record.active));
    }
  }, [dataSource]);
  useLayoutEffect(() => {
    setWordCount($container?.current?.textContent?.length);
  }, [dataSource, $container]);
  const regions = groupBy(myDataSource, 'region');
  let references = [];
  return (
    <article className="page-view-article">
      <Row>
        <Col flex={1} />
        <Col flex={'none'}>
          <span>字数: {wordCount || 0}</span>
        </Col>
      </Row>
      <div ref={$container}>
        <h1>文献综述</h1>
        <Preference />
        {
          Object.keys(regions).map((region) => {
            const tagsGroup = groupBy(regions[region], tagGroupByIterator);
            return (
              <section key={region}>
                <h2>{region}研究现状</h2>
                {
                  Object.keys(tagsGroup).map((tag, ii) => {
                    const list = tagsGroup[tag];
                    list.sort((articleA, articleB) => {
                      if(articleA.year > articleB.year) {
                        return 1;
                      } else {
                        return -1;
                      }
                    });
                    return (
                      <section key={tag}>
                        <h3>({ii+1})关于{tag}方面的研究</h3>
                        <p>
                          {
                            list.map(({id, content, reference}) => {
                              references.push(reference);
                              const referenceIndex = references.length;
                              return (
                                <React.Fragment key={id}>
                                  {content}
                                  <sup>{`[${referenceIndex}]`}</sup>
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
      </div>

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

export default ArticleView;