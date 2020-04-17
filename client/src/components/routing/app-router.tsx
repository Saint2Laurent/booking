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
import ForgotPassword from '../auth/forgot-password/forgot-password';
import ForgotPasswordReset from '../auth/forgot-password/forgot-password-reset';

const AppRouter = () => {
  const { Content } = Layout;
  const { auth } = useSelector(selectAuth);
  let history = useHistory();

  useEffect(() => {
    console.log(auth);
  });

  // useEffect(() => {
  //   console.log(auth);
  //   if (auth.isAuthenticated) {
  //     history.push('/');
  //   } else {
  //     history.push('/auth/login');
  //   }
  // }, [auth.isAuthenticated]);

  useEffect(() => {
    console.log(history);
    if (history.location.pathname.split('/')[1] === 'auth' && auth.isAuthenticated) {
      history.push('/');
    }
    if (history.location.pathname === '/' && !auth.isAuthenticated) {
      history.push('/auth/login');
    }
  }, [history.location.pathname]);

  return (
    <Layout style={{ height: '100vh' }}>
      {auth.isAuthenticated && <NavHeader />}
      <Layout>
        {auth.isAuthenticated && <NavSider />}
        <Layout>
          <Content className="site-layout-background">
            <Switch>
              <Route path="/auth/login">
                <Login />
              </Route>
              <Route path="/auth/register">
                <Register />
              </Route>
              <Route exact path="/auth/reset-password">
                <ForgotPassword />
              </Route>
              <Route path="/auth/reset-password/:tokenId">
                <ForgotPasswordReset />
              </Route>

              {auth.isAuthenticated && (
                <Route path="/" exact>
                  <Dashboard />
                </Route>
              )}
            </Switch>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AppRouter;
