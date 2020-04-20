import React, { useState } from 'react';
import style from '../../nav.module.scss';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { incrementAsync, selectAuth, resetAuth, logout } from '../../../../store/authSlice';
import NavUserImage from './nav-user-image';
import { Button } from 'antd';
import { CSSTransition } from 'react-transition-group';

const NavProfile = () => {
  const stateData = useSelector(selectAuth);
  const state = stateData.auth;
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  return (
    <React.Fragment>
      <div className={style.navProfile}>
        <div onClick={togglePanel} className={style.navBarName}>
          {state.user.fullName.split(' ')[0]}
        </div>
        {state.isAuthenticated && <NavUserImage user={state.user} togglePanel={togglePanel} shouldToggle={true} />}
      </div>
      {isOpen && (
        <CSSTransition appear timeout={600} in={isOpen} classNames="swapViews">
          <div className={`${style.navProfilePanel} slide-in-fwd-center`}>
            <div className={style.imagePanel}>
              <NavUserImage user={state.user} togglePanel={togglePanel} shouldToggle={false} />
            </div>
            <div className={style.panelFullname}>{state.user.fullName}</div>
            <div className={style.panelMail}>{state.user.mail}</div>
            <div className={style.panelRole}>ΔΙΑΧΕΙΡΗΣΤΗΣ</div>
            <div className={style.panelManageAccount}>
              <Button block type={'default'}>
                Διαχειρηση λογαριασμου
              </Button>
            </div>
            <div
              onClick={() => {
                dispatch(logout());
              }}
              className={style.panelLogout}
            >
              Εξοδος
            </div>
            <div className={style.panelFooter}>
              <div>Πολιτικη απορρητου</div>
              <div className={style.panelFooterGutter}>•</div>
              <div>Οροι και προυποθεσεις</div>
            </div>
          </div>
        </CSSTransition>
      )}
    </React.Fragment>
  );
};

export default NavProfile;
