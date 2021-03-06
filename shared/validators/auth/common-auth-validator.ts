import { isEmpty } from '../../utils/is-empty';
import { RegistrationErrors } from '../../types/api/auth/register';

export interface FormValidationInfoField {
  status: 'success' | 'warning' | '';
  message?: string;
}

export interface RegisterFormValidationInfo {
  mail: FormValidationInfoField;
  fullName: FormValidationInfoField;
  password: FormValidationInfoField;
}

export const isMailValid = (mail: string): boolean => {
  return (
    !isEmpty(mail) &&
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      mail
    )
  );
};

export const isFullNameValid = (name: string): boolean => {
  return !isEmpty(name) && /[^%]{3,}/g.test(name);
};

export const isPasswordAdequate = (password: string): boolean => {
  return !isEmpty(password) && password.length > 7;
};

export const validateRegistrationInput = (mail: string, fullName: string, password: string): RegistrationErrors => {
  let registrationErrors: RegistrationErrors = {};
  if (!isMailValid(mail)) {
    registrationErrors.mailInvalid = true;
  }
  if (!isFullNameValid(fullName)) {
    registrationErrors.fullNameInvalid = true;
  }
  if (!isPasswordAdequate(password)) {
    registrationErrors.passwordInadequate = true;
  }
  return registrationErrors;
};

export const factorFormValidationInfo = (
  form: any,
  registrationErrors: RegistrationErrors
): RegisterFormValidationInfo => {
  let mailFormInfo: FormValidationInfoField = { status: '', message: '' };

  if (form.isFieldTouched('mail')) {
    if (registrationErrors._mailExists) {
      mailFormInfo = { status: 'warning', message: 'Το email υπαρχει ηδη' };
    } else if (registrationErrors.mailInvalid) {
      mailFormInfo = { status: 'warning', message: 'Το email δεν ειναι σωστο' };
    } else {
      mailFormInfo.status = 'success';
    }
  }

  let fullNameFormInfo: FormValidationInfoField = { status: '', message: '' };

  if (form.isFieldTouched('fullName')) {
    if (registrationErrors.fullNameInvalid) {
      fullNameFormInfo = { status: 'warning', message: 'Το πληρες ονομα δεν ειναι σωστο' };
    } else {
      fullNameFormInfo.status = 'success';
    }
  }

  let passwordFormInfo: FormValidationInfoField = { status: '', message: '' };

  if (form.isFieldTouched('password')) {
    if (registrationErrors.passwordInadequate) {
      passwordFormInfo = { status: 'warning', message: 'Ο κώδικος δεν ειναι αρκετός' };
    } else if (registrationErrors._passwordWeak) {
      passwordFormInfo = { status: 'warning', message: 'Ο κώδικος δεν ειναι αρκετα δυνατος' };
    } else {
      passwordFormInfo.status = 'success';
    }
  }

  return { mail: mailFormInfo, password: passwordFormInfo, fullName: fullNameFormInfo };
};
