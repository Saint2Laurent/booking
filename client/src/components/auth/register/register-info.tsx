import React, { RefObject, useEffect, useRef, useState } from 'react';
import style from '../auth.module.scss';
import { Form, Input, Button, Row, Col } from 'antd';
import '@ant-design/compatible/assets/index.css';
import {
  factorFormValidationInfo,
  RegisterFormValidationInfo,
  validateRegistrationInput
} from '../../../../../shared/validators/auth/common-auth-validator';
import ReCAPTCHA from 'react-google-recaptcha';
import { isEmpty } from '../../../../../shared/utils/is-empty';
import { useMailValidator } from '../../../hooks/use-mail-validators';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { CheckOutlined } from '@ant-design/icons';
import { RegistrationErrors } from '../../../../../shared/types/api/auth/register';
import { useNotification } from '../../../hooks/use-notification';
import useGoogleAuth from '../../../hooks/use-google-auth';
import GoogleButton from '../login/google-button';
import { login } from '../../../store/authSlice';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { LoginResponse } from '../../../../../shared/types/api/auth/login';

interface RegisterInfoProps {
  mail: string;
  initView: boolean;
}

const RegisterInfo: React.FC<RegisterInfoProps> = ({ mail, initView }: RegisterInfoProps) => {
  const recaptchaRef: RefObject<ReCAPTCHA> = React.createRef<ReCAPTCHA>();
  const [form] = Form.useForm();
  const fullNameRef: any = useRef();
  const dispatch = useDispatch();
  const [registerSuccessful, setRegisterSuccessful] = useState(false);
  const history = useHistory();

  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<RegistrationErrors>({});
  const notifyResponseError = useNotification();
  const {
    isFetching,
    setIsFetching,
    onGoogleResponse,
    onGoogleResponseFail,
    googleErrors,
    googleLoginSuccessful
  } = useGoogleAuth();

  const [formValidationInfo, setFormValidationInfo] = useState<RegisterFormValidationInfo>({
    mail: {
      status: '',
      message: ''
    },
    fullName: {
      status: '',
      message: ''
    },
    password: {
      status: '',
      message: ''
    }
  });

  const [setEmail, email] = useMailValidator(errors, setErrors);

  const REGISTER_USER = gql`
     mutation {
      registerUser(
        mail: "${email}"
        fullName: "${fullName}"
        password: "${password}"
      ) {
        ... on RegistrationResponse {
          success
          loginResponse {
            user {
              id
              mail
              fullName
              isConfirmed
              role
              isGoogle
              googleId
            }
            token
          }
        }
        ... on RegistrationErrors {
          mailInvalid
          fullNameInvalid
          passwordInadequate
          _mailExists
          _passwordWeak
        }
      }
    }

`;

  const [registerUser, { data, loading }] = useMutation(REGISTER_USER, { fetchPolicy: 'no-cache' });

  const register = () => {
    registerUser()
      .then(d => {
        const data = d.data;
        if (data.registerUser.__typename === 'RegistrationResponse' && data.registerUser.success) {
          setRegisterSuccessful(true);
          const { user, token }: LoginResponse = data.registerUser.loginResponse;
          dispatch(login({ user, token }));
          history.push('/');
        }
        if (data.registerUser.__typename === 'RegistrationErrors') {
          setFormValidationInfo(factorFormValidationInfo(form, { ...data.registerUser }));
        }
      })
      .catch(e => {
        notifyResponseError();
      });
  };

  useEffect(() => {
    if (initView) {
      form.setFieldsValue({ mail });
      setEmail(mail);
      if (!isEmpty(mail)) {
        fullNameRef.current.focus();
      }
    }
  }, [mail]);

  useEffect(() => {
    setFormValidationInfo(factorFormValidationInfo(form, errors));
  }, [errors]);

  useEffect(() => {
    let errors: RegistrationErrors = {};
    if (errors._mailExists !== undefined) {
      errors._mailExists = errors._mailExists;
    }
    setErrors({ ...errors, ...validateRegistrationInput(email, fullName, password) });
  }, [email, password, fullName]);

  const disableRegistration = () => {
    return Object.keys(errors).length !== 0 || registerSuccessful;
  };

  return (
    <Col span={24} className={'text-left p-1 mt-4'}>
      <Form form={form} onSubmitCapture={register}>
        <Row>
          <Col span={24}>
            <Form.Item
              className={'p-0 mb-2'}
              name="mail"
              hasFeedback
              htmlFor={'email'}
              validateStatus={formValidationInfo.mail.status}
              extra={formValidationInfo.mail.message}
            >
              <Input onChange={() => setEmail(form.getFieldValue('mail'))} placeholder="Λογαριασμός email" />
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <Form.Item
              className={'p-0 mb-2'}
              name="fullName"
              hasFeedback
              validateStatus={formValidationInfo.fullName.status}
              extra={formValidationInfo.fullName.message}
            >
              <Input
                ref={fullNameRef}
                onChange={() => setFullName(form.getFieldValue('fullName'))}
                placeholder="Πλήρες όνομα"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <span>Κωδικος:</span>
            <Form.Item
              className={'auth-password-input'}
              name={'password'}
              hasFeedback
              validateStatus={formValidationInfo.password.status}
              extra={formValidationInfo.password.message}
            >
              <Input.Password onChange={() => setPassword(form.getFieldValue('password'))} />
            </Form.Item>
          </Col>
        </Row>

        <Row className="mt-5">
          <Button
            loading={loading}
            htmlType={'submit'}
            disabled={disableRegistration()}
            block
            className={`${style.inputButton} auth-disabled`}
            icon={registerSuccessful && <CheckOutlined />}
            type={'primary'}
          >
            {!registerSuccessful ? <span>Σύνεχεια</span> : <span className="pulse">Εγγραφή επιτυχής</span>}
          </Button>
        </Row>

        <Row className={'text-center'}>
          <Col span={24}>
            <span>Ή</span>
          </Col>
        </Row>

        <GoogleButton
          isFetching={isFetching}
          googleLoginSuccessful={googleLoginSuccessful}
          setIsFetching={setIsFetching}
          onGoogleResponse={onGoogleResponse}
          onGoogleResponseFail={onGoogleResponseFail}
          googleErrors={googleErrors}
        />

        <Row className={'mt-4 text-smaller text-center'}>
          <Col span={24}>
            <hr />
            <div className="mt-2">
              Έχετε ηδη λογαριασμό; <span className={'light-sky-blue'}>Σύνδεθειτέ</span>
            </div>
          </Col>
        </Row>

        <ReCAPTCHA ref={recaptchaRef} size="invisible" sitekey="6LfulNMUAAAAAEBEZb336ALlHtTRRO5a85Trf9n_" />
      </Form>
    </Col>
  );
};

export default RegisterInfo;
