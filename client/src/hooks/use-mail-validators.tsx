import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { isMailValid } from '../../../shared/validators/auth/common-auth-validator';
import { ValidationResponse } from '../../../shared/types/misc/validation-response';
import gql from 'graphql-tag';

export const useMailValidator = (formValidationInfo, setFormValidationInfo) => {
  const [mailValidation, setMailValidation] = useState<ValidationResponse>({
    isValid: false
  });
  const [mail, setEmail] = useState('');

  interface TData {
    isUserRegistered: boolean;
  }

  const IS_MAIL_REGISTERED = gql`
      {
        isUserRegistered(mail: "${mail}")
      }
  `;

  useEffect(() => {
    if (mail !== '') {
      isMailValid(mail);
    }
  }, [mail]);

  useQuery(IS_MAIL_REGISTERED, {
    fetchPolicy: 'no-cache',
    skip: !isMailValid(mail),
    onCompleted: d => {
      console.log(d);
      queryResolved(d);
    }
  });

  const queryResolved = (d: TData) => {
    if (d.isUserRegistered) {
      setFormValidationInfo({
        ...formValidationInfo,
        mail: {
          status: 'warning',
          message: 'Το mail υπαρχει ηδη'
        }
      });
    } else {
      setFormValidationInfo({
        ...formValidationInfo,
        mail: {
          status: 'success',
          message: ''
        }
      });
    }
  };

  return [setEmail, mail] as const;
};
