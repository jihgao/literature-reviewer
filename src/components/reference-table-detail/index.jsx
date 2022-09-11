import React from 'react';
import {
  Row,
  Col
} from 'antd';

function ReferenceTableDetail({record}) {
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

export default ReferenceTableDetail;