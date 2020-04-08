import { plainToClass } from 'class-transformer';
import { User } from '../../../../entity/User';
import { isMailValid } from '../../../../../../shared/validators/auth/common-auth-validator';
import { LoginErrors } from './login.types';
const argon2 = require('argon2');

interface LoginArgs {
  mail: string;
  password: string;
}

export const validateLoginRequest = async ({ mail, password }: LoginArgs): Promise<LoginErrors> => {
  if (!isMailValid(mail)) {
    return plainToClass(LoginErrors, { mailInvalid: true });
  }

  const user = await User.findOne({ mail });
  if (user) {
    if (user.isGoogle) {
      console.log('yes google');
      return plainToClass(LoginErrors, { _isGoogle: true });
    }

    const passwordMatched = await argon2.verify(user.password, password);
    if (passwordMatched) {
      return plainToClass(LoginErrors, {});
    } else {
      return plainToClass(LoginErrors, { _passwordInvalid: true });
    }
  } else {
    return plainToClass(LoginErrors, { _notRegistered: true });
  }
};
