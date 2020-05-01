import React, { useEffect, useState } from 'react';
import style from '../auth.module.scss';
import { Button, Col, Form, Input, Row } from 'antd';
import AuthHeader from '../auth-header';
import { useMailValidator } from '../../../hooks/use-mail-validators';
import { RequestPasswordResetErrors } from '../../../../../shared/types/api/auth/request-password-reset';
import { FormValidationInfoField, isMailValid } from '../../../../../shared/validators/auth/common-auth-validator';
import { CheckOutlined } from '@ant-design/icons';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { CSSTransition } from 'react-transition-group';
import { defaultFormValidationField } from '../../../misc/types';

const ForgotPassword = () => {
  const [form] = Form.useForm();
  const [errors, setErrors] = useState<RequestPasswordResetErrors>({});
  const [formErrors, setFormErrors] = useState<FormValidationInfoField>({ ...defaultFormValidationField });
  const [setEmail, email, isRegistered] = useMailValidator();
  const [requestSuccessful, setRequestSuccessful] = useState(false);

  const REQUEST_PASSWORD_RESET = gql`
    mutation{
      requestPasswordReset(mail: "${email}"){
        ... on RequestPasswordResetResponse{
          success
        }
        ... on RequestPasswordResetErrors{
          mailInvalid
          _mailNotRegistered
          _tooManyAttempts
          _failedToSend
        }
      }
    }
  `;

  const [requestPasswordReset, { data, loading }] = useMutation(REQUEST_PASSWORD_RESET, { fetchPolicy: 'no-cache' });

  const finished = () => {
    requestPasswordReset()
      .then(d => {
        console.log(d);
        const data = d.data.requestPasswordReset;
        if (data.__typename === 'RequestPasswordResetResponse' && data.success) {
          setRequestSuccessful(true);
        }
        if (data.__typename === 'RequestPasswordResetErrors') {
          console.log(data);
          setErrors(data);
        }
      })
      .catch(e => {
        console.log(e);
      });
  };

  const factorFormValidationInfo = () => {
    let formFieldErrors: FormValidationInfoField = { status: '', message: '' };
    console.log(errors);
    if (form.isFieldTouched('mail')) {
      if (errors.mailInvalid) {
        formFieldErrors = { status: 'warning', message: 'Το email δεν ειναι εγγυρο' };
      } else if (errors._mailNotRegistered) {
        formFieldErrors = { status: 'warning', message: 'Το email δεν ειναι εγγεγραμενο' };
      } else {
        formFieldErrors = { status: 'success', message: '' };
      }
    }
    setFormErrors(formFieldErrors);
  };

  useEffect(() => {
    factorFormValidationInfo();
  }, [errors]);

  useEffect(() => {
    if (!isMailValid(form.getFieldValue('mail'))) {
      setErrors({ mailInvalid: true });
    } else {
      setErrors({});
    }
  }, [form.getFieldValue('mail')]);

  useEffect(() => {
    console.log(isRegistered);
    if (!isRegistered) {
      setErrors({ ...errors, _mailNotRegistered: true });
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
                <h1 className={style.headingTitle2}>Ανακτηση κωδικου </h1>
              </Col>
            </Row>
            <div className={style.slideContainer}>
              <Col span={24} className={'mr-1 mt-4 text-left'}>
                <Form form={form} onFinish={finished}>
                  <Row>
                    <Col span={24}>
                      <Form.Item hasFeedback extra={formErrors.message} validateStatus={formErrors.status} name="mail">
                        <Input onChange={onMailChange} placeholder="Λογαριασμός email" />
                      </Form.Item>
                      {errors._tooManyAttempts && (
                        <Row className={'m-0 p-0'}>
                          <Form.Item
                            hasFeedback
                            className={'reduced-spacing'}
                            validateStatus={'warning'}
                            help={
                              'Εχουν ηδη αποσταλει αρκετα emails προς αυτην την διευθυνση, αναμενετε καποιο διαστημα και ελενχετε τα εισερχομενα σας τακτικα.'
                            }
                          >
                            Αποτυχια παραδοσης email
                          </Form.Item>
                        </Row>
                      )}

                      <Row className="mt-4 pt-4 pb-3">
                        <Button
                          icon={
                            requestSuccessful && (
                              <CSSTransition appear timeout={1200} classNames="swapViews">
                                <CheckOutlined />
                              </CSSTransition>
                            )
                          }
                          disabled={Object.keys(errors).length !== 0 || requestSuccessful}
                          loading={loading}
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
