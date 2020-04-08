import React, { useEffect, useState } from 'react';
import style from '../auth.module.scss';
import { Button, Col, Form, Input, Row } from 'antd';
import AuthHeader from '../auth-header';
import { CheckOutlined } from '@ant-design/icons';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { useParams } from 'react-router-dom';
import {
  FormValidationInfoField,
  isPasswordAdequate
} from '../../../../../shared/validators/auth/common-auth-validator';
import { PasswordResetErrors } from '../../../../../shared/types/api/auth/password-reset';

interface PasswordResetFormErrors {
  password: FormValidationInfoField;
  passwordConfirmation: FormValidationInfoField;
}

const ForgotPasswordReset = () => {
  const [form] = Form.useForm();
  const params: any = useParams();
  const [requestSuccessful, setRequestSuccessful] = useState(false);
  const [passwordResetErrors, setPasswordResetErrors] = useState<PasswordResetErrors>({});
  const [passwordResetFormErrors, setPasswordResetFormErrors] = useState<PasswordResetFormErrors>({
    password: { status: '', message: '' },
    passwordConfirmation: { status: '', message: '' }
  });
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    setToken(params.tokenId);
  }, []);

  const PASSWORD_RESET = gql`
    mutation {
      passwordReset(token: "${token}", password: "${password}") {
        ... on PasswordResetResponse {
          success
        }
        ... on PasswordResetErrors {
          passwordInvalid
          _passwordWeak
          _tokenInvalid
        }
      }
    }
  `;

  const validatePasswordReset = () => {
    if (!isPasswordAdequate(password)) {
      console.log(password);
      setPasswordResetErrors({ passwordInvalid: true });
    } else if (password !== passwordConfirmation) {
      setPasswordResetErrors({ passwordsDoNotMatch: true });
    } else {
      setPasswordResetErrors({});
    }
  };

  const updatePasswordResetFormErrors = () => {
    const errors: PasswordResetFormErrors = {
      password: { status: '', message: '' },
      passwordConfirmation: { status: '', message: '' }
    };

    if (form.isFieldTouched('password')) {
      if (passwordResetErrors.passwordInvalid) {
        errors.password = { status: 'warning', message: 'Ο κωδικος δεν εχει αρκετα ψηφια' };
      } else if (passwordResetErrors._passwordWeak) {
        errors.password = { status: 'warning', message: 'Ο κωδικος δεν ειναι αρκετα δυνατος' };
      } else {
        errors.password = { status: 'success', message: '' };
      }
    }

    if (form.isFieldTouched('passwordConfirmation')) {
      if (passwordResetErrors.passwordsDoNotMatch) {
        errors.passwordConfirmation = { status: 'warning', message: 'Οι κωδικοι πρεπει να τεριαζουν' };
      } else {
        if (!(passwordResetErrors.passwordInvalid || passwordResetErrors._passwordWeak)) {
          errors.passwordConfirmation = { status: 'success', message: '' };
        }
      }
    }

    setPasswordResetFormErrors(errors);
  };

  useEffect(() => {
    console.log(passwordResetErrors);
    updatePasswordResetFormErrors();
  }, [passwordResetErrors]);

  useEffect(() => {
    validatePasswordReset();
  }, [password, passwordConfirmation]);

  const [passwordReset, { data, loading }] = useMutation(PASSWORD_RESET, { fetchPolicy: 'no-cache' });
  const onPasswordChange = () => {
    setPassword(form.getFieldValue('password'));
  };

  const onPasswordConfirmationChange = () => {
    setPasswordConfirmation(form.getFieldValue('passwordConfirmation'));
  };

  const finished = () => {
    passwordReset()
      .then(d => {
        const data = d.data.passwordReset;
        console.log(data);
        if (data.__typename === 'PasswordResetResponse' && data.success) {
          setRequestSuccessful(true);
        }
        if (data.__typename === 'PasswordResetErrors') {
          setPasswordResetErrors(data);
        }
      })
      .catch(e => {});
  };

  return (
    <Row className={style.container}>
      <Col span={24} className={'text-center'}>
        <AuthHeader targetLocation={'login'} />
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
                <h1 className={style.headingTitle2}>Αλλαγη κωδικου </h1>
              </Col>
            </Row>
            <div className={style.slideContainer}>
              <Col span={24} className={'mr-1 mt-4 text-left'}>
                {!passwordResetErrors._tokenInvalid && (
                  <Form form={form} onFinish={finished}>
                    <Row>
                      <Col span={24}>
                        <Form.Item
                          hasFeedback
                          validateStatus={passwordResetFormErrors.password.status}
                          extra={passwordResetFormErrors.password.message}
                          name="password"
                        >
                          <Input.Password onChange={onPasswordChange} placeholder="Νεος κωδικος" />
                        </Form.Item>
                        <Form.Item
                          hasFeedback
                          validateStatus={passwordResetFormErrors.passwordConfirmation.status}
                          extra={passwordResetFormErrors.passwordConfirmation.message}
                          name="passwordConfirmation"
                        >
                          <Input.Password onChange={onPasswordConfirmationChange} placeholder="Επαληθευση κωδικου" />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row className="mt-4 pt-4 pb-3">
                      <Button
                        icon={requestSuccessful && <CheckOutlined />}
                        disabled={Object.keys(passwordResetErrors).length !== 0 || requestSuccessful}
                        loading={loading}
                        htmlType={'submit'}
                        block
                        className={`${style.inputButton} auth-disabled`}
                        type={'primary'}
                      >
                        {!requestSuccessful ? <span>Αλλαγη κωδικου</span> : <span>Αλλαγη κωδικου επιτυχης</span>}
                      </Button>
                    </Row>
                  </Form>
                )}
                {passwordResetErrors._tokenInvalid && (
                  <div className="pb-3">
                    Αυτος ο συνδεσμος επαναφορας κωδικου εχει ληξει, ελενξτε το email σας για νεοτερο συνδεσμο.
                  </div>
                )}
              </Col>
            </div>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default ForgotPasswordReset;
