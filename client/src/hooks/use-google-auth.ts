import React, { useEffect, useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { GoogleLoginResponse, GoogleLoginResponseOffline, UseGoogleLoginResponse } from 'react-google-login';
import { GoogleLoginResponse as GoogleAuthResponse } from '../../../shared/types/api/auth/login';
import { GoogleLoginErrors } from '../../../server/src/modules/auth/login/google/google-login.types';
import { useHistory } from 'react-router-dom';
import { login } from '../store/authSlice';
import { useDispatch } from 'react-redux';
import { stringify } from 'querystring';

const useGoogleAuth = () => {
  const [googleToken, setGoogleToken] = useState('');
  const history = useHistory();
  const dispatch = useDispatch();

  const GOOGLE_LOGIN_USER = gql`
    mutation {
      googleLogin(token: "${googleToken}") {
        ... on GoogleLoginResponse {
          user {
            id
            fullName
            mail
            profileImageUrl
          }
          token
        }
        ... on GoogleLoginErrors {
          _tokenInvalid
        }
      }
    }
  `;

  const [googleLoginUser] = useMutation(GOOGLE_LOGIN_USER, { fetchPolicy: 'no-cache' });
  const [googleLoginSuccessful, setGoogleLoginSuccessful] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [googleErrors, setGoogleErrors] = useState<GoogleLoginErrors>({});

  const historyPush = (url: string) => {
    history.push(url);
  };

  const onGoogleResponse = (response: GoogleLoginResponse | GoogleLoginResponseOffline) => {
    const res = response as GoogleLoginResponse;
    setGoogleToken(res.tokenObj.id_token);
  };

  const onGoogleResponseFail = (response: GoogleLoginResponse | GoogleLoginResponseOffline) => {
    setGoogleErrors({ _tokenInvalid: true });
  };

  useEffect(() => {
    if (googleToken !== '') {
      let loginInfo: GoogleAuthResponse;
      googleLoginUser()
        .then(d => {
          const data = d.data.googleLogin;

          if (data.__typename === 'GoogleLoginResponse') {
            setGoogleLoginSuccessful(true);
            const { user, token } = data;
            loginInfo = { user, token };
          }
          if (data.__typename === 'GoogleLoginErrors') {
            setGoogleErrors({ _tokenInvalid: true });
          }
        })
        .catch(e => {
          setGoogleErrors({ _tokenInvalid: true });
        })
        .finally(() => {
          setIsFetching(false);
          if (loginInfo) {
            const { user, token } = loginInfo;
            dispatch(login({ user, token }));
            history.push('/');
          }
          console.log(loginInfo);
        });
    }
  }, [googleToken]);

  return {
    isFetching,
    setIsFetching,
    onGoogleResponse,
    onGoogleResponseFail,
    googleErrors,
    googleLoginSuccessful
  };
};

export default useGoogleAuth;
