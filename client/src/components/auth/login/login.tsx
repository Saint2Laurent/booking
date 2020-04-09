import React, { RefObject, useEffect, useState } from 'react';
import style from '../auth.module.scss';
import '@ant-design/compatible/assets/index.css';
import { Row, Col, Input, Form, Button } from 'antd';
import GoogleLogin, { GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';
import googleIcon from '../../../assets/images/icon-google.svg';
import { useForm } from 'antd/es/form/util';
import AuthHeader from '../auth-header';
import { useDispatch } from 'react-redux';
import { login } from '../../../store/authSlice';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';
import { Wave } from 'react-animated-text';
import { CheckOutlined } from '@ant-design/icons';
import gql from 'graphql-tag';
import {
  FormValidationInfoField,
  isMailValid,
  isPasswordAdequate
} from '../../../../../shared/validators/auth/common-auth-validator';
import ReCAPTCHA from 'react-google-recaptcha';
import { LoginErrors } from '../../../../../server/src/modules/auth/login/tranditional/login.types';
import useNotification from '../../../hooks/use-notification';
import { GoogleLoginErrors } from '../../../../../server/src/modules/auth/login/google/google-login.types';
import useGoogleLogin from '../../../hooks/use-google-login';
import GoogleButton from './google-button';
import RedirectSuccessful from './redirect-successful';

interface LoginFormErrors {
  mail: FormValidationInfoField;
  password: FormValidationInfoField;
}

const Login = () => {
  const [form] = useForm();
  const recaptchaRef: RefObject<ReCAPTCHA> = React.createRef<ReCAPTCHA>();
  const dispatch = useDispatch();
  const history = useHistory();
  const [password, setPassword] = useState('');
  const [mail, setMail] = useState('');
  const [loginErrors, setLoginErrors] = useState<LoginErrors & GoogleLoginErrors>({});
  const notifyResponseError = useNotification();
  const {
    isFetching,
    setIsFetching,
    onGoogleResponse,
    onGoogleResponseFail,
    googleErrors,
    googleLoginSuccessful
  } = useGoogleLogin();

  const [loginFormErrors, setLoginFormErrors] = useState<LoginFormErrors>({
    mail: { status: '', message: '' },
    password: { status: '', message: '' }
  });
  const [loginSuccessful, setLoginSuccessful] = useState(false);

  const LOGIN_USER = gql`
    mutation{
      loginUser(mail: "${mail}", password: "${password}"){
        ... on LoginResponse{
          token
          user{
            id
            mail
            fullName
            isConfirmed
            role
            isGoogle
            googleId
          }
        }
        ... on LoginErrors{
          mailInvalid
          _isGoogle
          _notRegistered
          _passwordInvalid
        }
      }
    }
  `;

  const [loginUser, { data, loading }] = useMutation(LOGIN_USER, { fetchPolicy: 'no-cache' });

  const finished = () => {
    loginUser()
      .then(d => {
        const data = d.data.loginUser;
        if (data.__typename === 'LoginErrors') {
          setLoginErrors(data);
        }
        if (data.__typename === 'LoginResponse') {
          console.log(data);
          setLoginSuccessful(true);
          const { user, token } = data;
          dispatch(login({ user, token }));
        }
      })
      .catch(e => {
        console.log(e);
        notifyResponseError();
      });
  };

  useEffect(() => {
    setLoginErrors(googleErrors);
  }, [googleErrors]);

  const validateLogin = () => {
    if (!isMailValid(mail)) {
      setLoginErrors({ mailInvalid: true });
    } else if (!isPasswordAdequate(password)) {
      setLoginErrors({ _passwordInvalid: true });
    } else {
      setLoginErrors({});
    }
  };

  const factorFormValidationInfo = () => {
    const errors: LoginFormErrors = {
      mail: { status: '', message: '' },
      password: { status: '', message: '' }
    };

    if (form.isFieldTouched('mail')) {
      if (loginErrors.mailInvalid) {
        errors.mail = { status: 'warning', message: 'Το email δεν ειναι εγγυρο' };
      } else if (loginErrors._notRegistered) {
        errors.mail = { status: 'warning', message: 'Το email δεν ειναι εγγεγραμμενο' };
      } else if (loginErrors._isGoogle) {
        errors.mail = {
          status: 'warning',
          message: 'Ο λογαριασμος ειναι εγγεγραμμενος μεσω Google, εισελθετε απο την επιλογη "Συνεχεια με Google"'
        };
      } else {
        errors.mail = { status: 'success', message: '' };
      }
    }

    if (form.isFieldTouched('password')) {
      if (loginErrors._passwordInvalid) {
        errors.password = { status: 'warning', message: 'Ο κωδικος δεν ειναι σωστος' };
      }
    }

    setLoginFormErrors(errors);
  };

  useEffect(() => {
    factorFormValidationInfo();
  }, [loginErrors]);

  useEffect(() => {
    validateLogin();
  }, [mail, password]);

  const onMailChange = () => {
    setMail(form.getFieldValue('mail'));
  };

  const onPasswordChange = () => {
    setPassword(form.getFieldValue('password'));
  };

  return (
    <Row className={style.container}>
      <Col span={24} className={'text-center'}>
        <AuthHeader targetLocation={'register'} />
        <Row>
          <Col
            className={style.authForm}
            xs={{ span: 20, offset: 2 }}
            md={{ span: 8, offset: 8 }}
            xl={{ span: 6, offset: 9 }}
            xxl={{ span: 4, offset: 10 }}
          >
            <Row className="text-center">
              <Col span={24}>
                <h1 className={`${style.headingTitle}`}>Είσοδος χρήστη</h1>
              </Col>
            </Row>
            <div className={style.loginContainer}>
              <Col span={24} className={'mr-1 mt-2 text-left'}>
                <Form form={form} onSubmitCapture={finished}>
                  <Row>
                    <Col span={24}>
                      <Form.Item
                        htmlFor={'email'}
                        name="mail"
                        hasFeedback
                        validateStatus={loginFormErrors.mail.status}
                        extra={loginFormErrors.mail.message}
                        className={style.authFormItem}
                      >
                        <Input onChange={onMailChange} autoFocus placeholder="Το email σας" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={24}>
                      <Form.Item
                        name="password"
                        htmlFor={'password'}
                        hasFeedback
                        validateStatus={loginFormErrors.password.status}
                        extra={loginFormErrors.password.message}
                        className={'p-0 m-0'}
                      >
                        <Input.Password onChange={onPasswordChange} placeholder="Κώδικος" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={24} className={'text-right pt-1 pb-4'}>
                      <a
                        className={style.forgotPasswordLink}
                        onClick={() => {
                          history.push('/auth/reset-password');
                        }}
                      >
                        Ξεχασα τον κωδικο μου
                      </a>
                    </Col>
                  </Row>

                  <Row className="mt-5">
                    <Button
                      icon={loginSuccessful && <CheckOutlined />}
                      disabled={Object.keys(loginErrors).length !== 0 || loginSuccessful}
                      loading={loading}
                      htmlType={'submit'}
                      block
                      className={`${style.inputButton} auth-disabled`}
                      type={'primary'}
                    >
                      Είσοδος
                    </Button>
                  </Row>
                  {!loginSuccessful && (
                    <Row>
                      <Col span={24} className={'text-center d-flex'}>
                        <span>Ή</span>
                      </Col>
                    </Row>
                  )}
                  {!loginSuccessful && (
                    <GoogleButton
                      isFetching={isFetching}
                      googleLoginSuccessful={googleLoginSuccessful}
                      setIsFetching={setIsFetching}
                      onGoogleResponse={onGoogleResponse}
                      onGoogleResponseFail={onGoogleResponseFail}
                    />
                  )}
                  {googleErrors._tokenInvalid && (
                    <div>
                      <span className={'small-text reduced-spacing color-warning pt-2'}>
                        Υπηρξε καποιο προβλημα κατα την εισοδο μεσω Google. Προσπαθηστε εκ νεου.
                      </span>
                    </div>
                  )}

                  {loginSuccessful && <RedirectSuccessful />}
                  <Row className={'mt-2 text-smaller text-center'}>
                    <Col span={24} className="mt-4">
                      <hr />
                      <div className="mt-2">
                        Δέν έχετε λογαριασμό; <span className={'light-sky-blue'}>Εγγραφείτε</span>
                      </div>
                    </Col>
                  </Row>
                  <ReCAPTCHA ref={recaptchaRef} size="invisible" sitekey="6LfulNMUAAAAAEBEZb336ALlHtTRRO5a85Trf9n_" />
                </Form>
              </Col>
            </div>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default Login;
