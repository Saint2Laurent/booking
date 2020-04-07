import { Args, createUnionType, Mutation, Resolver } from 'type-graphql';
import { RequestPasswordResetErrors, RequestPasswordResetInput, RequestPasswordResetResponse } from '../auth-responses';
import { plainToClass } from 'class-transformer';
import { validateRequestPasswordReset } from './validate-request-password-reset';
import { User } from '../../../entity/User';
import { sendPasswordResetMail } from '../../../utils/mail/mailer';
import { PasswordReset } from '../../../entity/PasswordReset';
import { v4 as uuid } from 'uuid';
const _ = require('loadsh');

const RequestPasswordResetResult = createUnionType({
  name: 'RequestPasswordReset',
  types: () => [RequestPasswordResetResponse, RequestPasswordResetErrors]
});

@Resolver()
export class RequestPasswordResetResolver {
  @Mutation(() => RequestPasswordResetResult)
  async requestPasswordReset(@Args() { mail }: RequestPasswordResetInput): Promise<typeof RequestPasswordResetResult> {
    const user = await User.findOne({ mail });

    const errors = await validateRequestPasswordReset(mail, user);
    if (_.some(errors)) {
      return plainToClass(RequestPasswordResetErrors, errors);
    }

    let date = new Date();
    const reset = await PasswordReset.create({
      userId: user!.id,
      token: uuid(),
      expiresAt: new Date(date.setMinutes(date.getMinutes() + 315))
    }).save();

    const mailSent = await sendPasswordResetMail(user!, reset.token);
    console.log(mailSent);
    // const mailSent = true;

    if (!mailSent) {
      return plainToClass(RequestPasswordResetErrors, { _failedToSend: true });
    }

    return plainToClass(RequestPasswordResetResponse, { success: true });
  }
}
