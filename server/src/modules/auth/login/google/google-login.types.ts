import { ArgsType, Field, ObjectType } from 'type-graphql';
import {
  GoogleLoginInput as GoogleLoginInputInterface,
  GoogleLoginResponse as GoogleLoginResponseInterface,
  GoogleLoginErrors as GoogleLoginErrorsInterface
} from '../../../../../../shared/types/api/auth/login';
import { User } from '../../../../entity/User';

@ArgsType()
export class GoogleLoginInput implements GoogleLoginInputInterface {
  @Field()
  token: string;
}

@ObjectType()
export class GoogleLoginResponse implements GoogleLoginResponseInterface {
  @Field()
  user: User;

  @Field()
  token: string;
}

@ObjectType()
export class GoogleLoginErrors implements GoogleLoginErrorsInterface {
  @Field({ nullable: false })
  _tokenInvalid?: boolean;
}
