import { useEffect, useState } from 'react';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import { isMailValid } from '../../../shared/validators/account-validator';
import { ValidationResponse } from '../../../shared/types/misc/validation-response';

export const useMailValidator = () => {
  const [mailValidation, setMailValidation] = useState<ValidationResponse>({
    isValid: false
  });
  const [mail, setEmail] = useState('');

  interface TData {
    isUserRegistered: boolean;
  }

  const IS_MAIL_REGISTERED = gql`
        {
          isUserRegistered(email: "${mail}")
        }
    `;

  useEffect(() => {
    if (mail !== '') {
      validate();
    }
  }, [mail]);

  useQuery(IS_MAIL_REGISTERED, {
    fetchPolicy: 'no-cache',
    skip: !isMailValid(mail).isValid,
    onCompleted: d => {
      console.log(d);
      queryResolved(d);
    }
  });

  const queryResolved = (d: TData) => {
    if (d.isUserRegistered) {
      setMailValidation({
        isValid: false,
        errorMessage: 'Το email υπαρχει ηδη',
        formValidationStatus: 'warning'
      });
    } else {
      setMailValidation({
        isValid: true,
        errorMessage: '',
        formValidationStatus: 'success'
      });
    }
  };

  const validate = () => {
    console.log('validating');
    const validationResponse = isMailValid(mail);
    setMailValidation(validationResponse);
  };

  return [mailValidation, setEmail] as const;
};
