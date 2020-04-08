export interface PasswordResetErrors {
  passwordInvalid?: boolean;
  passwordsDoNotMatch?: boolean;
  _tokenInvalid?: boolean;
  _passwordWeak?: boolean;
}

export interface PasswordResetResponse {
  success: boolean;
}

export interface PasswordResetInput {
  token: string;
  password: string;
}
