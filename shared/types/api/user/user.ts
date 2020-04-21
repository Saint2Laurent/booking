import { User } from '../../entity/User';

export interface MeResponse {
  user: User;
}

export interface UpdateUserInput {
  user: User;
}

export interface UpdateUserResponse {
  user: User;
}

export interface UpdateUserErrors {
  notAuthorized?: boolean;
  mailInvalid?: boolean;
  passwordInvalid?: boolean;
}
