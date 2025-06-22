import React from "react"
import { Outlet } from "react-router";
import { Layout } from "antd";

const { Header, Footer, Sider, Content } = Layout;
import SideMenu from "./components/layout/SideMenu";
import TopHeader from "./components/layout/TopHeader";

const pageStyle = {
  headerStyle: {
    width: '100%',
    height: '8vh',
    minHeight: '56px',
    color: '#fff',
    padding: '0',
    backgroundColor: 'red'
  },
  contentStyle: {
    minHeight: 120,
    padding: '10px',
    backgroundColor: '#f1f1f1',
  },
  siderStyle: {
    width: '5%',
    height: '100vh',
    padding: 0,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  layoutStyle: {
    overflow: 'hidden',
    width: '100%',
    height: '100vh'
  }
}

export default function App() {
  return (
    <Layout style={pageStyle.layoutStyle}>
      <Sider style={pageStyle.siderStyle}>
        <SideMenu></SideMenu>
      </Sider>
      <Layout>
        <Header style={pageStyle.headerStyle}>
          <TopHeader></TopHeader>
        </Header>
        <Content style={pageStyle.contentStyle}>
          <div>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}

