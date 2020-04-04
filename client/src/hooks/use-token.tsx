import React, { useEffect, useState } from 'react';

const useToken = () => {
  const [tokenExists, setTokenExists] = useState(false);
  const deleteToken = () => localStorage.removeItem('token');

  useEffect(() => {
    let token = localStorage.getItem('token');
    if (token !== undefined && token !== null) {
      setTokenExists(true);
    }
  }, []);

  return [tokenExists, deleteToken];
};

export default useToken;
