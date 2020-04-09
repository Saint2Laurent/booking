import React, { useEffect, useRef, useState } from 'react';
import '../../../styles/global.scss';
import style from '../auth.module.scss';
import '@ant-design/compatible/assets/index.css';
import googleIcon from '../../../assets/images/icon-google.svg';
import { Form, Input, Button, Row, Col } from 'antd';
import GoogleLogin from 'react-google-login';
import { useMailValidator } from '../../../hooks/use-mail-validators';
import { FormValidationInfoField, isMailValid } from '../../../../../shared/validators/auth/common-auth-validator';
import useGoogleAuth from '../../../hooks/use-google-auth';
import { Wave } from 'react-animated-text';
import { GoogleLoginErrors } from '../../../../../shared/types/api/auth/login';
import GoogleButton from '../login/google-button';

interface RegisterEmailProps {
  swapView(): any;
  setMail(email: string): any;
}

interface RegisterEmailViewErrors {
  mailInvalid?: boolean;
  _mailExists?: boolean;
}

export const RegisterEmail: React.FC<RegisterEmailProps> = ({ swapView, setMail }: RegisterEmailProps) => {
  const [form] = Form.useForm();
  const googleButtonRef: any = useRef();
  const [registrationErrors, setRegistrationErrors] = useState<RegisterEmailViewErrors & GoogleLoginErrors>({});
  const [setEmail, email] = useMailValidator(registrationErrors, setRegistrationErrors);
  const [formValidationInfo, setFormValidationInfo] = useState<FormValidationInfoField>({ status: '', message: '' });
  const {
    isFetching,
    setIsFetching,
    onGoogleResponse,
    onGoogleResponseFail,
    googleErrors,
    googleLoginSuccessful
  } = useGoogleAuth();

  const blockTabOnGoogleButton = (e: any) => {
    if (e.key === 'Tab') {
      if ((document.activeElement as any).id === 'registerEmailGButton') {
        e.preventDefault();
      }
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', blockTabOnGoogleButton);
  }, []);

  const finished = () => {
    setMail(form.getFieldValue('mail'));
    swapView();
  };

  const onMailChange = () => {
    setEmail(form.getFieldValue('mail'));
  };

  useEffect(() => {
    if (form.isFieldTouched('mail')) {
      if (registrationErrors._mailExists) {
        setFormValidationInfo({ status: 'warning', message: 'Το email υπαρχει ηδη' });
      } else if (registrationErrors.mailInvalid) {
        setFormValidationInfo({ status: 'warning', message: 'Το email δεν ειναι σωστο' });
      } else {
        setFormValidationInfo({ status: 'success', message: '' });
      }
    }
  }, [registrationErrors]);

  useEffect(() => {
    if (!isMailValid(email)) {
      setRegistrationErrors({ mailInvalid: true });
    } else {
      setRegistrationErrors({});
    }
  }, [email]);

  useEffect(() => {
    setRegistrationErrors(googleErrors);
  }, [googleErrors]);

  return (
    <Col span={24} className={'mr-1 mt-4 text-left'}>
      <Form form={form} onFinish={finished}>
        <Row>
          <Col span={24}>
            <Form.Item
              name="mail"
              hasFeedback
              validateStatus={formValidationInfo.status}
              extra={formValidationInfo.message}
            >
              <Input onChange={onMailChange} autoFocus placeholder="Λογαριασμός email" />
            </Form.Item>
          </Col>
        </Row>
        <Row className={'pb-5'}>
          <p className="small-text">
            Με την εγγραφή σας, επιβεβαιονετε οτι έχετε διαβάσει και αποδέχεσθαι τους{' '}
            <span className="light-sky-blue">Όρους</span> και την{' '}
            <span className="light-sky-blue">Πολιτική Αποριτού</span>.
          </p>
        </Row>
        <Row className="mt-5">
          <Button
            htmlType={'submit'}
            block
            className={`${style.inputButton} auth-disabled`}
            disabled={Object.keys(registrationErrors).length !== 0}
            type={'primary'}
          >
            Σύνεχεια
          </Button>
        </Row>
        <Row>
          <Col span={24} className={'text-center'}>
            Ή
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
        <Row className={'mt-5 text-smaller text-center'}>
          <Col span={24}>
            <hr />
            <div className="mt-2">
              Έχετε ηδη λογαριασμό; <span className={'light-sky-blue'}>Σύνδεθειτέ</span>
            </div>
          </Col>
        </Row>
      </Form>
    </Col>
  );
};

export default RegisterEmail;
