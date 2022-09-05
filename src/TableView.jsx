import {
  useCallback,
  useEffect,
  useState
} from 'react';
import {
  Button,
  Table,
  Space,
} from 'antd';
import {
  PlusOutlined,
  UpOutlined,
  DownOutlined,
  DeleteOutlined,
  CopyOutlined,
  EditOutlined
} from '@ant-design/icons';

export default function TableView({dataSource, onEditRecord = () => {}, onChange}) {
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
    }, [myDataSource, onChange]);
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
    }, [myDataSource]);
  
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
        width: 160,
      },
      {
        dataIndex: 'year',
        key: 'year',
        title: '年份',
        width: 50,
      },
      {
        dataIndex: 'region',
        key: 'region',
        title: '国内/国外',
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
        width: 180,
      },
      {
        dataIndex: 'createdAt',
        key: 'createdAt',
        title: '添加时间',
        width: 120,
        render: (createdAt) => {
          return new Date(createdAt).toLocaleString()
        }
      },
      {
        dataIndex: 'operation',
        key: 'operation',
        title: '操作',
        align: 'right',
        width: 140,
        render: (__, record, index) => {
          const realIndex = getRecordIndex(index);
          return (
            <Space size={0}>
              <Button type="text" onClick={() => onEditRecord(record)}>
                <EditOutlined />
              </Button>
              <Button disabled={index === 0} type="text" onClick={handleClickOnUp.bind(null, realIndex)}>
              <UpOutlined />
              </Button>
              <Button disabled={index === maxIndex}  type="text"  onClick={handleClickOnDown.bind(null, realIndex)}>
                <DownOutlined />
              </Button>
              <Button type="text" onClick={handleClickOnAdd.bind(null, realIndex)}>
                <PlusOutlined />
              </Button>
              <Button type="text" onClick={handleClickOnCopy.bind(null, realIndex)}>
                <CopyOutlined />
              </Button>
              <Button type="text" onClick={handleClickOnRemove.bind(null, realIndex)}>
                <DeleteOutlined />
              </Button>
            </Space>
          )
        }
      }
    ];
    return (
      <Table
        tableLayout='fixed'
        columns={myColumns}
        dataSource={myDataSource}
        rowKey="id"
        pagination={{
          ...pagination,
          showTotal: (total) => `共${total}`,
          showSizeChanger: true,
          showQuickJumper: true,
          total: myDataSource.length
        }}
        scroll={{y: 'calc(100vh - 240px)'}}
        onChange={handleTableChange}
      />
    );
}