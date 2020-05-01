import React, { useEffect, useState } from 'react';
import style from '../settings.module.scss';
import { Form, Input, Row, Col, Button } from 'antd';
import { useForm } from 'antd/es/form/util';
import { selectAuth, setUser } from '../../../store/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { UpdateUserErrors } from '../../../../../shared/types/api/user/user';
import { FormValidationInfoField } from '../../../../../shared/validators/auth/common-auth-validator';
import { defaultFormValidationField } from '../../../misc/types';
import { CheckOutlined } from '@ant-design/icons';
import useNotification from '../../../hooks/use-notification';

interface UpdateUserFormErrors {
  mail: FormValidationInfoField;
  fullName: FormValidationInfoField;
  password: FormValidationInfoField;
  passwordConfirmation: FormValidationInfoField;
}

const MyAccountSettings = () => {
  const notifyResponseError = useNotification();
  const [form] = useForm();
  const [errors, setErrors] = useState<UpdateUserErrors>({});
  const [formErrors, setFormErrors] = useState<UpdateUserFormErrors>({
    mail: defaultFormValidationField,
    password: defaultFormValidationField,
    fullName: defaultFormValidationField,
    passwordConfirmation: defaultFormValidationField
  });
  const [mail, setMail] = useState();
  const [fullName, setFullName] = useState();
  const [password, setPassword] = useState();
  const [passwordConfirmation, setPasswordConfirmation] = useState();
  const [requestComplete, setRequestComplete] = useState(false);

  const state = useSelector(selectAuth);

  const UPDATE_USER = gql`
    mutation {
      updateUser(
        id: "${state.auth.user.id}", 
        mail: "${form.getFieldValue('mail')}", 
        fullName: "${form.getFieldValue('fullName')}",
        password: "${form.getFieldValue('password')}") 
       {
        ... on UpdateUserResponse {
          user {
            id
            mail, 
            fullName
          }
        }
        ... on UpdateUserErrors{
          mailInvalid,
          notAuthorized,
          fullNameInvalid,
          passwordInvalid
        }
      }
    }
  `;

  const [updateUser, { loading }] = useMutation(UPDATE_USER, { fetchPolicy: 'no-cache' });
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(state);
    const { mail, fullName } = state.auth.user;

    form.setFieldsValue({ mail, fullName, password: '' });
  }, []);

  const factorFormErrors = () => {
    const formErrors: UpdateUserFormErrors = {
      mail: defaultFormValidationField,
      fullName: defaultFormValidationField,
      password: defaultFormValidationField,
      passwordConfirmation: defaultFormValidationField
    };
    if (errors?.mailInvalid) {
      formErrors.mail = { status: 'warning', message: 'Το email δεν ειναι εγγυρο' };
    }
    if (errors?.fullNameInvalid) {
      formErrors.fullName = { status: 'warning', message: 'Το πληρες ονομα δεν ειναι εγγυρο' };
    }
    if (errors?.passwordInvalid) {
      formErrors.password = { status: 'warning', message: 'Ο κωδικος δεν ειναι εγγυρος' };
    }
    if (errors?.passwordsDoNotMatch) {
      formErrors.passwordConfirmation = { status: 'warning', message: 'Οι κωδικοι δεν τεριαζουν' };
    }
    setFormErrors(formErrors);
  };

  useEffect(() => {
    factorFormErrors();
  }, [errors]);

  const formSubmitted = () => {
    updateUser()
      .then(d => {
        console.log(d);
        const data = d.data.updateUser;
        if (data.__typename === 'UpdateUserErrors') {
          setErrors(data);
        }
        if (data.__typename === 'UpdateUserResponse') {
          setRequestComplete(true);
          dispatch(setUser(data.user));
        }
      })
      .catch(e => {
        notifyResponseError();
      });
  };

  useEffect(() => {
    setRequestComplete(false);
  }, [mail, fullName, password]);

  useEffect(() => {
    if (passwordConfirmation !== password) {
      setErrors({ passwordsDoNotMatch: true });
    } else {
      let err = errors;
      delete err.passwordsDoNotMatch;
      factorFormErrors();
    }
  }, [password, passwordConfirmation]);

  return (
    <Col span={8} className={style.settingsInnerContainer}>
      <Col className={style.settingHeading}>Ο ΛΟΓΑΡΙΑΣΜΟΣ ΜΟΥ</Col>

      <Col className={style.settings}>
        <Form form={form} onSubmitCapture={formSubmitted}>
          <Row>
            <Col span={24}>
              <Form.Item
                name="mail"
                hasFeedback
                label={'Email χρήστη'}
                className={`d-block mb-3`}
                validateStatus={formErrors.mail.status}
                extra={formErrors.mail.message}
              >
                <Input disabled={state.auth.user.isGoogle} onChange={() => setMail(form.getFieldValue('mail'))} />
              </Form.Item>
              <Form.Item
                name="fullName"
                hasFeedback
                label={'Πλήρες Όνομα'}
                className={`d-block`}
                validateStatus={formErrors.fullName.status}
                extra={formErrors.fullName.message}
              >
                <Input onChange={() => setFullName(form.getFieldValue('fullName'))} />
              </Form.Item>
              <Form.Item
                name="password"
                hasFeedback
                label={'Κώδικος χρήστη'}
                className={`d-block`}
                validateStatus={formErrors.password.status}
                extra={formErrors.password.message}
              >
                <Input.Password onChange={() => setPassword(form.getFieldValue('password'))} />
              </Form.Item>
              {password && (
                <Form.Item
                  name="passwordConfirmation"
                  hasFeedback
                  label={'Επαληθευση κωδικου'}
                  className={`d-block`}
                  validateStatus={formErrors.passwordConfirmation.status}
                  extra={formErrors.passwordConfirmation.message}
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
              <Button
                icon={requestComplete && <CheckOutlined />}
                htmlType={'submit'}
                loading={loading}
                className={style.settingsSubmit}
                disabled={Object.keys(errors).length !== 0 || requestComplete}
              >
                Αποθηκευση
              </Button>
            </Col>
          </Row>
        </Form>
      </Col>
    </Col>
  );
};

export default MyAccountSettings;
