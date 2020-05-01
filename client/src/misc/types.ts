export type FormValidationField = {
  status: 'success' | 'warning' | '';
  message?: string;
};

export const defaultFormValidationField: FormValidationField = {
  status: '',
  message: ''
};
