import { LoginErrors } from '../forgot-password/reset-request/request-password-reset.types';
import { plainToClass } from 'class-transformer';
import { User } from '../../../entity/User';
const argon2 = require('argon2');

interface LoginArgs {
  mail: string;
  password: string;
}

export const validateLoginRequest = async ({ mail, password }: LoginArgs): Promise<LoginErrors> => {
  const user = await User.findOne({ mail });
  if (user) {
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
