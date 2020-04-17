import React, { useEffect, useState } from 'react';

const useToken = () => {
  const [token, setToken] = useState<string | null>();

  useEffect(() => {
    let token = localStorage.getItem('token');
    if (token !== undefined && token !== null) {
      setToken(token);
    }
  }, [token]);

  return [token];
};

export default useToken;
