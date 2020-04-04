import React, { useEffect, useState } from 'react';
import { useResponsive } from '@umijs/hooks';
import { nor } from '../../../shared/utils/boole';

interface ResponsiveInfo {
  [key: string]: boolean;
}

const getIsMobile = (responsiveInfo: ResponsiveInfo): boolean => {
  return nor([
    responsiveInfo.md || responsiveInfo.lg || responsiveInfo.xl,
    (responsiveInfo.sx || responsiveInfo.sm) && !(responsiveInfo.md || responsiveInfo.lg || responsiveInfo.xl)
  ]);
};

const useIsMobile = () => {
  const breakpoints = useResponsive();
  const [isMobile, setIsMobile] = useState(getIsMobile(breakpoints));

  useEffect(() => {
    setIsMobile(getIsMobile(breakpoints));
  }, [breakpoints]);

  return isMobile;
};

export default useIsMobile;
