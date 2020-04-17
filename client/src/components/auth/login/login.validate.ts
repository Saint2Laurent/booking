import { isMailValid, isPasswordAdequate } from '../../../../../shared/validators/auth/common-auth-validator';
import { LoginFormErrors } from './login';

export const validateLogin = (mail, password, setLoginErrors) => {
  if (!isMailValid(mail)) {
    setLoginErrors({ mailInvalid: true });
  } else if (!isPasswordAdequate(password)) {
    setLoginErrors({ _passwordInvalid: true });
  } else {
    setLoginErrors({});
  }
};

export const factorFormValidationInfo = (form, loginErrors, setLoginFormErrors) => {
  const errors: LoginFormErrors = {
    mail: { status: '', message: '' },
    password: { status: '', message: '' }
  };

  if (form.isFieldTouched('mail')) {
    if (loginErrors.mailInvalid) {
      errors.mail = { status: 'warning', message: 'Το email δεν ειναι εγγυρο' };
    } else if (loginErrors._notRegistered) {
      errors.mail = { status: 'warning', message: 'Το email δεν ειναι εγγεγραμμενο' };
    } else if (loginErrors._isGoogle) {
      errors.mail = {
        status: 'warning',
        message: 'Ο λογαριασμος ειναι εγγεγραμμενος μεσω Google, εισελθετε απο την επιλογη "Συνεχεια με Google"'
      };
    } else {
      errors.mail = { status: 'success', message: '' };
    }
  }

  if (form.isFieldTouched('password')) {
    if (loginErrors._passwordInvalid) {
      errors.password = { status: 'warning', message: 'Ο κωδικος δεν ειναι σωστος' };
    }
  }

  setLoginFormErrors(errors);
};
