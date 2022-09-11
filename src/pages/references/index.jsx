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
  Input,
  Table,
  Row,
  Col,
  Switch
} from 'antd';
import {
  PlusOutlined,
  UpOutlined,
  DownOutlined,
  DeleteOutlined,
  CopyOutlined,
  EditOutlined,
  ExportOutlined,
} from '@ant-design/icons';
import { exportJson } from '@utils';
import useReferenceList from '@hooks/useReferenceList';
import ReferenceForm from '@forms/reference';
import ReferenceTableDetail from '@components/reference-table-detail';
import './index.less';

const {
  Search
} = Input;

function ReferencesPage() {
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
      dataSource.splice(index, 1, {...record});
    } else {
      dataSource.push({...record});
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
  const [pagination, setPagination] = useState({
    pageSize: 10,
    current: 1,
  });
  const handleTableChange = useCallback((nextPagination) => {
    setPagination(nextPagination);
  }, []);
  const handleClickOnCopy = useCallback((target) => {
    const targetIndex = dataSource.findIndex((record) => {
      return record.id === target.id;
    });
    if(targetIndex !== -1) {
      const nextDataSource = dataSource.slice();
      const newRecord = {
        ...nextDataSource[targetIndex],
        id: Date.now()
      };
      if(Array.isArray(newRecord.tags)){
        newRecord.tags = newRecord.tags.slice();
      }
      nextDataSource.splice(targetIndex, 0, newRecord);
      setDataSource(nextDataSource);
    }
  }, [dataSource, setDataSource]);
  const handleClickOnUp = useCallback((target) => {
    const targetIndex = dataSource.findIndex((record) => {
      return record.id === target.id;
    });
    if(targetIndex !== -1) {
      const nextDataSource = dataSource.slice();
      [nextDataSource[targetIndex - 1], nextDataSource[targetIndex]] = [nextDataSource[targetIndex], nextDataSource[targetIndex - 1]];
      setDataSource(nextDataSource);
    }
  }, [dataSource, setDataSource]);
  const handleClickOnDown = useCallback((target) => {
    const targetIndex = dataSource.findIndex((record) => {
      return record.id === target.id;
    });
    if(targetIndex !== -1) {
      const nextDataSource = dataSource.slice();
      [nextDataSource[targetIndex], nextDataSource[targetIndex+1]] = [nextDataSource[targetIndex+1], nextDataSource[targetIndex]];
      setDataSource(nextDataSource);
    }
  }, [dataSource, setDataSource]);
  const handleClickOnAdd = useCallback((target) => {
    const targetIndex = dataSource.findIndex((record) => {
      return record.id === target.id;
    });
    if(targetIndex !== -1) {
      const nextDataSource = dataSource.slice();
      nextDataSource.splice(targetIndex+1, 0, {
        id: Date.now(),
        title: '',
        content: '',
        region: '',
      });
      setDataSource(nextDataSource);
    }
  }, [dataSource, setDataSource]);

  const handleClickOnRemove =  useCallback((target) => {
    const targetIndex = dataSource.findIndex((record) => {
      return record.id === target.id;
    });
    if(targetIndex !== -1) {
      const nextDataSource = dataSource.slice();
      nextDataSource.splice(targetIndex, 1);
      setDataSource(nextDataSource);
    }
  }, [dataSource, setDataSource]);

  const handleClickOnToggle = useCallback((target) => {
    const targetIndex = dataSource.findIndex((record) => {
      return record.id === target.id;
    });
    if(targetIndex !== -1) {
      const nextDataSource = dataSource.slice();
      const targetRecord = nextDataSource[targetIndex];
      const newRecord = {
        ...targetRecord,
        active: !targetRecord?.active,
      };
      nextDataSource.splice(targetIndex, 1, newRecord);
      setDataSource(nextDataSource);
    }
  }, [dataSource, setDataSource]);

  const rowClassName = (record) => {
    if(record.content?.trim() === record.originContent?.trim()) {
      return `table-row--need-update`;
    } else {
      return '';
    }
  }

  const tailLength = Math.ceil(dataSource.length % pagination.pageSize);
   
  const maxIndex = pagination.current > Math.floor(dataSource.length /  pagination.pageSize) ? (tailLength - 1) :  pagination.pageSize;
  const myColumns = [
    {
      dataIndex: 'author',
      key: 'author',
      title: '作者',
      width: 60,
    },
    {
      dataIndex: 'reference',
      key: 'reference',
      title: '引用',
      width: 200,
    },
    {
      dataIndex: 'tags',
      key: 'tags',
      title: '标签',
      width: 80,
    },
    {
      dataIndex: 'year',
      key: 'year',
      title: '年份',
      width: 50,
      sorter: {
        compare: (a, b) => a.year - b.year,
        multiple: 1,
      },
    },
    {
      dataIndex: 'active',
      key: 'active',
      title: '启用',
      width: 40,
      render: (__, record) => {
        return (
          <Switch 
            checked={record.active}
            onClick={handleClickOnToggle.bind(null, record)} 
          />
        );
      }
    },
    {
      dataIndex: 'operation',
      key: 'operation',
      title: '操作',
      align: 'right',
      width: 130,
      render: (__, record, index) => {
        return (
          <Row gutter={[0, 4]} wrap align="end">
            <Col flex="none">
              <Button 
                style={{padding: 0, aspectRatio: 1}} 
                type="text" 
                onClick={() => setEditRecord(record)}
              >
                <EditOutlined />
              </Button>
            </Col>
            <Col flex="none">
              <Button 
                style={{padding: 0, aspectRatio: 1}}
                disabled={index === 0} 
                type="text" 
                onClick={handleClickOnUp.bind(null, record)}
              >
                <UpOutlined />
              </Button>
            </Col>
            <Col flex="none">
              <Button 
                style={{padding: 0, aspectRatio: 1}} 
                disabled={index === maxIndex}  
                type="text"
                onClick={handleClickOnDown.bind(null, record)}
              >
                <DownOutlined />
              </Button>
            </Col>
            <Col flex="none">
              <Button 
                style={{padding: 0, aspectRatio: 1}} 
                type="text"
                onClick={handleClickOnAdd.bind(null, record)}
              >
                <PlusOutlined />
              </Button>
            </Col>
            <Col flex="none">
              <Button 
                style={{padding: 0, aspectRatio: 1}} 
                type="text"
                 onClick={handleClickOnCopy.bind(null, record)}
              >
                <CopyOutlined />
              </Button>
            </Col>
            <Col flex="none">
              <Button 
                style={{padding: 0, aspectRatio: 1}} 
                type="text"
                onClick={handleClickOnRemove.bind(null, record)}
              >
                <DeleteOutlined />
              </Button>
            </Col>
          </Row>
        )
      }
    }
  ];
  const filteredDataSource = keyword ? dataSource.filter((record) => {
    if(record.author?.indexOf(keyword) > -1) {
      return true;
    } else {
      return false;
    }
  }): dataSource;
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
        <Table
          columns={myColumns}
          dataSource={filteredDataSource}
          rowClassName={rowClassName}
          rowKey="id"
          pagination={{
            ...pagination,
            showTotal: (total) => `共${total}`,
            showSizeChanger: true,
            showQuickJumper: true,
            total: filteredDataSource.length
          }}
          expandable={{
            columnWidth: 40,
            expandedRowRender: record => <ReferenceTableDetail record={record} />
          }}
          scroll={{y: 'calc(100vh - 330px)'}}
          onChange={handleTableChange}
        />
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
      </Card>
    </div>
  );
}

export default ReferencesPage;
