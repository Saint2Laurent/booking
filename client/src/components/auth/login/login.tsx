import React, { RefObject, useEffect, useState } from 'react';
import style from '../auth.module.scss';
import '@ant-design/compatible/assets/index.css';
import { Row, Col, Input, Form, Button } from 'antd';
import AuthHeader from '../auth-header';
import { useDispatch } from 'react-redux';
import { login } from '../../../store/authSlice';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';
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
import useGoogleAuth from '../../../hooks/use-google-auth';
import GoogleButton from './google-button';
import { LoginResponse } from '../../../../../shared/types/api/auth/login';
import { factorFormValidationInfo, validateLogin } from './login.validate';
import { defaultFormValidationField } from '../../../misc/types';
import { useForm } from 'antd/lib/form/Form';

export interface LoginFormErrors {
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
  const [errors, setErrors] = useState<LoginErrors & GoogleLoginErrors>({});
  const notifyResponseError = useNotification();
  const {
    isFetching,
    setIsFetching,
    onGoogleResponse,
    onGoogleResponseFail,
    googleErrors,
    googleLoginSuccessful
  } = useGoogleAuth();

  const [formErrors, setFormErrors] = useState<LoginFormErrors>({
    mail: defaultFormValidationField,
    password: defaultFormValidationField
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
            profileImageUrl
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

  const [loginUser, { loading }] = useMutation(LOGIN_USER, { fetchPolicy: 'no-cache' });

  const finished = () => {
    loginUser()
      .then(r => {
        const data = r.data.loginUser;

        if (data.__typename === 'LoginErrors') {
          const errors: LoginErrors = data;
          setErrors(errors);
        }
        if (data.__typename === 'LoginResponse') {
          const { user, token }: LoginResponse = data;
          setLoginSuccessful(true);
          dispatch(login({ user, token }));
        }
      })
      .catch(e => {
        console.log(e);
        notifyResponseError();
      });
  };

  useEffect(() => {
    setErrors(googleErrors);
  }, [googleErrors]);

  useEffect(() => {
    factorFormValidationInfo(form, errors, setFormErrors);
  }, [errors]);

  useEffect(() => {
    validateLogin(mail, password, setErrors);
  }, [mail, password]);

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
                        validateStatus={formErrors.mail.status}
                        extra={formErrors.mail.message}
                        className={style.authFormItem}
                      >
                        <Input
                          onChange={() => setMail(form.getFieldValue('mail'))}
                          autoFocus
                          placeholder="Το email σας"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={24}>
                      <Form.Item
                        name="password"
                        htmlFor={'password'}
                        hasFeedback
                        validateStatus={formErrors.password.status}
                        extra={formErrors.password.message}
                        className={'p-0 m-0'}
                      >
                        <Input.Password
                          onChange={() => setPassword(form.getFieldValue('password'))}
                          placeholder="Κώδικος"
                        />
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
                      disabled={Object.keys(errors).length !== 0 || loginSuccessful}
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
                      googleErrors={googleErrors}
                    />
                  )}
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
