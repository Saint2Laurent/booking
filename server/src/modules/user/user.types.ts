import { ArgsType, Field, InputType, ObjectType } from 'type-graphql';
import {
  UpdateUserErrors as UpdateUserErrorsInterface,
  UpdateUserResponse as UpdateUserResponseInterface,
  UpdateUserInput as UpdateUserInputInterface
} from '../../../../shared/types/api/user/user';
import { User } from '../../entity/User';

@ArgsType()
export class UpdateUserInput implements Partial<User> {
  @Field()
  id: string;

  @Field({ nullable: true })
  mail: string;

  @Field({ nullable: true })
  fullName: string;

  @Field({ nullable: true })
  password: string;
}

@ObjectType()
export class UpdateUserResponse implements UpdateUserResponseInterface {
  @Field()
  user: User;
}

@ObjectType()
export class UpdateUserErrors implements UpdateUserErrorsInterface {
  @Field({ nullable: true })
  notAuthorized?: boolean;

  @Field({ nullable: true })
  mailInvalid?: boolean;

  @Field({ nullable: true })
  passwordInvalid?: boolean;

  @Field({ nullable: true })
  fullNameInvalid?: boolean;
}
