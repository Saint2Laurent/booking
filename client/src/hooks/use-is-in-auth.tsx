import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { isEmpty } from '../../../shared/utils/is-empty';

const useIsInAuth = () => {
  const [isInAuth, setIsInAuth] = useState(false);

  let location = useLocation();

  useEffect(() => {
    let urlPathSplit = location.pathname.split('/');
    setIsInAuth(false);
    if (!isEmpty(urlPathSplit[1])) {
      if (urlPathSplit[1] === 'auth') {
        console.log(urlPathSplit[1]);
        setIsInAuth(true);
      } else {
        setIsInAuth(false);
      }
    }
  }, [location]);

  return [isInAuth, useIsInAuth];
};

export default useIsInAuth;
