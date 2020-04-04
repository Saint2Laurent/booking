import { Errors } from '../../misc/errors';

export interface LoginPayload {
  mail: string;
  password: string;
}

export interface GoogleLoginPayload {
  googleTokenId: string;
}

export interface LoginResponse {
  token?: string;
  success: boolean;
  errors: Errors;
}

