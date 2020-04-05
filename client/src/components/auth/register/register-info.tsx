import React, { MutableRefObject, RefObject, useEffect, useRef, useState } from 'react';
import style from '../auth.module.scss';
import { Form, Input, Button, Row, Col } from 'antd';
import '@ant-design/compatible/assets/index.css';
import googleIcon from '../../../assets/images/icon-google.svg';
import { PasswordInput } from 'antd-password-input-strength';
import { isFullNameValid, isPasswordValid, isAccountValid } from '../../../../../shared/validators/account-validator';
import ReCAPTCHA from 'react-google-recaptcha';
import { isEmpty } from '../../../../../shared/utils/is-empty';
import { useMailValidator } from '../../../hooks/use-mail-validators';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { CheckOutlined } from '@ant-design/icons';
import { Wave } from 'react-animated-text';

interface RegisterInfoProps {
  mail: string;
  initView: boolean;
}

const RegisterInfo: React.FC<RegisterInfoProps> = ({ mail, initView }: RegisterInfoProps) => {
  const recaptchaRef: RefObject<ReCAPTCHA> = React.createRef<ReCAPTCHA>();
  const [form] = Form.useForm();
  const fullNameRef: any = useRef();
  const [validationResponse, setEmail, email] = useMailValidator();
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');

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
          mailNeedsConfirmation
          passwordInvalid
          hashingFailed
          mailExists
          fullNameInvalid
        }
      }
    }
`;

  const [registerUser, { data, loading }] = useMutation(REGISTER_USER, { fetchPolicy: 'no-cache' });
  const [registerSuccessful, setRegisterSuccessful] = useState(false)

  useEffect(() => {}, []);

  const register = e => {
    registerUser()
      .then(d => {
        if(d.data.registerUser.__typename === 'RegistrationResponse' && d.data.registerUser.success){
            setRegisterSuccessful(true)
        }
        console.log(d);
      })
      .catch(e => {
        console.log(e);
      });
  };

  useEffect(() => {
    if (initView) {
      form.setFieldsValue({ mail });
      if (!isEmpty(mail)) {
        fullNameRef.current.focus();
      }
    }
  }, [mail]);

  const onMailChange = () => {
    console.log(form.getFieldValue('mail'));
    setEmail(form.getFieldValue('mail'));
  };

  const onPasswordChange = () => {
    setPassword(form.getFieldValue('password'));
  };

  const onFullNameChange = () => {
    setFullName(form.getFieldValue('fullName'));
  };

  return (
    <Col span={24} className={'text-left p-1 mt-4'}>
      <Form form={form} onSubmitCapture={register} >
        <Row>
          <Col span={24}>
            <Form.Item
              name="mail"
              hasFeedback
              validateStatus={form.isFieldTouched('mail') ? validationResponse.formValidationStatus : ''}
              extra={form.isFieldTouched('mail') ? validationResponse.errorMessage : ''}
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
              validateStatus={
                form.isFieldTouched('fullName')
                  ? isFullNameValid(form.getFieldValue('fullName')).formValidationStatus
                  : ''
              }
              extra={
                form.isFieldTouched('fullName') ? isFullNameValid(form.getFieldValue('fullName')).errorMessage : ''
              }
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
              validateStatus={
                form.isFieldTouched('password')
                  ? isPasswordValid(form.getFieldValue('password')).formValidationStatus
                  : ''
              }
              extra={
                form.isFieldTouched('password') ? isPasswordValid(form.getFieldValue('password')).errorMessage : ''
              }
            >
              <PasswordInput
                onChange={onPasswordChange}
                settings={{
                  height: 4,
                  alwaysVisible: true,
                  colorScheme: {
                    levels: [
                      '#ff4033',
                      '#fe9c63',
                      '#62ea1f',
                      '#59d41c',
                      '#52c41a'],
                    noLevel: 'lightgrey'
                  }
                }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row className="mt-5">
          <Button
            loading={loading}
            htmlType={'submit'}
            block
            className={`${style.inputButton} auth-disabled`}
              icon={registerSuccessful && <CheckOutlined />}
            disabled={
              !isAccountValid({
                mail: form.getFieldValue('mail'),
                password: form.getFieldValue('password'),
                fullName: form.getFieldValue('fullName')
              }) || registerSuccessful
            }
            type={'primary'}
          >
            {
              !registerSuccessful ? <span>Σύνεχεια</span> : <span className='pulse'>Εγγραφή επιτυχής</span>
            }
          </Button>
        </Row>

        <Row className={'text-center'}>
          <Col span={24}>
            {
              registerSuccessful ?
                  <div className={style.redirectedSoon}>
                    Εγγραφή επιτυχης! Ανακατευθηνση<Wave text="..." effect="verticalFadeIn" effectChange={.1} speed={2} />
                  </div>
                  :<span>Ή</span>

            }

          </Col>
        </Row>

        {
          !registerSuccessful &&
          <Row>
            <Button block className={style.inputButton}>
              <img className={style.buttonIcon} src={googleIcon} alt="" />
              <span className="ml-1">Σύνεχεια με Google</span>
            </Button>
          </Row>
        }

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
