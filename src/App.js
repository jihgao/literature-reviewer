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
import PreferencePage from './Preference';
import ReferencePage from './Reference';
import FormatterPage from './Formatter';
import ArticlePage from './Article';



const { Header, Content } = Layout;
moment.locale('zh-cn');

export default function App() {
  let location = useLocation();
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
                1.前言
              </Link>
            </Menu.Item>
            <Menu.Item key="/reference">
              <Link to='/reference'>
                2. 文献综述
              </Link>
            </Menu.Item>
            <Menu.Item key="/article">
              <Link to='/article'>
                3. 文章预览
              </Link>
            </Menu.Item>
            <Menu.SubMenu title="其他工具" key="/tools">
              <Menu.Item key="/fmt">
                <Link to='/fmt'>
                  参考文献格式化
                </Link>
              </Menu.Item>
            </Menu.SubMenu>
          </Menu>
        </Header>
        <Content className="layout__content">
          <Routes>
            <Route path="/" element={<PreferencePage />} />
            <Route path="/fmt" element={<FormatterPage />} />
            <Route path="/article" element={<ArticlePage />} />
            <Route path="/reference" element={<ReferencePage />} />
          </Routes>
        </Content>
      </Layout>
    </ConfigProvider>
  )
}
