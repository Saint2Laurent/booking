import { ArgsType, Field, ObjectType } from 'type-graphql';
import { LoginResponse } from '../login/login.types';
import {
  RegistrationErrors as RegistrationErrorsInterface,
  RegistrationResponse as RegistrationResponseInterface,
  RegistrationInput as RegistrationInputInterface
} from '../../../../../shared/types/api/auth/register';

@ObjectType()
export class RegistrationErrors implements RegistrationErrorsInterface {
  @Field({ nullable: true })
  mailInvalid?: boolean;

  @Field({ nullable: true })
  fullNameInvalid?: boolean;

  @Field({ nullable: true })
  passwordInadequate?: boolean;

  @Field({ nullable: true })
  _passwordWeak?: boolean;

  @Field({ nullable: true })
  _mailExists?: boolean;
}

@ObjectType()
export class RegistrationResponse implements RegistrationResponseInterface {
  @Field()
  success: boolean;

  @Field()
  loginResponse: LoginResponse;
}

@ArgsType()
export class RegistrationInput implements RegistrationInputInterface {
  @Field()
  fullName: string;

  @Field()
  mail: string;

  @Field()
  password: string;
}
