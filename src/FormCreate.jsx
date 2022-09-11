import React from 'react';
import { 
  Button, 
  Col,  
  Drawer, 
  Form, 
  Input, 
  Row, 
  Select, 
  Space,
  InputNumber
} from 'antd';

const { TextArea } = Input;

const FormCreate = ({visible, onCancel, tagList, value, onSubmit}) => {
  const [form] = Form.useForm();
  const onFinish = (values) => {
    if(onSubmit){
      onSubmit(values);
    }
  };
  const onClickSubmit = () => {
    form.submit();
  };
  return (
    <Drawer
      title={!value?.isNew ? '编辑' : '添加'}
      width={720}
      onClose={onCancel}
      visible={visible}
      bodyStyle={{ paddingBottom: 80 }}
      destroyOnClose
      extra={
        <Space>
          <Button onClick={onCancel}>
            取消
          </Button>
          <Button onClick={onClickSubmit} type="primary">
            提交
          </Button>
        </Space>
      }
    >
      <Form 
        form={form}
        layout="vertical" 
        initialValues={value}
        onFinish={onFinish}
        hideRequiredMark
      >
          <Form.Item
            name="id"
            hidden
          />
          <Form.Item
            name="index"
            hidden
          />
          <Form.Item
            name="createdAt"
            hidden
          />
          <Form.Item
            label="序号"
          >
            <span className="ant-form-text">
              {value?.index}
            </span>
          </Form.Item>
          <Form.Item
            name="author"
            label="作者"
            rules={[{ required: true, message: '作者' }]}
          >
            <Input
              style={{ width: '100%' }}
              placeholder="作者"
            />
          </Form.Item>
          <Row gutter={[16,16]}>
            <Col span={12}>
              <Form.Item
                name="year"
                label="年份"
              >
                <InputNumber 
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="region"
                label="国内/国外"
              >
              <Select 
                style={{ width: '100%' }}
              >
                <Select.Option value="国内">国内</Select.Option>
                <Select.Option value="国外">国外</Select.Option>
              </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="tags"
            label="标签"
            rules={[{ type: 'array' }]}
          >
            <Select 
              mode='tags'
              style={{ width: '100%' }}
            >
              {
                tagList.map((tag) => {
                  return (
                    <Select.Option 
                      value={tag}
                      key={tag}
                    >
                      {tag}
                    </Select.Option>
                  );
                })
              }
            </Select>
          </Form.Item>
          <Form.Item
            name="content"
            label="内容"
          >
            <TextArea 
              autoSize={{ minRows: 2 }}
            />
          </Form.Item>
          <Form.Item
            name="originContent"
            label="原始内容"
          >
            <TextArea 
              autoSize={{ minRows: 2 }}
            />
          </Form.Item>
          <Form.Item
            name="reference"
            label="引用"
          >
            <TextArea 
              autoSize={{ minRows: 2 }}
            />
          </Form.Item>
      </Form>
    </Drawer>
  );
};

export default FormCreate;