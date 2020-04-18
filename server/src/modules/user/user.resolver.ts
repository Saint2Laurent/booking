import { Args, Ctx, Query, Resolver } from 'type-graphql';
import { Context } from 'vm';
import { User } from '../../entity/User';
import fetch from 'nodemailer/lib/fetch';

@Resolver()
export class UserResolver {
  @Query(() => User)
  async me(@Ctx() ctx: Context): Promise<User> {
    return ctx.user;
  }
}
