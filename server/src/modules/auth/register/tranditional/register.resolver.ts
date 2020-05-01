import { Query, Resolver, Arg, Mutation, Args, createUnionType } from 'type-graphql';
import { plainToClass } from 'class-transformer';
import { User } from '../../../../entity/User';
import { RegisterConfirmation } from '../../../../entity/RegisterConfirmation';
import { v4 as uuid } from 'uuid';
import { validateRegisterRequest } from './register.validation';
import { logUser } from '../../login/tranditional/login.resolver';
import { RegistrationErrors, RegistrationInput, RegistrationResponse } from './register.types';
import { Branch } from '../../../../entity/Branch';
const argon2 = require('argon2');
const _ = require('loadsh');

const RegisterResult = createUnionType({
  name: 'RegisterResponse',
  types: () => [RegistrationResponse, RegistrationErrors]
});

@Resolver()
export class RegisterResolver {
  @Query(() => Boolean)
  async isUserRegistered(@Arg('mail') mail: string) {
    const user = await User.findOne({ mail });
    return !!user;
  }

  @Mutation(() => RegisterResult)
  async registerUser(@Args() { fullName, mail, password }: RegistrationInput): Promise<typeof RegisterResult> {
    const user = await User.findOne({ mail: mail });
    console.log(fullName);
    let registrationErrors: RegistrationErrors = validateRegisterRequest({ fullName, mail, password }, user);
    if (Object.keys(registrationErrors).length !== 0) {
      return plainToClass(RegistrationErrors, registrationErrors);
    }

    const hashedPassword = await argon2.hash(password);
    const newUser = await User.create({ mail, password: hashedPassword, fullName }).save();

    const confirmation = await RegisterConfirmation.create({ mail, token: uuid() }).save();
    // sendConfirmationMail(newUser, confirmation.token);

    return plainToClass(RegistrationResponse, { success: true, loginResponse: logUser(newUser) });
  }
}

export default RegisterResolver;
