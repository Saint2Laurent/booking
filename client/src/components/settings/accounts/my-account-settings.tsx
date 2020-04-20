import React, { useEffect, useState } from 'react';
import style from '../settings.module.scss';
import { Form, Input, Row, Col, Button } from 'antd';
import { useForm } from 'antd/es/form/util';
import { selectAuth } from '../../../store/authSlice';
import { useSelector } from 'react-redux';

const MyAccountSettings = () => {
  const [form] = useForm();
  const [errors, setErrors] = useState();
  const [formErrors, setFormErrors] = useState();
  const [mail, setMail] = useState();
  const [fullName, setFullName] = useState();
  const [password, setPassword] = useState();
  const [passwordConfirmation, setPasswordConfirmation] = useState();

  const state = useSelector(selectAuth);

  useEffect(() => {
    console.log(state);
    const { mail, fullName } = state.auth.user;

    form.setFieldsValue({ mail, fullName, password: 'xxx-xxx-xxx' });
  }, []);

  useEffect(() => {
    // console.log(form.getFieldValue('password'));
  });

  return (
    <Col span={8} className={style.settingsInnerContainer}>
      <Col className={style.settingHeading}>Ο ΛΟΓΑΡΙΑΣΜΟΣ ΜΟΥ</Col>

      <Col className={style.settings}>
        <Form form={form}>
          <Row>
            <Col span={24}>
              <Form.Item
                name="mail"
                hasFeedback
                label={'Email χρήστη'}
                className={`d-block mb-3`}
                // validateStatus={loginFormErrors.mail.status}
                // extra={loginFormErrors.mail.message}
              >
                <Input onChange={() => setMail(form.getFieldValue('mail'))} />
              </Form.Item>
              <Form.Item
                name="fullName"
                hasFeedback
                label={'Πλήρες Όνομα'}
                className={`d-block`}
                // validateStatus={loginFormErrors.mail.status}
                // extra={loginFormErrors.mail.message}
              >
                <Input onChange={() => setFullName(form.getFieldValue('fullName'))} />
              </Form.Item>
              <Form.Item
                name="password"
                hasFeedback
                label={'Κώδικος χρήστη'}
                className={`d-block`}
                // validateStatus={loginFormErrors.mail.status}
                // extra={loginFormErrors.mail.message}
              >
                <Input.Password onChange={() => setPassword(form.getFieldValue('password'))} />
              </Form.Item>
              {password && (
                <Form.Item
                  name="passwordConfirmation"
                  hasFeedback
                  label={'Επαληθευση κωδικου'}
                  className={`d-block`}
                  // validateStatus={loginFormErrors.mail.status}
                  // extra={loginFormErrors.mail.message}
                >
                  <Input.Password
                    onChange={() => setPasswordConfirmation(form.getFieldValue('passwordConfirmation'))}
                  />
                </Form.Item>
              )}
            </Col>
          </Row>
          <Row>
            <Col span={24} className={'mr-auto'}>
              <Button className={style.settingsSubmit}>Αποθηκευση</Button>
            </Col>
          </Row>
        </Form>
      </Col>
    </Col>
  );
};

export default MyAccountSettings;
