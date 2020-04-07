import React, { useState, useRef } from 'react';
import '@ant-design/compatible/assets/index.css';
import { Col, Row } from 'antd';
import RegisterEmail from './register-email';
import '../../../styles/global.scss';
import { CSSTransition } from 'react-transition-group';
import RegisterInfo from './register-info';
import './register-transitions.scss';
import logo from '../../../assets/images/logo.svg';
import style from '../auth.module.scss';
import '../auth.scss';
import AuthHeader from '../auth-header';

const Register = () => {
  const [initView, setInitView] = useState(true);
  const sliderRef: any = useRef<HTMLDivElement | null>(null);
  const scroll = (view: boolean) =>
    view ? sliderRef.current.scrollTo(sliderRef.current.scrollWidth, 0) : sliderRef.current.scrollTo(0, 0);

  const [mail, setMail] = useState('');

  const swapView = () => {
    setInitView(!initView);
    setTimeout(() => scroll(initView), 200);
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
                <h1 className={style.headingTitle}>Δημιουρήστε έναν λογαριασμό </h1>
              </Col>
            </Row>
            <div className={style.slideContainer} ref={sliderRef}>
              <CSSTransition appear timeout={600} in={initView} classNames="swapViews">
                <RegisterEmail swapView={swapView} setMail={setMail} />
              </CSSTransition>
              <CSSTransition timeout={900} in={!initView} classNames={'swapViews'}>
                <RegisterInfo initView={initView} mail={mail} />
              </CSSTransition>
            </div>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default Register;
