import { ArgsType, Field, ObjectType } from 'type-graphql';
import {
  RequestPasswordResetResponse as RequestPasswordResetResponseInterface,
  RequestPasswordResetErrors as RequestPasswordResetErrorsInterface,
  RequestPasswordResetInput as RequestPasswordResetInputInterface
} from '../../../../../../shared/types/api/auth/request-password-reset';

@ObjectType()
export class RequestPasswordResetResponse implements RequestPasswordResetResponseInterface {
  @Field()
  success: boolean;
}

@ObjectType()
export class RequestPasswordResetErrors implements RequestPasswordResetErrorsInterface {
  @Field({ nullable: true })
  mailInvalid?: boolean;

  @Field({ nullable: true })
  _mailNotRegistered?: boolean;

  @Field({ nullable: true })
  _tooManyAttempts?: boolean;

  @Field({ nullable: true })
  _failedToSend?: boolean;
}

@ArgsType()
export class RequestPasswordResetInput implements RequestPasswordResetInputInterface {
  @Field()
  mail: string;
}
