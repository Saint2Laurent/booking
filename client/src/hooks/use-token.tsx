import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { useHistory } from 'react-router-dom';

const useToken = () => {
  const [token, setToken] = useState<string | null>();
  const dispatch = useDispatch();

  useEffect(() => {
    let token = localStorage.getItem('token');
    if (token !== undefined && token !== null) {
      setToken(token);
    }
  }, [token]);

  return [token];
};

export default useToken;
