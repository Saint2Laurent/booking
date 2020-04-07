import { User } from '../../../entity/User';
import { RegistrationErrors } from '../auth-responses';
import { plainToClass } from 'class-transformer';
import { validateRegistrationInput } from '../../../../../shared/validators/auth/common-auth-validator';
const zxcvbn = require('zxcvbn');
const validator = require('validator');

interface RegistrationArgs {
  mail: string;
  fullName: string;
  password: string;
}

export const validateRegisterRequest = (credentials: RegistrationArgs, user?: User): RegistrationErrors => {
  const { mail, fullName, password } = credentials;
  const registrationErrors: RegistrationErrors = { ...validateRegistrationInput(mail, fullName, password) };

  if (user) {
    registrationErrors._mailExists = true;
  }

  if (zxcvbn(credentials.password).score < 2) {
    registrationErrors._passwordWeak = true;
  }

  return registrationErrors;
};
