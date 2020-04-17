import { User } from '../../entity/User';
import { Response } from '../Response';

export interface GoogleLoginInput {
  token: string;
}

export interface GoogleLoginResponse extends Response {
  user: User;
  token: string;
}

export interface GoogleLoginErrors {
  _tokenInvalid?: boolean;
}

export interface LoginInput {
  mail: string;
  password: string;
}

export interface LoginResponse extends Response {
  user: User;
  token: string;
}

export interface LoginErrors {
  mailInvalid?: boolean;
  _notRegistered?: boolean;
  _isGoogle?: boolean;
  _passwordInvalid?: boolean;
}
