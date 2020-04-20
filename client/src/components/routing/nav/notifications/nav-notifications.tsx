import React from 'react';
import style from '../../nav.module.scss';
import notificationIcon from '../../../../assets/images/notification-icon.png';

const NavNotifications = () => {
  return (
    <div className={style.navNotifications}>
      <img className={style.navNotificationsIcon} src={notificationIcon} alt="" />
    </div>
  );
};

export default NavNotifications;
