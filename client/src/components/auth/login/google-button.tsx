import React from 'react';
import { Button, Col, Form, Row } from 'antd';
import GoogleLogin from 'react-google-login';
import style from '../auth.module.scss';
import googleIcon from '../../../assets/images/icon-google.svg';
import { CheckOutlined } from '@ant-design/icons';
import RedirectSuccessful from './redirect-successful';

interface GoogleButtonPropTypes {
  isFetching: boolean;
  googleLoginSuccessful: boolean;
  googleErrors: any;
  setIsFetching: any;
  onGoogleResponse: any;
  onGoogleResponseFail: any;
}

const GoogleButton: React.FC<GoogleButtonPropTypes> = ({
  isFetching,
  googleLoginSuccessful,
  setIsFetching,
  onGoogleResponse,
  onGoogleResponseFail,
  googleErrors
}: GoogleButtonPropTypes) => {
  return (
    <div>
      <Row>
        <GoogleLogin
          clientId="315458143733-80m56pstigk1t5q22i3fdrpa0jbvd570.apps.googleusercontent.com"
          render={renderProps => (
            <Button
              loading={isFetching}
              id={'registerEmailGButton'}
              block
              className={style.inputButton}
              onClick={renderProps.onClick}
              disabled={googleLoginSuccessful}
            >
              <div className="mr-1 d-inline">
                {googleLoginSuccessful ? (
                  <CheckOutlined />
                ) : (
                  <img className={style.buttonIcon} src={googleIcon} alt="" />
                )}
              </div>
              <div className="d-inline">
                {googleLoginSuccessful ? <span>Εισοδος επιτυχης</span> : <span>Σύνεχεια με Google</span>}
              </div>
            </Button>
          )}
          buttonText="Είσοδος με Google"
          onRequest={() => {
            setIsFetching(true);
          }}
          onSuccess={onGoogleResponse}
          onFailure={onGoogleResponseFail}
          cookiePolicy={'single_host_origin'}
        />
      </Row>
      {googleErrors._tokenInvalid && (
        <div>
          <span className={'small-text reduced-spacing color-warning pt-2'}>
            Υπηρξε καποιο προβλημα κατα την εισοδο μεσω Google. Προσπαθηστε εκ νεου.
          </span>
        </div>
      )}

      {googleLoginSuccessful && <RedirectSuccessful />}
    </div>
  );
};

export default GoogleButton;
