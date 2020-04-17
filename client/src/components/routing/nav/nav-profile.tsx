import React from 'react';
import style from '../nav.module.scss';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { incrementAsync, selectAuth } from '../../../store/authSlice';
import Text from 'react-svg-text';

const getImageDiv = (user: any) => {
  console.log(user);
  if (user.profileImageUrl) {
    return (
      <div className={style.profileWrapper}>
        <img className={style.navUserImage} src={user.profileImageUrl} alt="profileImage" />
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
  const stateData = useSelector(selectAuth);
  const auth = stateData.auth;
  const dispatch = useDispatch();

  const callFn = () => {
    dispatch(incrementAsync(5));
  };

  return (
    <React.Fragment>
      <div className={style.navProfile} onClick={callFn}>
        {auth.isAuthenticated && <div className={style.profileImage}>{getImageDiv(auth.user)}</div>}
      </div>
    </React.Fragment>
  );
};

export default NavProfile;
