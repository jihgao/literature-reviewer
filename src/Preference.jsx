import React, { useState, useCallback, useEffect} from 'react';
import {
  Input,
  Typography,
  Row,
  Col,
  Button,
  Space,
  Divider
} from 'antd';
import usePreference from './hooks/usePreference';
const {
  Paragraph
} = Typography;
const {
  TextArea
} = Input;

const Tool = () => {
  const [text, updateText, saveText] = usePreference('');
  const handleTextChange = useCallback((evt) => {
    let nextText = evt.target.value;
    updateText(nextText);
  }, []);

  const handleSaveText = useCallback(() => {
    saveText(text);
  }, [text, saveText]);
  return (
    <Row className="page-preference" gutter={[16,16]} align="top">
      <Col lg={12} sm={16} md={18} />
      <Col lg={12} sm={8} md={6} style={{textAlign: 'right', alignSelf: 'center'}}>
        <Space>
          <Button type="primary" onClick={handleSaveText}>保存</Button>
        </Space>
      </Col>
      <Col lg={12} sm={24}>
        <TextArea 
          value={text}
          style={{height: 'calc(100vh - 150px)', minHeight: 200}}
          onChange={handleTextChange}
        />
      </Col>
      <Col sm={24} lg={0}>
        <Divider>
          前言
        </Divider>
      </Col>
      <Col lg={12} sm={24}>
        <Paragraph>
          {
            text?.length ? text.split("\n").filter(Boolean).map((pText, index) => (
              <Paragraph
                key={index}
                copyable={{text: pText}}
              >
                {pText}
              </Paragraph>
            )) : (
              <Paragraph style={{textAlign: 'center', paddingTop: 100}}>
                {text}
              </Paragraph>
            )
          }
        </Paragraph>
      </Col>
    </Row>
  )
}

export default Tool;