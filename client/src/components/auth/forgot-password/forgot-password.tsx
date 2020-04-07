import React, { useEffect, useState } from 'react';
import style from '../auth.module.scss';
import { Button, Col, Form, Input, Row } from 'antd';
import AuthHeader from '../auth-header';
import { useMailValidator } from '../../../hooks/use-mail-validators';
import { ForgotPasswordErrors } from '../../../../../shared/types/api/auth/auth-responses';
import { FormValidationInfoField, isMailValid } from '../../../../../shared/validators/auth/common-auth-validator';
import { CheckOutlined } from '@ant-design/icons';

const ForgotPassword = () => {
  const [form] = Form.useForm();
  const [forgotPasswordErrors, setForgotPasswordErrors] = useState<ForgotPasswordErrors>({});
  const [formErrors, setFormErrors] = useState<FormValidationInfoField>({ status: '', message: '' });
  const [setEmail, email, isRegistered] = useMailValidator();
  const [requestSuccessful, setRequestSuccessful] = useState(false);

  const finished = () => {};

  const factorFormValidationInfo = () => {
    let formFieldErrors: FormValidationInfoField = { status: '', message: '' };

    if (form.isFieldTouched('mail')) {
      if (forgotPasswordErrors.mailInvalid) {
        formFieldErrors = { status: 'warning', message: 'Το email δεν ειναι εγγυρο' };
      } else if (forgotPasswordErrors._mailNotRegistered) {
        formFieldErrors = { status: 'warning', message: 'Το email δεν ειναι εγγεγραμενο' };
      } else {
        formFieldErrors = { status: 'success', message: '' };
      }
    }
    setFormErrors(formFieldErrors);
  };

  useEffect(() => {
    factorFormValidationInfo();
  }, [forgotPasswordErrors]);

  useEffect(() => {
    if (!isMailValid(email)) {
      setForgotPasswordErrors({ mailInvalid: true });
    }
  }, [email]);

  useEffect(() => {
    console.log(isRegistered);
    if (!isRegistered) {
      setForgotPasswordErrors({ ...forgotPasswordErrors, _mailNotRegistered: true });
    } else {
      setFormErrors({ status: 'success', message: '' });
    }
  }, [isRegistered]);

  const onMailChange = () => {
    setEmail(form.getFieldValue('mail'));
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
                <h1 className={style.headingTitle2}>Ανακτηση λογαριασμου </h1>
              </Col>
            </Row>
            <div className={style.slideContainer}>
              <Col span={24} className={'mr-1 mt-4 text-left'}>
                <Form form={form} onFinish={finished}>
                  <Row>
                    <Col span={24}>
                      <Form.Item hasFeedback help={formErrors.message} validateStatus={formErrors.status} name="mail">
                        <Input onChange={onMailChange} placeholder="Λογαριασμός email" />
                      </Form.Item>
                      <Row className="mt-4 pt-4 pb-3">
                        <Button
                          icon={requestSuccessful && <CheckOutlined />}
                          disabled={Object.keys(forgotPasswordErrors).length !== 0 || requestSuccessful}
                          // loading={loading}
                          htmlType={'submit'}
                          block
                          className={`${style.inputButton} auth-disabled`}
                          type={'primary'}
                        >
                          Αποστολή Email
                        </Button>
                      </Row>
                    </Col>
                  </Row>
                </Form>
              </Col>
            </div>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default ForgotPassword;
