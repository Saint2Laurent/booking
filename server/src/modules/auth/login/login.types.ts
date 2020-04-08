import { ArgsType, Field, ObjectType } from 'type-graphql';
import {
  LoginInput as LoginInputInterface,
  LoginResponse as LoginResponseInterface,
  LoginErrors as LoginErrorsInterface
} from '../../../../../shared/types/api/auth/login';
import { User } from '../../../entity/User';

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
