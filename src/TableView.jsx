import {
  useCallback,
  useEffect,
  useState
} from 'react';
import {
  Button,
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
  EditOutlined
} from '@ant-design/icons';

function ReferenceDetail({record}) {
  return (
    <Row wrap gutter={[8, 16]}>
      <Col span={24}>
        <Row gutter={[8, 16]}>
          <Col span={12}>
            <Row gutter={[8, 8]} align="top">
              <Col>当前内容:</Col>
              <Col>{record.content}</Col>
            </Row>
          </Col>
          <Col span={12}>
            <Row gutter={[8, 8]} align="top">
              <Col>原始内容:</Col>
              <Col>{record.originContent}</Col>
            </Row>
          </Col>
        </Row>
      </Col>
      <Col span={6}>
        <Row gutter={[8, 8]}>
          <Col>序号:</Col>
          <Col>{record.index}</Col>
        </Row>
      </Col>
      <Col span={6}>
        <Row gutter={[8, 8]}>
          <Col>年份:</Col>
          <Col>{record.year}</Col>
        </Row>
      </Col>
      <Col span={6}>
        <Row gutter={[8, 8]}>
          <Col>国内/国外:</Col>
          <Col>{record.region}</Col>
        </Row>
      </Col>
      <Col span={6}>
        <Row gutter={[8, 8]}>
          <Col>领域:</Col>
          <Col>{record.tags}</Col>
        </Row>
      </Col>
      <Col  span={6}>
        <Row>
          <Col>添加时间: </Col>
          <Col>{new Date(record.createdAt).toLocaleString()}</Col>
        </Row>
      </Col>
    </Row>
  )
}
export default function TableView({dataSource, keyword, onEditRecord = () => {}, onChange}) {
    const [pagination, setPagination] = useState({
      pageSize: 10,
      current: 1,
    });
    const [myDataSource, setMyDataSource] = useState(dataSource);
    useEffect(() => {
      setMyDataSource(dataSource);
      setPagination({
        pageSize: 10,
        current: 1,
      });
    }, [dataSource]);
    const handleTableChange = useCallback((nextPagination) => {
      setPagination(nextPagination);
    }, []);
    const handleChange = useCallback((nextDataSource) => {
      setMyDataSource(nextDataSource);
      if(onChange){
        onChange(nextDataSource);
      }
    }, [onChange]);
    const handleClickOnCopy = useCallback((target) => {
      const targetIndex = myDataSource.findIndex((record) => {
        return record.id === target.id;
      });
      if(targetIndex !== -1) {
        const nextDataSource = myDataSource.slice();
        const newRecord = {
          ...nextDataSource[targetIndex],
          id: Date.now()
        };
        if(Array.isArray(newRecord.tags)){
          newRecord.tags = newRecord.tags.slice();
        }
        nextDataSource.splice(targetIndex, 0, newRecord);
        handleChange(nextDataSource);
      }
    }, [myDataSource, handleChange]);
    const handleClickOnUp = useCallback((target) => {
      const targetIndex = myDataSource.findIndex((record) => {
        return record.id === target.id;
      });
      if(targetIndex !== -1) {
        const nextDataSource = myDataSource.slice();
        [nextDataSource[targetIndex - 1], nextDataSource[targetIndex]] = [nextDataSource[targetIndex], nextDataSource[targetIndex - 1]];
        handleChange(nextDataSource);
      }
    }, [myDataSource, handleChange]);
    const handleClickOnDown = useCallback((target) => {
      const targetIndex = myDataSource.findIndex((record) => {
        return record.id === target.id;
      });
      if(targetIndex !== -1) {
        const nextDataSource = myDataSource.slice();
        [nextDataSource[targetIndex], nextDataSource[targetIndex+1]] = [nextDataSource[targetIndex+1], nextDataSource[targetIndex]];
        handleChange(nextDataSource);
      }
    }, [myDataSource, handleChange]);
    const handleClickOnAdd = useCallback((target) => {
      const targetIndex = myDataSource.findIndex((record) => {
        return record.id === target.id;
      });
      if(targetIndex !== -1) {
        const nextDataSource = myDataSource.slice();
        nextDataSource.splice(targetIndex+1, 0, {
          id: Date.now(),
          title: '',
          content: '',
          region: '',
        });
        handleChange(nextDataSource);
      }
    }, [myDataSource, handleChange]);
  
    const handleClickOnRemove =  useCallback((target) => {
      const targetIndex = myDataSource.findIndex((record) => {
        return record.id === target.id;
      });
      if(targetIndex !== -1) {
        const nextDataSource = myDataSource.slice();
        nextDataSource.splice(targetIndex, 1);
        handleChange(nextDataSource);
      }
    }, [handleChange, myDataSource]);

    const handleClickOnToggle = useCallback((target) => {
      const targetIndex = myDataSource.findIndex((record) => {
        return record.id === target.id;
      });
      if(targetIndex !== -1) {
        const nextDataSource = myDataSource.slice();
        const targetRecord = nextDataSource[targetIndex];
        const newRecord = {
          ...targetRecord,
          active: !targetRecord?.active,
        };
        nextDataSource.splice(targetIndex, 1, newRecord);
        handleChange(nextDataSource);
      }
    }, [handleChange, myDataSource]);

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
                  onClick={() => onEditRecord(record)}
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
    const filteredDataSource = keyword ? myDataSource.filter((record) => {
      if(record.author?.indexOf(keyword) > -1) {
        return true;
      } else {
        return false;
      }
    }): myDataSource;
    return (
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
          expandedRowRender: record => <ReferenceDetail record={record} />
        }}
        scroll={{y: 'calc(100vh - 330px)'}}
        onChange={handleTableChange}
      />
    );
}