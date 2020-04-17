import { Args, Ctx, Query, Resolver } from 'type-graphql';
import { Context } from 'vm';
import { User } from '../../entity/User';

@Resolver()
export class UserResolver {
  @Query(() => User)
  async me(@Ctx() ctx: Context): Promise<User> {
    return ctx.user;
  }
}
