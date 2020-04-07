import { Query, Resolver, Arg, Mutation, Args, createUnionType } from 'type-graphql';
import { plainToClass } from 'class-transformer';
import { User } from '../../../entity/User';
import { LoginResponse, RegistrationInput, RegistrationErrors, RegistrationResponse } from '../auth-responses';
import { RegisterConfirmation } from '../../../entity/RegisterConfirmation';
import { v4 as uuid } from 'uuid';
import { sendConfirmationMail } from '../../../utils/mail/mailer';
import { validateRegisterRequest } from './register-validations';
import { logUser } from '../login/login-resolver';
const argon2 = require('argon2');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const _ = require('loadsh');

const RegisterResult = createUnionType({
  name: 'RegisterResponse',
  types: () => [RegistrationResponse, RegistrationErrors]
});

function sleep(ms: number) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

@Resolver()
export class RegisterResolver {
  @Query(() => Boolean)
  async isUserRegistered(@Arg('mail') mail: string) {
    const user = await User.findOne({ mail });
    if (user) {
      return true;
    }
    return false;
  }

  @Mutation(() => RegisterResult)
  async registerUser(@Args() { fullName, mail, password }: RegistrationInput): Promise<typeof RegisterResult> {
    await sleep(750);
    const user = await User.findOne({ mail: mail });
    console.log(fullName);
    let registrationErrors: RegistrationErrors = validateRegisterRequest({ fullName, mail, password }, user);

    if (_.some(registrationErrors)) {
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
