import React from 'react';
import style from '../nav.module.scss';
import { useSelector } from 'react-redux';
import { selectAuth } from '../../../store/authSlice';
import Text from 'react-svg-text';

const getImageDiv = (auth: any) => {
  if (auth.user.profileUrl) {
    return (
      <div className={style.profileWrapper}>
        <img className={style.navUserImage} src={auth.user.profileUrl} alt="profileImage" />
      </div>
    );
  } else {
    return (
      <div className={style.profileWrapper}>
        <svg className={style.svgImage}>
          <Text verticalAnchor="start" y={4} x={0} fontSize={'1.5rem'}>
            YL
          </Text>
        </svg>
      </div>
    );
  }
};

const NavProfile = () => {
  const { auth } = useSelector(selectAuth);

  return (
    <div className={style.navProfile}>
      <div className={style.profileImage}>{getImageDiv(auth)}</div>
    </div>
  );
};

export default NavProfile;
