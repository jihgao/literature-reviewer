import React, { useState, useCallback, useEffect, useRef} from 'react';
import {
  Input,
  Typography,
  Row,
  Col,
  Button,
  Alert,
  Space,
  Divider
} from 'antd';
import {
  getReferenceListFromText
} from '@utils';
import './index.less';

const {
  Paragraph
} = Typography;
const {
  TextArea
} = Input;

const FormatterTool = () => {
  const [text, setText] = useState('');
  const [list, setList] = useState([]);
  const isPaste = useRef(false);
  useEffect(() => {
    const cachedText = window.localStorage.getItem('fmt-text');
    if(cachedText){
      const list = getReferenceListFromText(cachedText);
      setText(() => `${list.map((item) => `[${item.index}] ${item.reference}`).join('\n')}\n`);
      setList(list);
    }
  }, []);
  const handleTextChange = useCallback((evt) => {
    let nextText = evt.target.value;
    if(isPaste.current) {
      const list = getReferenceListFromText(nextText);
      setText(() => `${list.map((item) => `[${item.index}] ${item.reference}`).join('\n')}\n`);
      setList(list);
      isPaste.current = false;
    } else {
      setText(nextText);
    }
  }, []);
  const handleTextPaste = useCallback(() => {
    isPaste.current = true;
  }, []);
  const handleFormatText = useCallback(() => {
    const list = getReferenceListFromText(text);
    setText(() => `${list.map((item) => `[${item.index}] ${item.reference}`).join('\n')}\n`);
    setList(list);
  }, [text]);

  const handleSaveText = useCallback(() => {
    window.localStorage.setItem('fmt-text', text || '');
  }, [text]);
  return (
    <Row className="page-tools" gutter={[16,16]} align="top">
      <Col lg={12} sm={16} md={18}>
        <Alert
          message="粘贴自动格式化或输入参考文献点击格式化按钮"
          type="info"
        />
      </Col>
      <Col lg={12} sm={8} md={6} style={{textAlign: 'right', alignSelf: 'center'}}>
        <Space>
          <Button type="primary" onClick={handleSaveText}>保存</Button>
          <Button type="primary" onClick={handleFormatText}>格式化</Button>
        </Space>
      </Col>
      <Col lg={12} sm={24}>
        <TextArea 
          value={text}
          style={{height: 'calc(100vh - 150px)', minHeight: 200}}
          onChange={handleTextChange}
          onPaste={handleTextPaste}
        />
      </Col>
      <Col sm={24} lg={0}>
        <Divider>
          参考文献
        </Divider>
      </Col>
      <Col lg={12} sm={24}>
        <Paragraph>
          {
            list?.length ? list.map((item) => {
              return (
                <Paragraph
                  key={item.index}
                  copyable={{text: item.reference}}
                >
                  [{item.index}] {item.reference}
                </Paragraph>
              )
            }): (
              <Paragraph style={{textAlign: 'center', paddingTop: 100}}>
                暂无参考文献列表
              </Paragraph>
            )
          }
        </Paragraph>
      </Col>
    </Row>
  )
}

export default FormatterTool;