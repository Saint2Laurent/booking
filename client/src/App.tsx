import React, { useEffect } from 'react';
import './styles/global.scss';
import './styles/bootstrap-utilities.css';
import AppRouter from './components/routing/app-router';
import { BrowserRouter as Router, useParams, useHistory } from 'react-router-dom';
import useOnlineStatus from './hooks/use-is-online';
import useToken from './hooks/use-token';
import { useDispatch, useSelector } from 'react-redux';
import { selectAuth, setUser, setIsAuthenticated } from './store/authSlice';
import { ToastProvider } from 'react-toast-notifications';
import { useHistoryTravel } from '@umijs/hooks';
import { useLazyQuery, useMutation, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { isEmpty } from '../../shared/utils/is-empty';
import { User } from '../../server/src/entity/User';
const App = () => {
  let isOnline = useOnlineStatus();
  const [token] = useToken();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(selectAuth);

  const ME = gql`
    query {
      me {
        id
        mail
        fullName
        isConfirmed
        role
        isGoogle
        googleId
      }
    }
  `;

  useQuery(ME, {
    skip: isEmpty(token),
    onCompleted: d => {
      console.log('runned');
      const user: User = d.me;
      if (user) {
        dispatch(setUser(user));
        dispatch(setIsAuthenticated(true));
      }
    }
  });

  useEffect(() => {
    console.log('token changed');
  }, [token]);

  useEffect(() => {
    // console.log(isOnline);\
    // registerUser()
    //   .then(d => {
    //     console.log(d);
    //   })
    //   .catch(e => {
    //     console.log(e);
    //   });
  }, []);

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
