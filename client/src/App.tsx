import React, { useEffect } from 'react';
import './styles/global.scss';
import './styles/bootstrap-utilities.css';
import AppRouter from './components/routing/app-router';
import { BrowserRouter as Router } from 'react-router-dom';
import useOnlineStatus from './hooks/use-is-online';
import useToken from './hooks/use-token';
import { useSelector } from 'react-redux';
import { selectAuth } from './store/authSlice';
import { ToastProvider } from 'react-toast-notifications';

const App = () => {
  let isOnline = useOnlineStatus();
  const [tokenExists] = useToken();
  const isLoggedIn = useSelector(selectAuth);

  useEffect(() => {}, []);

  useEffect(() => {
    // console.log(isOnline);
  }, [isOnline]);

  return (
    <React.Fragment>
      <ToastProvider>
        <Router>
          <AppRouter />
        </Router>
      </ToastProvider>
    </React.Fragment>
  );
};

export default App;
