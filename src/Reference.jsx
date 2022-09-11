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
  Input
} from 'antd';
import {
  PlusOutlined,
  ExportOutlined,
  UploadOutlined,
  DeleteOutlined 
} from '@ant-design/icons';

import MyTableView from './TableView';
import FormCreate from './FormCreate';

const {
  Search
} = Input;

function ReferencePage() {
  const [editRecord, setEditRecord] = useState();
  const [keyword, setKeyword] = useState('');
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
  const handleSubmitForm = useCallback(({isNew, ...record}) => {
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
  const onSearch = useCallback((nextKeyword) => {
    setKeyword(nextKeyword);
  }, []);
  return (
    <div className="page-reference">
      <Card
        className="page-reference__card"
        bordered={false}
        title={
          <Search
            placeholder="输入关键词搜素"
            allowClear
            onSearch={onSearch}
            style={{ width: 304 }}
          />
        }
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
        <MyTableView 
          dataSource={dataSource} 
          keyword={keyword}
          onEditRecord={setEditRecord}
          onChange={setDataSource}
        />
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

export default ReferencePage;
