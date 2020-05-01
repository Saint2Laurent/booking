import { Args, createUnionType, Ctx, Mutation, Query, Resolver, Arg } from 'type-graphql';
import { Context } from 'vm';
import { User } from '../../entity/User';
import fetch from 'nodemailer/lib/fetch';
import { UpdateUserErrors, UpdateUserResponse, UpdateUserInput } from './user.types';
import { plainToClass } from 'class-transformer';
import { updateUserValidation } from './user.validation';

const UpdateUserResult = createUnionType({
  name: 'UpdateUserResult',
  types: () => [UpdateUserResponse, UpdateUserErrors]
});

@Resolver()
export class UserResolver {
  @Query(() => User)
  async me(@Ctx() ctx: Context): Promise<User> {
    return ctx.user;
  }

  @Mutation(() => UpdateUserResult)
  async updateUser(
    @Args() { id, mail, fullName, password }: UpdateUserInput,
    @Ctx() ctx: Context
  ): Promise<typeof UpdateUserResult> {
    /**
     * User updating his own account
     */

    console.log(password);
    const errors: UpdateUserErrors = await updateUserValidation(id, ctx.id, mail, fullName, password);

    if (Object.keys(errors).length !== 0) {
      return plainToClass(UpdateUserErrors, errors);
    }

    await User.update(id, { mail, fullName, password });
    const user = await User.findOne({ id });
    console.log(user);

    return plainToClass(UpdateUserResponse, { user });
  }
}
