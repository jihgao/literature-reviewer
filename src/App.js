import React from 'react';
import {
  Routes,
  Route,
  Link,
  useLocation
} from "react-router-dom";
import { ConfigProvider, Layout, Menu } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import HomePage from './Home';
import FormatterPage from './Formatter';


const { Header, Content } = Layout;
moment.locale('zh-cn');

export default function App() {
  let location = useLocation();
  console.log({location});
  return (
    <ConfigProvider locale={zhCN}>
      <Layout className="layout">
        <Header className="layout__header">
          <Menu
            theme="dark"
            mode="horizontal"
            activeKey={location.pathname}
            selectedKeys={[location.pathname].filter(Boolean)}
          >
            <Menu.Item key="/">
              <Link to='/'>
                主页
              </Link>
            </Menu.Item>
            <Menu.Item key="/fmt">
              <Link to='/fmt'>
                参考文献格式化
              </Link>
            </Menu.Item>
          </Menu>
        </Header>
        <Content className="layout__content">
          <Routes>
            <Route path="/fmt" element={<FormatterPage />} />
            <Route path="/" element={<HomePage />} />
          </Routes>
        </Content>
      </Layout>
    </ConfigProvider>
  )
}
