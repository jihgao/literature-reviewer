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
import PreferencePage from './pages/preference';
import ReferencesPage from './pages/references';
import FormatterToolPage from './pages/formatter-tool';
import PreviewPage from './pages/preview';
import ConclusionPage from './pages/conclusion';

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
            <Menu.Item key="/references">
              <Link to='/references'>
                2. 文献综述
              </Link>
            </Menu.Item>
            <Menu.Item key="/conclusion">
              <Link to='/conclusion'>
                3. 评述
              </Link>
            </Menu.Item>
            <Menu.Item key="/preview">
              <Link to='/preview'>
                4. 文章预览
              </Link>
            </Menu.Item>
            <Menu.SubMenu title="其他工具">
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
            <Route path="/fmt" element={<FormatterToolPage />} />
            <Route path="/preview" element={<PreviewPage />} />
            <Route path="/references" element={<ReferencesPage />} />
            <Route path="/conclusion" element={<ConclusionPage />} />
          </Routes>
        </Content>
      </Layout>
    </ConfigProvider>
  )
}
