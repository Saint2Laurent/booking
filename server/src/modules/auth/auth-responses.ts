import { ArgsType, Field, ObjectType } from 'type-graphql';
import { User } from '../../entity/User';
import {
  LoginInput as LoginInputInterface,
  LoginResponse as LoginResponseInterface,
  LoginErrors as LoginErrorsInterface,
  RegistrationErrors as RegistrationErrorsInterface,
  RegistrationResponse as RegistrationResponseInterface,
  RegistrationInput as RegistrationInputInterface
} from '../../../../shared/types/api/auth/auth-responses';

@ArgsType()
export class LoginInput implements LoginInputInterface {
  @Field()
  mail: string;

  @Field()
  password: string;
}

@ObjectType()
export class LoginResponse implements LoginResponseInterface {
  @Field()
  user: User;

  @Field()
  token: string;
}

@ObjectType()
export class LoginErrors implements LoginErrorsInterface {
  @Field({ nullable: true })
  _passwordInvalid?: boolean;

  @Field({ nullable: true })
  _notRegistered?: boolean;
}

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
