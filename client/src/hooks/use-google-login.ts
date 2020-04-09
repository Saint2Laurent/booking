import React, { useEffect, useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';
import { GoogleLoginErrors } from '../../../server/src/modules/auth/login/google/google-login.types';

const useGoogleLogin = () => {
  const [googleToken, setGoogleToken] = useState('');

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

  const onGoogleResponse = (response: GoogleLoginResponse | GoogleLoginResponseOffline) => {
    const res = response as GoogleLoginResponse;
    setGoogleToken(res.tokenObj.id_token);
  };

  const onGoogleResponseFail = (response: GoogleLoginResponse | GoogleLoginResponseOffline) => {
    setGoogleErrors({ _tokenInvalid: true });
  };

  useEffect(() => {
    if (googleToken !== '') {
      googleLoginUser()
        .then(d => {
          const data = d.data.googleLogin;

          if (data.__typename === 'GoogleLoginResponse') {
            console.log(data);
            setGoogleLoginSuccessful(true);
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

export default useGoogleLogin;
