import React from 'react';
import { useToasts } from 'react-toast-notifications';

export const useNotification = () => {
  const { addToast } = useToasts();

  const notifyResponseError = () => {
    addToast('Αδυναμια ανταποκρισης απο τον διακομιστη.', { appearance: 'error', autoDismiss: true });
  };

  return notifyResponseError;
};

export default useNotification;
