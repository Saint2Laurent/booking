import React, { useEffect } from 'react';
import { Route, Switch, withRouter, useHistory } from 'react-router-dom';
import Login from '../auth/login/login';
import Register from '../auth/register/register';
import './nav.module.scss';
import { Layout, Menu } from 'antd';

import NavHeader from './nav/nav-header';
import NavSider from './nav/nav-sider';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectAuth } from '../../store/authSlice';
import Dashboard from '../dashboard/dashboard';
import ForgotPassword from '../auth/forgot-password/forgot-password';
import ForgotPasswordReset from '../auth/forgot-password/forgot-password-reset';
import AccountsSettings from '../settings/accounts/accounts-settings';

const AppRouter = () => {
  const { Content } = Layout;
  const { auth } = useSelector(selectAuth);
  const dispatch = useDispatch();
  let history = useHistory();

  useEffect(() => {
    if (!auth.isAuthenticated) {
      history.push('/auth/login');
    }
  }, [auth.isAuthenticated]);

  useEffect(() => {
    if (!localStorage.getItem('token') && auth.isAuthenticated) {
      dispatch(dispatch(logout()));
    }
  }, [localStorage.getItem('token')]);

  useEffect(() => {
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
              {auth.isAuthenticated && (
                <Route path="/settings/accounts" exact>
                  <AccountsSettings />
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
