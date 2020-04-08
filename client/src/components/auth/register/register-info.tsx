import React, { RefObject, useEffect, useRef, useState } from 'react';
import style from '../auth.module.scss';
import { Form, Input, Button, Row, Col } from 'antd';
import '@ant-design/compatible/assets/index.css';
import googleIcon from '../../../assets/images/icon-google.svg';
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
import { Wave } from 'react-animated-text';
import { RegistrationErrors } from '../../../../../shared/types/api/auth/register';
import { useNotification } from '../../../hooks/use-notification';

interface RegisterInfoProps {
  mail: string;
  initView: boolean;
}

const RegisterInfo: React.FC<RegisterInfoProps> = ({ mail, initView }: RegisterInfoProps) => {
  const recaptchaRef: RefObject<ReCAPTCHA> = React.createRef<ReCAPTCHA>();
  const [form] = Form.useForm();
  const fullNameRef: any = useRef();
  const [registerSuccessful, setRegisterSuccessful] = useState(false);
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [registrationErrors, setRegistrationErrors] = useState<RegistrationErrors>({});
  const notifyResponseError = useNotification();

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

  const [setEmail, email] = useMailValidator(registrationErrors, setRegistrationErrors);

  const REGISTER_USER = gql`
     mutation {
      registerUser(
        mail: "${email}"
        fullName: "${fullName}"
        password: "${password}"
      ) {
        ... on RegistrationResponse {
          success
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

  const register = e => {
    registerUser()
      .then(d => {
        if (d.data.registerUser.__typename === 'RegistrationResponse' && d.data.registerUser.success) {
          setRegisterSuccessful(true);
        }
        if (d.data.registerUser.__typename === 'RegistrationErrors') {
          setFormValidationInfo(factorFormValidationInfo(form, { ...d.data.registerUser }));
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

  const onMailChange = () => {
    setEmail(form.getFieldValue('mail'));
  };

  const onPasswordChange = () => {
    setPassword(form.getFieldValue('password'));
  };

  const onFullNameChange = () => {
    setFullName(form.getFieldValue('fullName'));
  };

  useEffect(() => {
    setFormValidationInfo(factorFormValidationInfo(form, registrationErrors));
  }, [registrationErrors]);

  useEffect(() => {
    let errors: RegistrationErrors = {};
    if (registrationErrors._mailExists !== undefined) {
      errors._mailExists = registrationErrors._mailExists;
    }
    setRegistrationErrors({ ...errors, ...validateRegistrationInput(email, fullName, password) });
  }, [email, password, fullName]);

  const disableRegistration = () => {
    return Object.keys(registrationErrors).length !== 0 || registerSuccessful;
  };

  return (
    <Col span={24} className={'text-left p-1 mt-4'}>
      <Form form={form} onSubmitCapture={register}>
        <Row>
          <Col span={24}>
            <Form.Item
              name="mail"
              hasFeedback
              validateStatus={formValidationInfo.mail.status}
              extra={formValidationInfo.mail.message}
            >
              <Input onChange={onMailChange} placeholder="Λογαριασμός email" />
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <Form.Item
              name="fullName"
              hasFeedback
              validateStatus={formValidationInfo.fullName.status}
              extra={formValidationInfo.fullName.message}
            >
              <Input ref={fullNameRef} onChange={onFullNameChange} placeholder="Πλήρες όνομα" />
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
              <Input.Password onChange={onPasswordChange} />
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
            {registerSuccessful ? (
              <div className={style.redirectedSoon}>
                Εγγραφή επιτυχης! Ανακατευθηνση
                <Wave text="..." effect="verticalFadeIn" effectChange={0.1} speed={2} />
              </div>
            ) : (
              <span>Ή</span>
            )}
          </Col>
        </Row>

        {!registerSuccessful && (
          <Row>
            <Button block className={style.inputButton}>
              <img className={style.buttonIcon} src={googleIcon} alt="" />
              <span className="ml-1">Σύνεχεια με Google</span>
            </Button>
          </Row>
        )}

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
