import { Args, createUnionType, Ctx, Mutation, Resolver } from 'type-graphql';

import { User } from '../../../../entity/User';
import { plainToClass } from 'class-transformer';
import { validateLoginRequest } from './login.validation';
import { LoginErrors, LoginInput, LoginResponse } from './login.types';
import { Context } from 'vm';

const _ = require('loadsh');

const RegisterResult = createUnionType({
  name: 'RegisterResult',
  types: () => [LoginResponse, LoginErrors]
});

export const logUser = (user: User, profileImgUrl?: string): LoginResponse => {
  if (profileImgUrl) {
    user.profileImageUrl = profileImgUrl;
  }

  const jwt = require('jsonwebtoken');
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.TOKEN_EXPIRES_AFTER });
  return plainToClass(LoginResponse, { user: user, token: token });
};

@Resolver()
export class LoginResolver {
  @Mutation(() => RegisterResult)
  async loginUser(@Args() { mail, password }: LoginInput): Promise<typeof RegisterResult> {
    const loginErrors: LoginErrors = await validateLoginRequest({ mail, password });
    if (Object.keys(loginErrors).length === 0) {
      const user = await User.findOne({ mail });
      return logUser(user!);
    }

    return plainToClass(LoginErrors, loginErrors);
  }
}
