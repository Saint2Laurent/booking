import { ArgsType, Field, ObjectType } from 'type-graphql';

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
