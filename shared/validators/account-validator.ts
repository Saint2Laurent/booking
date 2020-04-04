import { isEmpty } from '../utils/is-empty';
import { ValidationResponse } from '../types/misc/validation-response';

function isEmail(mail: string) {
  return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    mail
  );
}

export interface RegistrationAccount {
  mail: string;
  password: string;
  fullName: string;
}

export const isMailValid = (mail: string): ValidationResponse => {
  if (isEmpty(mail)) {
    return {
      isValid: false,
      errorMessage: 'Η διευθυνσή email δεν μπορεί να είναι κενη',
      formValidationStatus: 'warning'
    };
  }

  if (!isEmail(mail)) {
    return {
      isValid: false,
      errorMessage: 'Η διευθυνσή email δεν εχεί σωστη μορφή',
      formValidationStatus: 'warning'
    };
  }

  return {
    isValid: true,
    formValidationStatus: 'success'
  };
};

export const isFullNameValid = (name: string): ValidationResponse => {
  if (isEmpty(name)) {
    return {
      isValid: false,
      errorMessage: 'Το πληρες ονομα δεν μπορει να ειναι κενο ',
      formValidationStatus: 'warning'
    };
  }

  if (!/[^%]{3,}/g.test(name)) {
    return {
      isValid: false,
      errorMessage: 'Το πληρες ονομα δεν ειναι σωστο',
      formValidationStatus: 'warning'
    };
  }

  return {
    isValid: true,
    formValidationStatus: 'success'
  };
};

export const isPasswordValid = (password: string): ValidationResponse => {
  if (isEmpty(password)) {
    return {
      isValid: false,
      formValidationStatus: 'warning',
      errorMessage: 'Ο κώδικος δεν μπορει να ειναι κενος'
    };
  }

  if (password.length < 5) {
    return {
      isValid: false,
      formValidationStatus: 'warning',
      errorMessage: 'Ο κώδικος δεν ειναι αρκετα δυνατος'
    };
  }

  return {
    isValid: true,
    formValidationStatus: 'success'
  };
};

export const isAccountValid = (account: RegistrationAccount): boolean => {
  const { mail, password, fullName } = account;

  if (isMailValid(mail).isValid && isPasswordValid(password).isValid && isFullNameValid(fullName).isValid) {
    return true;
  }

  return false;
};
