import React from 'react';
import style from '../settings.module.scss';
import { Row } from 'antd';
import MyAccountSettings from './my-account-settings';
import StaffAccountSettings from './staff-account-settings';

const AccountsSettings = () => {
  return (
    <div className={style.pageContainer}>
      <Row>
        <div className={style.settingsMainHeading}>ΡΥΘΜΙΣΕΙΣ ΛΟΓΑΡΙΑΣΜΩΝ</div>
      </Row>
      <Row>
        <MyAccountSettings />
      </Row>
      <Row>
        <StaffAccountSettings />
      </Row>
    </div>
  );
};

export default AccountsSettings;
