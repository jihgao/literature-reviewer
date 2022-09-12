import React, { useCallback } from 'react';
import {
  Input,
  Typography,
  Row,
  Col,
  Divider
} from 'antd';
import useConclusion from '@hooks/useConclusion';
import './index.less';

const {
  Paragraph
} = Typography;
const {
  TextArea
} = Input;

const ConclusionPage = () => {
  const [text, saveText] = useConclusion('');
  const handleTextChange = useCallback((evt) => {
    let nextText = evt.target.value;
    saveText(nextText);
  }, [saveText]);
  return (
    <Row className="page-conclusion" gutter={[16,16]} align="top">
      <Col lg={12} sm={24}>
        <TextArea 
          value={text}
          style={{height: 'calc(100vh - 150px)', minHeight: 200}}
          onChange={handleTextChange}
        />
      </Col>
      <Col sm={24} lg={0}>
        <Divider>
          评述
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

export default ConclusionPage;