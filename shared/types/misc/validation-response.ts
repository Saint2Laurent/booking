export interface ValidationResponse {
  isValid: boolean;
  errorMessage?: string;
  formValidationStatus?: 'success' | 'warning' | 'error' | 'validating' | '';
}
