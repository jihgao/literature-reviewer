import {
  useCallback,
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
  DeleteOutlined 
} from '@ant-design/icons';
import { exportJson } from './utils/exportJson';
import useReferenceList from './hooks/useReferenceList';
import MyTableView from './TableView';
import FormCreate from './FormCreate';

const {
  Search
} = Input;

function ReferencePage() {
  const [editRecord, setEditRecord] = useState();
  const [keyword, setKeyword] = useState('');
  const [dataSource, setDataSource] = useReferenceList([]);
  const handleAddRecord = () => {
    setEditRecord({
      index: uuidv4(),
      id: uuidv4(),
      isNew: true,
      createdAt: Date.now()
    });
  };
  const handleTableChange = (nextList) => {
    setDataSource(nextList);
  };
  const handleClear = useCallback(() => {
    setDataSource([]);
  }, [setDataSource]);
  const handleExportJson = useCallback(() => {
    exportJson('文献综述.json',dataSource);
    message.success('导出成功');
  }, [dataSource]);
  const handleSubmitForm = useCallback(({isNew, ...record}) => {
    const index = dataSource.findIndex((item) => item.id === record.id);
    if(record && record.active === undefined) {
      record.active = true;
    }
    if(index !== -1) {
      dataSource.splice(index, 1, record);
    } else {
      dataSource.push(record);
    }
    setDataSource(dataSource.slice());
    setEditRecord();
  }, [dataSource, setDataSource]);

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
              导出
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
          onChange={handleTableChange}
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
