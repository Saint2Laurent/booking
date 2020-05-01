import React from 'react';
import style from '../settings.module.scss';
import { Col, Form, Input, Button, Row } from 'antd';
import { useForm } from 'antd/lib/form/util';

const StaffAccountSettings = () => {
  const [form] = useForm();

  const formSubmitted = () => {};

  return (
    <Col span={8} className={`${style.settingsInnerContainer} pt-5`}>
      <Col className={style.settingHeading}>ΛΟΓΑΡΙΑΣΜΟΙ ΠΡΟΣΩΠΙΚΟΥ</Col>

      <Col className={style.settings}>
        <Form form={form} onSubmitCapture={formSubmitted}>
          <Form.Item
            name="mail"
            hasFeedback
            label={'Email χρήστη'}
            className={`d-block mb-3`}
            // validateStatus={formErrors.mail.status}
            // extra={formErrors.mail.message}
          >
            <Input />
          </Form.Item>
        </Form>
      </Col>
    </Col>
  );
};

export default StaffAccountSettings;
