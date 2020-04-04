import React from 'react';
import { Button, Col, Row } from 'antd';
import logo from '../../assets/images/logo.svg';
import style from './auth.module.scss';
import { useHistory } from 'react-router-dom';

interface AuthHeaderProps {
  targetLocation: 'register' | 'login';
}

const AuthHeader: React.FC<AuthHeaderProps> = props => {
  let history = useHistory();

  return (
    <Row>
      <Col span={24} className={'mt-4'}>
        <img src={logo} className={style.authLogo} alt="" />
        <Col xs={{ span: 0 }} md={{ span: 24 }} className={style.authRedirect}>
          <Button onClick={() => history.push('/auth/' + props.targetLocation)} ghost>
            {props.targetLocation === 'register' ? 'Εγγραφή' : 'Είσοδος'}
          </Button>
        </Col>
      </Col>
    </Row>
  );
};

export default AuthHeader;
