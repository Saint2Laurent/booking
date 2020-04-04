import React, { useEffect, useRef, useState } from 'react';
import '../../../styles/global.scss';
import style from '../auth.module.scss';
import '@ant-design/compatible/assets/index.css';
import googleIcon from '../../../assets/images/icon-google.svg';
import { Form, Input, Button, Row, Col } from 'antd';
import { isMailValid } from '../../../../../shared/validators/account-validator';
import GoogleLogin from 'react-google-login';
import { useMailValidator } from '../../../hooks/use-mail-validators';

interface RegisterEmailProps {
  swapView(): any;
  setMail(email: string): any;
}

export const RegisterEmail: React.FC<RegisterEmailProps> = ({ swapView, setMail }: RegisterEmailProps) => {
  const [form] = Form.useForm();
  const [validationResponse, setEmail] = useMailValidator();
  const googleButtonRef: any = useRef();

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

  const responseGoogle = (r: any) => {};

  return (
    <Col span={24} className={'mr-1 mt-4 text-left'}>
      <Form form={form} onFinish={finished}>
        <Row>
          <Col span={24}>
            <Form.Item
              name="mail"
              hasFeedback
              validateStatus={validationResponse.formValidationStatus}
              help={validationResponse.errorMessage}
            >
              <Input onChange={onMailChange} placeholder="Λογαριασμός email" />
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
            disabled={!validationResponse.isValid}
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
        <Row>
          <GoogleLogin
            clientId="315458143733-80m56pstigk1t5q22i3fdrpa0jbvd570.apps.googleusercontent.com"
            render={renderProps => (
              <Button
                id={'registerEmailGButton'}
                ref={googleButtonRef}
                block
                className={style.inputButton}
                onClick={renderProps.onClick}
              >
                <img className={style.buttonIcon} src={googleIcon} alt="" />
                <span className="ml-1">Σύνεχεια με Google</span>
              </Button>
            )}
            buttonText="Login"
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            cookiePolicy={'single_host_origin'}
          />
        </Row>
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
