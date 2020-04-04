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

interface RegisterInfoProps {
  mail: string;
  initView: boolean;
}

const RegisterInfo: React.FC<RegisterInfoProps> = ({ mail, initView }: RegisterInfoProps) => {
  const recaptchaRef: RefObject<ReCAPTCHA> = React.createRef<ReCAPTCHA>();
  const [form] = Form.useForm();
  const fullNameRef: any = useRef();

  useEffect(() => {}, []);

  const finished = e => {
    console.log(e);
  };

  const [validationResponse, setEmail] = useMailValidator();
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (initView) {
      form.setFieldsValue({ mail });
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

  return (
    <Col span={24} className={'text-left p-1 mt-4'}>
      <Form form={form} onFinish={finished}>
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
                    levels: ['#ff4033', '#fe7439', '#59eb29', '#5df32b', '#67ff2f'],
                    noLevel: 'lightgrey'
                  }
                }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row className="mt-5">
          <Button
            loading
            htmlType={'submit'}
            block
            className={`${style.inputButton} auth-disabled`}
            disabled={
              !isAccountValid({
                mail: form.getFieldValue('mail'),
                password: form.getFieldValue('password'),
                fullName: form.getFieldValue('fullName')
              })
            }
            type={'primary'}
          >
            Σύνεχεια
          </Button>
        </Row>

        <Row className={'text-center'}>
          <Col span={24}>Ή</Col>
        </Row>

        <Row>
          <Button block className={style.inputButton}>
            <img className={style.buttonIcon} src={googleIcon} alt="" />
            <span className="ml-1">Σύνεχεια με Google</span>
          </Button>
        </Row>

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
