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
} from 'antd';
import {
  PlusOutlined,
  UpOutlined,
  DownOutlined,
  DeleteOutlined,
  CopyOutlined,
  EditOutlined
} from '@ant-design/icons';

export default function TableView({dataSource, keyword, onEditRecord = () => {}, onChange}) {
    const [pagination, setPagination] = useState({
      pageSize: 10,
      current: 1,
    });
    const [myDataSource, setMyDataSource] = useState(dataSource);
    useEffect(() => {
      setMyDataSource(dataSource);
    }, [dataSource]);
    const handleChange = useCallback((nextDataSource) => {
      setMyDataSource(nextDataSource);
      if(onChange){
        onChange(nextDataSource);
      }
    }, [onChange]);
    const handleClickOnCopy = useCallback((index) => {
      const nextDataSource = myDataSource.slice();
      const newRecord = {
        ...nextDataSource[index],
        id: Date.now()
      };
      if(Array.isArray(newRecord.tags)){
        newRecord.tags = newRecord.tags.slice();
      }
      nextDataSource.splice(index, 0, newRecord);
      handleChange(nextDataSource);
    }, [myDataSource, handleChange]);
    const handleClickOnUp = useCallback((index) => {
      const nextDataSource = myDataSource.slice();
      [nextDataSource[index - 1], nextDataSource[index]] = [nextDataSource[index], nextDataSource[index - 1]];
      handleChange(nextDataSource);
    }, [myDataSource, handleChange]);
    const handleTableChange = useCallback((nextPagination) => {
      setPagination(nextPagination);
    }, []);
  
     const handleClickOnDown = useCallback((index) => {
      const nextDataSource = myDataSource.slice();
      [nextDataSource[index], nextDataSource[index+1]] = [nextDataSource[index+1], nextDataSource[index]];
      handleChange(nextDataSource);
    }, [myDataSource, handleChange]);
     const handleClickOnAdd = useCallback((index) => {
      const nextDataSource = myDataSource.slice();
      nextDataSource.splice(index+1, 0, {
        id: Date.now(),
        title: '',
        content: '',
        region: '',
      });
      handleChange(nextDataSource);
    }, [myDataSource, handleChange]);
  
     const handleClickOnRemove = useCallback((index) => {
      const nextDataSource = myDataSource.slice();
      nextDataSource.splice(index, 1);
      handleChange(nextDataSource);
    }, [handleChange, myDataSource]);
  
    const getRecordIndex = (index) => {
      return pagination.pageSize*(pagination.current -1) + index;
    };
    const tailLength = Math.ceil(dataSource.length % pagination.pageSize);
   
    const maxIndex = pagination.current > Math.floor(dataSource.length /  pagination.pageSize) ? (tailLength - 1) :  pagination.pageSize;
    const myColumns = [
      {
        dataIndex: 'index',
        key: 'index',
        title: '序号',
        width: 40,
        render: (value, record, index) => {
          return getRecordIndex(index) + 1;
        }
      },
      {
        dataIndex: 'author',
        key: 'author',
        title: '作者',
        width: 50,
      },
      {
        dataIndex: 'content',
        key: 'content',
        title: '内容',
        width: 150,
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
        dataIndex: 'region',
        key: 'region',
        title: '国内外',
        width: 50,
      },
      {
        dataIndex: 'tags',
        key: 'tags',
        title: '标签',
        width: 80,
      },
      {
        dataIndex: 'reference',
        key: 'reference',
        title: '引用',
        width: 170,
      },
      {
        dataIndex: 'createdAt',
        key: 'createdAt',
        title: '添加时间',
        width: 120,
        sorter: {
          compare: (a, b) => a.createdAt - b.createdAt,
          multiple: 2,
        },
        render: (createdAt) => {
          return new Date(createdAt).toLocaleString()
        }
      },
      {
        dataIndex: 'operation',
        key: 'operation',
        title: '操作',
        align: 'right',
        width: 120,
        render: (__, record, index) => {
          const realIndex = getRecordIndex(index);
          return (
            <Row gutter={[4, 4]} wrap align="end">
              <Col flex="none">
                <Button type="text" onClick={() => onEditRecord(record)}>
                  <EditOutlined />
                </Button>
              </Col>
              <Col flex="none">
                <Button disabled={index === 0} type="text" onClick={handleClickOnUp.bind(null, realIndex)}>
                  <UpOutlined />
                </Button>
              </Col>
              <Col flex="none">
                <Button disabled={index === maxIndex}  type="text"  onClick={handleClickOnDown.bind(null, realIndex)}>
                  <DownOutlined />
                </Button>
              </Col>
              <Col flex="none">
                <Button type="text" onClick={handleClickOnAdd.bind(null, realIndex)}>
                  <PlusOutlined />
                </Button>
              </Col>
              <Col flex="none">
                <Button type="text" onClick={handleClickOnCopy.bind(null, realIndex)}>
                  <CopyOutlined />
                </Button>
              </Col>
              <Col flex="none">
                <Button type="text" onClick={handleClickOnRemove.bind(null, realIndex)}>
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
        tableLayout='fixed'
        columns={myColumns}
        dataSource={filteredDataSource}
        rowKey="id"
        pagination={{
          ...pagination,
          showTotal: (total) => `共${total}`,
          showSizeChanger: true,
          showQuickJumper: true,
          total: filteredDataSource.length
        }}
        scroll={{y: 'calc(100vh - 330px)'}}
        onChange={handleTableChange}
      />
    );
}