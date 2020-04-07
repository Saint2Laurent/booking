import { User } from '../../entity/User';

export interface ForgotPasswordErrors {
  mailInvalid?: boolean;
  _mailNotRegistered?: boolean;
  _tooManyAttempts?: boolean;
}

export interface LoginInput {
  mail: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface RegistrationResponse {
  success: boolean;
  loginResponse: LoginResponse;
}

export interface RegistrationInput {
  fullName: string;
  mail: string;
  password: string;
}

export interface LoginErrors {
  _passwordInvalid?: boolean;
  _notRegistered?: boolean;
}

export interface RegistrationErrors {
  mailInvalid?: boolean;
  fullNameInvalid?: boolean;
  passwordInadequate?: boolean;
  _passwordWeak?: boolean;
  _mailExists?: boolean;
}
