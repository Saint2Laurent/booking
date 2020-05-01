import { UpdateUserErrors } from '../../../../shared/types/api/user/user';
import {
  isFullNameValid,
  isMailValid,
  isPasswordAdequate
} from '../../../../shared/validators/auth/common-auth-validator';
import { User } from '../../entity/User';
const zxcvbn = require('zxcvbn');

export const updateUserValidation = async (
  updateUserId: string,
  userRequestedId: string,
  mail: string,
  fullName: string,
  password: string
): Promise<UpdateUserErrors> => {
  const errors: UpdateUserErrors = {};

  const user = await User.findOne({ mail: mail });
  const userToUpdate = await User.findOne({ id: updateUserId });

  /** If use
   *
   */
  if (user && userToUpdate) {
    console.log('both users');
    if (user.id !== userToUpdate.id) {
      errors.mailInvalid = true;
    }
  }

  if (!isMailValid(mail)) {
    errors.mailInvalid = true;
  }

  if (!isPasswordAdequate(password)) {
    errors.passwordInvalid = true;
  }

  if (zxcvbn(password).score < 3) {
    errors.passwordInvalid = true;
  }

  if (!isFullNameValid(fullName)) {
    errors.fullNameInvalid = true;
  }

  return errors;
};
