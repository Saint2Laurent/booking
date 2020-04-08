import { PasswordResetErrors } from '../../../../../../shared/types/api/auth/password-reset';
import isEmail from 'validator/lib/isEmail';
import { PasswordResetToken } from '../../../../entity/PasswordResetToken';
import { isPasswordAdequate } from '../../../../../../shared/validators/auth/common-auth-validator';
const zxcvbn = require('zxcvbn');

export const validatePasswordReset = async (token: string, password: string): Promise<PasswordResetErrors> => {
  if (!isPasswordAdequate(password)) {
    return { passwordInvalid: true };
  }

  if (zxcvbn(password).score < 3) {
    return { _passwordWeak: true };
  }

  const resetToken = await PasswordResetToken.findOne({ token });
  console.log(resetToken);
  if (!resetToken) {
    return { _tokenInvalid: true };
  }

  if (resetToken.expiresAt < new Date()) {
    return { _tokenInvalid: true };
  }

  return {};
};
