import { User } from '../../entity/User';

export interface LoginInput {
  mail: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface LoginErrors {
  _passwordInvalid?: boolean;
  _notRegistered?: boolean;
}
