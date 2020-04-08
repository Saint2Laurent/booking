export interface RequestPasswordResetInput {
  mail: string;
}

export interface RequestPasswordResetResponse {
  success: boolean;
}

export interface RequestPasswordResetErrors {
  mailInvalid?: boolean;
  _mailNotRegistered?: boolean;
  _tooManyAttempts?: boolean;
  _failedToSend?: boolean;
}
