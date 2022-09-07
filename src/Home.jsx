import {
  useCallback,
  useEffect,
  useState
} from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  Card,
  Button,
  Space,
  message,
  Radio,
  Input
} from 'antd';
import {
  PlusOutlined,
  ExportOutlined,
  UploadOutlined,
  TableOutlined,
  FileTextOutlined,
  DeleteOutlined 
} from '@ant-design/icons';

import MyTableView from './TableView';
import ArticleView from './ArticleView';
import FormCreate from './FormCreate';

const {
  TextArea
} = Input;

function HomePage() {
  const [editRecord, setEditRecord] = useState();
  const [view, setView] = useState('table');
  const [dataSource, setDataSource] = useState([]);
  useEffect(() => {
    const cached = window.localStorage.getItem('lunwen');
    if(cached){
      try {
        const nextDataSource = JSON.parse(cached);
        if(Array.isArray(nextDataSource)){
          setDataSource(nextDataSource);
        }
      } catch (error) {
        
      }
    }
  }, []);
  const handleTextAreaChange = (evt) => {
    console.log({evt});
  };
  const handleAddRecord = () => {
    setEditRecord({
      index: uuidv4(),
      id: uuidv4(),
      isNew: true,
      createdAt: Date.now()
    });
  };
  const handleClear = useCallback(() => {
    setDataSource([]);
  }, []);
  const handleExportJson = useCallback(() => {
    window.localStorage.setItem('lunwen', JSON.stringify(dataSource));
    message.success('导出成功');
  }, [dataSource]);
  const handleImportJson = useCallback(() => {
    const cached = window.localStorage.getItem('lunwen');
    if(cached){
      try {
        const nextDataSource = JSON.parse(cached);
        if(Array.isArray(nextDataSource)){
          setDataSource(nextDataSource.map((record) => {
            return {
              ...record,
              createdAt: Date.now()
            };
          }));
        }
      } catch (error) {
        
      }
    }
  }, []);
  const handleSubmitForm = useCallback((record) => {
    const index = dataSource.findIndex((item) => item.id === record.id);
    if(index !== -1) {
      dataSource.splice(index, 1, record);
    } else {
      dataSource.push(record);
    }
    setDataSource(dataSource.slice());
    setEditRecord();
  }, [dataSource]);

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
    <div className="page-home">
      <Card
        className="page-home__card"
        title={
          <div style={{textAlign: 'left'}}>
            <Radio.Group value={view} onChange={(evt) => setView(evt.target.value)}>
              <Radio.Button value={'table'}>
                <Space>
                  <TableOutlined />
                  表格
                </Space>
              </Radio.Button>
              <Radio.Button value={'article'}>
                <Space>
                  <FileTextOutlined />
                  文章
                </Space>
              </Radio.Button>
            </Radio.Group>
          </div>
        }
        bordered={false}
        extra={
          <Space>
            <Button 
              onClick={handleImportJson}
              icon={<UploadOutlined />}
              type="primary"
              ghost
            >
              载入
            </Button>
            <Button 
              onClick={handleClear}
              icon={<DeleteOutlined  />}
              type="primary"
              ghost
            >
              清空
            </Button>
            <Button 
              onClick={handleExportJson}
              icon={<ExportOutlined />}
              type="primary"
              ghost
            >
              保存
            </Button>
            <Button 
              onClick={handleAddRecord}
              icon={<PlusOutlined />}
              type="primary"
            >
              添加
            </Button>
          </Space>
        }
      >
        {
          view === 'table' && (
            <MyTableView 
              dataSource={dataSource} 
              onEditRecord={setEditRecord}
              onChange={setDataSource}
            />
          )
        }
        {
          view === 'article' && (
            <ArticleView dataSource={dataSource} />
          )
        }
        {
          view === 'tools' && (
            <TextArea onChange={handleTextAreaChange} />
          )
        }
        {
          editRecord && (
            <FormCreate 
              value={editRecord}
              visible={editRecord}
              tagList={tagList}
              index={dataSource.length}
              onCancel={() => setEditRecord()}
              onSubmit={handleSubmitForm}
            />
          )
        }
      </Card>
    </div>
  );
}

export default HomePage;
