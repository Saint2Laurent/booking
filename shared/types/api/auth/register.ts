import { LoginResponse } from './login';

export interface RegistrationResponse {
  success: boolean;
  loginResponse: LoginResponse;
}

export interface RegistrationInput {
  fullName: string;
  mail: string;
  password: string;
}

export interface RegistrationErrors {
  mailInvalid?: boolean;
  fullNameInvalid?: boolean;
  passwordInadequate?: boolean;
  _passwordWeak?: boolean;
  _mailExists?: boolean;
}
