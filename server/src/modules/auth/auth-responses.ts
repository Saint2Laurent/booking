import { ArgsType, Field, ObjectType } from 'type-graphql';
import {User} from "../../entity/User";

@ArgsType()
export class LoginInput {
  @Field()
  mail: string;

  @Field()
  password: string;
}

@ObjectType()
export class LoginResponse {
  @Field()
  user: User;

  @Field()
  token: string;
}

@ObjectType()
  export class LoginErrors {
    @Field({nullable: true})
    passwordInvalid?: boolean;

    @Field({nullable: true})
    notRegistered?: boolean
}

@ObjectType()
export class RegistrationErrors {
  @Field({ nullable: true })
  hashingFailed?: string;

  @Field({ nullable: true })
  mailInvalid?: boolean;

  @Field({ nullable: true })
  mailExists?: boolean;

  @Field({ nullable: true })
  mailNeedsConfirmation?: boolean;

  @Field({ nullable: true })
  passwordInvalid?: boolean;

  @Field({ nullable: true })
  fullNameInvalid?: boolean;
}

@ObjectType()
export class RegistrationResponse {
  @Field()
  success: boolean;

  @Field()
  loginResponse: LoginResponse

}

@ArgsType()
export class RegisterInput {
  @Field()
  fullName: string;

  @Field()
  mail: string;

  @Field()
  password: string;
}
