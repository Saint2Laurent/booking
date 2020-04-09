import React from 'react';
import { Col, Row } from 'antd';
import style from '../auth.module.scss';

const RedirectSuccessful = () => {
  return (
    <Row>
      <Col span={24}>
        <div className={style.redirectedSoon}>Είσοδος επιτυχης! Ανακατευθηνση...</div>
      </Col>
    </Row>
  );
};

export default RedirectSuccessful;
