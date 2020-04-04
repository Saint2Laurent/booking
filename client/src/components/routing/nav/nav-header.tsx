import React from 'react';
import { Layout, Menu } from 'antd';
import style from '../nav.module.scss';
import NavProfile from './nav-profile';
import '../nav.scss';
import logo from '../../../assets/images/logo-solo.svg';
import useIsMobile from '../../../hooks/use-is-mobile';

const NavHeader = () => {
  const { Header } = Layout;
  const isMobile = useIsMobile();

  return (
    <Header className={style.navbar}>
      <div className={style.navLogo}>
        <img className={style.navLogoImg} src={logo} alt="" />
      </div>
      <Menu
        style={{ display: isMobile ? 'none' : 'flex' }}
        className={style.nav}
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={['2']}
      >
        <Menu.Item className="nav-menu-item" key="1">
          ΠΙΝΑΚΑΣ
        </Menu.Item>
        <Menu.Item className="nav-menu-item" key="2">
          ITEM 2
        </Menu.Item>
        <Menu.Item className="nav-menu-item" key="3">
          ITEM 3
        </Menu.Item>
      </Menu>
      <NavProfile />
    </Header>
  );
};

export default NavHeader;
