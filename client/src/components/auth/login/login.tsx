import React, { RefObject, useState } from 'react';
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
import { isEmpty } from '../../../../../shared/utils/is-empty';
import { Wave } from 'react-animated-text';
import { CheckOutlined } from '@ant-design/icons';
import gql from 'graphql-tag';
import { isMailValid, isPasswordAdequate } from '../../../../../shared/validators/auth/common-auth-validator';
import ReCAPTCHA from 'react-google-recaptcha';

const Login = () => {
  const [form] = useForm();
  const recaptchaRef: RefObject<ReCAPTCHA> = React.createRef<ReCAPTCHA>();
  const dispatch = useDispatch();
  const history = useHistory();
  const [isFetchingGoogle, setIsFetchingGoogle] = useState(false);
  const [password, setPassword] = useState('');
  const [mail, setMail] = useState('');
  const [mailError, setMailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
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
        resetErrors();
        const data = d.data;
        if (data.loginUser.__typename === 'LoginErrors') {
          if (data.loginUser._passwordInvalid) {
            setPasswordError('Ο κώδικος δεν είναι σωστός');
          }
          if (d.data.loginUser._notRegistered) {
            setMailError('Ο λογαριασμός δεν είναι εγγεγραμένος');
          }
        }
        console.log(d);
        if (data.loginUser.__typename === 'LoginResponse') {
          setLoginSuccessful(true);
          const { user, token } = data.loginUser;
          dispatch(login({ user, token }));
        }
      })
      .catch(e => {
        console.log(e);
      });
  };

  const responseGoogle = (response: GoogleLoginResponse | GoogleLoginResponseOffline) => {
    setIsFetchingGoogle(false);
  };
  const onMailChange = () => {
    setMail(form.getFieldValue('mail'));
  };

  const onPasswordChange = () => {
    setPassword(form.getFieldValue('password'));
  };

  const resetErrors = () => {
    setPasswordError('');
    setMailError('');
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
                        validateStatus={isEmpty(mailError) ? '' : 'warning'}
                        extra={isEmpty(mailError) ? '' : mailError}
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
                        hasFeedback
                        validateStatus={isEmpty(passwordError) ? '' : 'warning'}
                        extra={isEmpty(passwordError) ? '' : passwordError}
                      >
                        <Input.Password onChange={onPasswordChange} placeholder="Κώδικος" />
                        <Col span={24} className={'text-right pt-1'}>
                          <a
                            className={style.forgotPasswordLink}
                            onClick={() => {
                              history.push('/auth/forgot-password');
                            }}
                          >
                            Ξεχασα τον κωδικο μου
                          </a>
                        </Col>
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row className="mt-4">
                    <Button
                      icon={loginSuccessful && <CheckOutlined />}
                      disabled={!isMailValid(mail) || !isPasswordAdequate(password) || loginSuccessful}
                      loading={loading}
                      htmlType={'submit'}
                      block
                      className={`${style.inputButton} auth-disabled`}
                      type={'primary'}
                    >
                      Είσοδος
                    </Button>
                  </Row>
                  <Row>
                    <Col span={24} className={'text-center d-flex'}>
                      {!loginSuccessful ? (
                        <span>Ή</span>
                      ) : (
                        <div className={style.redirectedSoon}>
                          Είσοδος επιτυχης! Ανακατευθηνση
                          <Wave text="..." effect="verticalFadeIn" effectChange={0.1} speed={2} />
                        </div>
                      )}
                    </Col>
                  </Row>
                  {!loginSuccessful && (
                    <Row>
                      <GoogleLogin
                        clientId="315458143733-80m56pstigk1t5q22i3fdrpa0jbvd570.apps.googleusercontent.com"
                        render={renderProps => (
                          <Button
                            loading={isFetchingGoogle}
                            id={'registerEmailGButton'}
                            block
                            className={style.inputButton}
                            onClick={renderProps.onClick}
                          >
                            <img className={style.buttonIcon} src={googleIcon} alt="" />
                            <span className="ml-1">Σύνεχεια με Google</span>
                          </Button>
                        )}
                        buttonText="Είσοδος με Google"
                        onRequest={() => {
                          setIsFetchingGoogle(true);
                        }}
                        onSuccess={responseGoogle}
                        onFailure={responseGoogle}
                        cookiePolicy={'single_host_origin'}
                      />
                    </Row>
                  )}
                  <Row className={'mt-4 text-smaller text-center'}>
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
