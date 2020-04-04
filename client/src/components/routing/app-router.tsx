import React, { useEffect } from 'react';
import { Route, Switch, withRouter, useHistory } from 'react-router-dom';
import Login from '../auth/login/login';
import Register from '../auth/register/register';
import './nav.module.scss';
import { Layout, Menu } from 'antd';

import NavHeader from './nav/nav-header';
import NavSider from './nav/nav-sider';
import { useSelector } from 'react-redux';
import { selectAuth } from '../../store/authSlice';
import { BrowserRouter as Router } from 'react-router-dom';
import Dashboard from '../dashboard/dashboard';
import useIsInAuth from '../../hooks/use-is-in-auth';

const AppRouter = () => {
  const { Content } = Layout;
  const { auth } = useSelector(selectAuth);
  let history = useHistory();
  const isInAuth = false;

  useEffect(() => {
    console.log(auth);
  }, [auth.isAuthenticated]);

  return (
    <Layout style={{ height: '100vh' }}>
      {!isInAuth && <NavHeader />}
      <Layout>
        {!isInAuth && <NavSider />}
        <Layout>
          <Content className="site-layout-background">
            <Switch>
              <Route path="/auth/login">
                <Login />
              </Route>
              <Route path="/auth/register">
                <Register />
              </Route>
              <Route path="/" exact>
                <Dashboard />
              </Route>
            </Switch>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AppRouter;
