import { ArgsType, Field, ObjectType } from 'type-graphql';
import {
  PasswordResetErrors as PasswordResetErrorsInterface,
  PasswordResetInput as PasswordResetInputInterface,
  PasswordResetResponse as PasswordResetResponseInterface
} from '../../../../../../shared/types/api/auth/password-reset';

@ArgsType()
export class PasswordResetInput implements PasswordResetInputInterface {
  @Field()
  token: string;

  @Field()
  password: string;
}

@ObjectType()
export class PasswordResetResponse implements PasswordResetResponseInterface {
  @Field()
  success: boolean;
}

@ObjectType()
export class PasswordResetErrors implements PasswordResetErrorsInterface {
  @Field({ nullable: true })
  passwordInvalid?: boolean;

  @Field({ nullable: true })
  passwordsDoNotMatch?: boolean;

  @Field({ nullable: true })
  _tokenInvalid?: boolean;

  @Field({ nullable: true })
  _passwordWeak?: boolean;
}
