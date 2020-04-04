export interface RegistrationPayload {
  fullName: string;
  mail: string;
  password: string;
}

export interface GoogleRegistrationPayload {
  googleTokenId: string;
}

export interface RegistrationResponse {
  token?: string;
  success: boolean;
  errors?: RegistrationErrors;
}
export interface GoogleRegistrationResponse {
  success: boolean;
  token: string;
  errors?: GoogleRegistrationErrors;
}

export interface RegistrationErrors {
  mailInvalid?: boolean;
  passwordInvalid?: boolean;
  fullNameInvalid?: boolean;
  alreadyRegistered?: boolean;
  needsConfirmation?: boolean;
}

export interface GoogleRegistrationErrors {
  tokenInvalid?: boolean;
}

