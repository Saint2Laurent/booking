import { isMailValid } from '../../../../../shared/validators/auth/common-auth-validator';
import { plainToClass } from 'class-transformer';
import { RequestPasswordResetErrors } from '../auth-responses';
import { User } from '../../../entity/User';
import { PasswordReset } from '../../../entity/PasswordReset';
import { v4 as uuid } from 'uuid';

export const validateRequestPasswordReset = async (mail: string, user?: User): Promise<RequestPasswordResetErrors> => {
  let errors: RequestPasswordResetErrors = {};

  if (!isMailValid(mail)) {
    return { mailInvalid: true };
  }

  if (!user) {
    return { _mailNotRegistered: true };
  }

  const passwordResets = await PasswordReset.find({ userId: user.id });
  let notExpiredResets = passwordResets.filter(r => {
    return r.expiresAt > new Date();
  });

  if (notExpiredResets.length > 35) {
    return { _tooManyAttempts: true };
  }
  return errors;
};
