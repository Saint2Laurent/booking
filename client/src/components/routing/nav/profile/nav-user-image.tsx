import React from 'react';
import style from '../../nav.module.scss';
import Text from 'react-svg-text';
import { User } from '../../../../../../server/src/entity/User';

interface NavUserImageProps {
  user: User;
  togglePanel: () => void;
  shouldToggle: boolean;
}

const NavUserImage: React.FC<NavUserImageProps> = ({ user, togglePanel, shouldToggle }: NavUserImageProps) => {
  const toggle = () => {
    if (shouldToggle) {
      togglePanel();
    }
  };

  console.log(user);

  return (
    <div className={style.userImage}>
      {user.isGoogle && (
        <div onClick={toggle} className={style.profileImage}>
          <div className={style.profileWrapper}>
            <img className={style.navUserImage} src={user.profileImageUrl} alt="profileImage" />
          </div>
        </div>
      )}

      {!user.isGoogle && (
        <div onClick={toggle} className={style.profileImage}>
          <div className={style.profileWrapper}>
            <svg className={style.svgImage}>
              <Text verticalAnchor="start" y={4} x={0} fontSize={'1.5rem'}>
                YL
              </Text>
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavUserImage;
