import { useEffect, useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';
import { GoogleLoginResponse as GoogleAuthResponse, LoginResponse } from '../../../shared/types/api/auth/login';
import { GoogleLoginErrors } from '../../../server/src/modules/auth/login/google/google-login.types';
import { login } from '../store/authSlice';
import { useDispatch } from 'react-redux';

const useGoogleAuth = () => {
  const [googleToken, setGoogleToken] = useState('');
  const dispatch = useDispatch();

  const GOOGLE_LOGIN_USER = gql`
    mutation {
      googleLogin(token: "${googleToken}") {
        ... on GoogleLoginResponse {
          user {
            id
            mail
            fullName
            isConfirmed
            role
            isGoogle
            googleId
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
  const [errors, setErrors] = useState<GoogleLoginErrors>({});

  const onGoogleResponse = (response: GoogleLoginResponse | GoogleLoginResponseOffline) => {
    const res = response as GoogleLoginResponse;
    setGoogleToken(res.tokenObj.id_token);
  };

  const onGoogleResponseFail = () => {
    setErrors({ _tokenInvalid: true });
  };

  useEffect(() => {
    if (googleToken !== '') {
      let loginInfo: GoogleAuthResponse;
      googleLoginUser()
        .then(d => {
          const data = d.data.googleLogin;
          if (data.__typename === 'GoogleLoginResponse') {
            setGoogleLoginSuccessful(true);
            console.log(data);
            const { user, token } = data;
            loginInfo = { user, token };
          }
          if (data.__typename === 'GoogleLoginErrors') {
            setErrors({ _tokenInvalid: true });
          }
        })
        .catch(e => {
          console.log(e);
          setErrors({ _tokenInvalid: true });
        })
        .finally(() => {
          setIsFetching(false);
          if (loginInfo) {
            const { user, token }: LoginResponse = loginInfo;
            dispatch(login({ user, token }));
          }
        });
    }
  }, [googleToken]);

  return {
    isFetching,
    setIsFetching,
    onGoogleResponse,
    onGoogleResponseFail,
    googleErrors: errors,
    googleLoginSuccessful
  };
};

export default useGoogleAuth;
