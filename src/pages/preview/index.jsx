import React, { 
  useState, 
  useEffect, 
  useLayoutEffect, 
  createRef, 
  useCallback
} from 'react';
import {
  Row,
  Col
} from 'antd';
import {
  CloseOutlined,
  EditOutlined
} from '@ant-design/icons';
import ReferenceForm from '@forms/reference';
import usePreference from '@hooks/usePreference';
import useReferenceList from '@hooks/useReferenceList';
import useConclusion from '@hooks/useConclusion';
import './index.less';
import {
  groupBy
} from '@utils';

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

const Conclusion = () => {
  const [text] = useConclusion('');
  const pList = text?.split("\n")?.filter(Boolean);
  if(pList?.length) {
    return (
      <>
        <h2>评述</h2>
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

const PreviewPage = () => {
  const $container = createRef();
  const [editRecord, setEditRecord] = useState();
  const [dataSource, saveDataSource] = useReferenceList([]);
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
  const handleSubmitForm = useCallback(({isNew, ...record}) => {
    const index = dataSource.findIndex((item) => item.id === record.id);
    if(index !== -1) {
      dataSource.splice(index, 1, {...record});
    } else {
      dataSource.push({...record});
    }
    saveDataSource(dataSource.slice());
    setEditRecord();
  }, [dataSource, saveDataSource]);
  const handleHideReference = useCallback((targetReference) => {
    const nextDataSource = dataSource.map((record) => {
      if(targetReference === record.reference){
        record.active = false;
      }
      return record;
    });
    saveDataSource(nextDataSource);
  }, [dataSource, saveDataSource]);
  const handleEditReference = useCallback((targetReference) => {
    const targetRecord = dataSource.find((record) => {
      return targetReference === record.reference;
    });
    setEditRecord(targetRecord);
  }, [dataSource, setEditRecord]);
  const handleJumpToReference = useCallback((referenceNumber) => {
    const $target = document.getElementById(`reference-item__${referenceNumber}`);
    if($target){
      $target.scrollIntoView(true);
    }
  }, []);

  const tagListAll = dataSource.reduce((ret, record) => {
    if(Array.isArray(record.tags)){
      ret.push(...record.tags);
    } else if(record.tags){
      ret.push(record.tags);
    }
    return ret;
  }, []);
  const tagList = Array.from(new Set(tagListAll));
  return (
    <article className="page-preview">
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
                                  <sup 
                                    onClick={() => handleJumpToReference(referenceIndex)}
                                    className="page-preview__reference-sup"
                                  >
                                    {`[${referenceIndex}]`}
                                  </sup>
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
        <Conclusion />
      </div>

      <h2>引用文献</h2>
      <ol className="page-preview__reference-list">
        {
          references.map((reference, index) => {
            return (
              <li className="page-preview__reference-item" id={`reference-item__${index + 1}`} key={reference}>
                {reference}
                <span>
                  <CloseOutlined 
                    className="page-preview__reference-btn"
                    onClick={() => {
                      handleHideReference(reference);
                    }}
                  />
                  <EditOutlined
                    className="page-preview__reference-btn"
                    onClick={() => {
                      handleEditReference(reference);
                    }}
                  />
                </span>
              </li>
            )
          })
        }
      </ol>
      {
        editRecord && (
          <ReferenceForm 
            value={editRecord}
            visible={editRecord}
            tagList={tagList}
            index={dataSource.length}
            onCancel={() => setEditRecord()}
            onSubmit={handleSubmitForm}
          />
        )
      }
    </article>
  )
};

export default PreviewPage;