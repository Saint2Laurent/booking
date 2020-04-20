import React from 'react';
import { Layout, Menu } from 'antd';
import style from '../nav.module.scss';
import NavProfile from './profile/nav-profile';
import '../nav.scss';
import logo from '../../../assets/images/logo-solo.svg';
import useIsMobile from '../../../hooks/use-is-mobile';
import NavNotifications from './notifications/nav-notifications';
import { useHistory } from 'react-router-dom';

const NavHeader = () => {
  const { Header } = Layout;
  const isMobile = useIsMobile();
  const history = useHistory();

  return (
    <Header className={style.navbar}>
      <div className={style.navLogo} onClick={() => history.push('/dashboard')}>
        <img className={style.navLogoImg} src={logo} alt="" />
      </div>
      <Menu
        style={{ display: isMobile ? 'none' : 'flex' }}
        className={style.nav}
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={[history.location.pathname.split('/')[1] || 'dashboard']}
      >
        <Menu.Item className="nav-menu-item" key="dashboard" onClick={() => history.push('/')}>
          ΠΙΝΑΚΑΣ
        </Menu.Item>
        <Menu.Item className="nav-menu-item" key="2">
          ITEM 2
        </Menu.Item>
        <Menu.Item className="nav-menu-item" key="settings" onClick={() => history.push('/settings/accounts')}>
          ΡΥΘΜΙΣΕΙΣ
        </Menu.Item>
      </Menu>
      <NavNotifications />
      <NavProfile />
    </Header>
  );
};

export default NavHeader;
