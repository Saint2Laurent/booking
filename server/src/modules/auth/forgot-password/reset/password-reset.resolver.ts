import { Args, createUnionType, Mutation, Resolver } from 'type-graphql';
import { PasswordResetErrors, PasswordResetInput, PasswordResetResponse } from './password-reset.types';
import { plainToClass } from 'class-transformer';
import { validatePasswordReset } from './password-reset.validation';
import { PasswordResetToken } from '../../../../entity/PasswordResetToken';
import { User } from '../../../../entity/User';
const argon2 = require('argon2');

const PasswordResetResult = createUnionType({
  name: 'PasswordReset',
  types: () => [PasswordResetResponse, PasswordResetErrors]
});

@Resolver()
export class PasswordResetResolver {
  @Mutation(() => PasswordResetResult)
  async passwordReset(@Args() { token, password }: PasswordResetInput): Promise<typeof PasswordResetResult> {
    const errors: PasswordResetErrors = await validatePasswordReset(token, password);
    if (Object.keys(errors).length !== 0) {
      return plainToClass(PasswordResetErrors, errors);
    }

    const hashedPassword = await argon2.hash(password);
    const tokenRecord = await PasswordResetToken.findOne({ token: token });
    const user = await User.findOne({ id: tokenRecord!.userId });
    user!.password = hashedPassword;
    await PasswordResetToken.delete({ id: tokenRecord!.id });
    await User.save(user!);
    return plainToClass(PasswordResetResponse, { success: true });
  }
}
