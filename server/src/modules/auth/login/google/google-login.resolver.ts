import { Arg, Args, createUnionType, Mutation, Query, Resolver } from 'type-graphql';
import { GoogleLoginErrors, GoogleLoginInput, GoogleLoginResponse } from './google-login.types';
import { plainToClass } from 'class-transformer';
import { OAuth2Client } from 'google-auth-library';
import { User } from '../../../../entity/User';
import { registerUserGoogle } from '../../register/google/google-regiter.resolver';
import { logUser } from '../tranditional/login.resolver';

const client = new OAuth2Client(process.env.GOOGLE_SIGN_IN_CLIENT_API_KEY);

const GoogleLoginResult = createUnionType({
  name: 'GoogleLoginResult',
  types: () => [GoogleLoginResponse, GoogleLoginErrors]
});

@Resolver()
export class GoogleLoginResolver {
  @Mutation(() => GoogleLoginResult)
  async googleLogin(@Args() { token }: GoogleLoginInput): Promise<typeof GoogleLoginResult> {
    return await client
      .verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_SIGN_IN_CLIENT_API_KEY as string
      })
      .then(async d => {
        const user = await User.findOne({ mail: d.payload.email });
        if (user) {
          if (d.payload.sub === user.googleId) {
            const loginResponse = logUser(user, d.payload.picture);
            return plainToClass(GoogleLoginResponse, { ...loginResponse });
          } else {
            return plainToClass(GoogleLoginErrors, { _tokenInvalid: true });
          }
        } else {
          const newUser = await registerUserGoogle(d);
          const loginResponse = logUser(newUser);
          return plainToClass(GoogleLoginResponse, { ...loginResponse });
        }
      })
      .catch(e => {
        console.log(e);
        return plainToClass(GoogleLoginErrors, { _tokenInvalid: true });
      });
  }
}
