import { Args, createUnionType, Ctx, Mutation, Query, Resolver, Arg } from 'type-graphql';
import { Context } from 'vm';
import { User } from '../../entity/User';
import fetch from 'nodemailer/lib/fetch';
import { UpdateUserErrors, UpdateUserResponse, UpdateUserInput } from './user.types';
import { plainToClass } from 'class-transformer';

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
  async updateUser(@Arg('UpdateInputType') user: UpdateUserInput): Promise<typeof UpdateUserResult> {
    // console.log(user.id, ctx.id);

    return plainToClass(UpdateUserErrors, {});
  }
}
