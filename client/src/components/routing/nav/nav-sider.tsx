import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import useIsInAuth from '../../../hooks/use-is-in-auth';
import { UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { inspect } from 'util';
import styles from '../nav.module.scss';

const NavSider = () => {
  const [isInAuth] = useIsInAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { Header, Sider, Content } = Layout;

  return (
    <Sider collapsedWidth={60} collapsible collapsed={isCollapsed} theme={'light'}>
      <Menu mode="inline" defaultSelectedKeys={['1']}>
        <Menu.Item
          className={`nav-sider-item`}
          key="1"
          onClick={() => {
            setIsCollapsed(!isCollapsed);
          }}
        >
          <UserOutlined />
          <span>Προσωπικο</span>
        </Menu.Item>
        <Menu.Item key="2" className={`nav-sider-item`}>
          <VideoCameraOutlined />
          <span>Άρχεια</span>
        </Menu.Item>
        <Menu.Item key="3" className={`nav-sider-item`}>
          <UploadOutlined />
          <span>Στάτιστικα</span>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default NavSider;
