import { Query, Resolver, Arg, Mutation, Args, createUnionType } from 'type-graphql';
import { plainToClass } from 'class-transformer';
import { User } from '../../entity/User';
import { RegisterInput, RegistrationErrors, RegistrationResponse } from './auth-responses';
import { RegisterConfirmation } from '../../entity/RegisterConfirmation';
import { v4 as uuid } from 'uuid';
import { sendConfirmationMail } from '../../utils/mail/mailer';
const argon2 = require('argon2');
const bcrypt = require('bcryptjs');
const zxcvbn = require('zxcvbn');
const validator = require('validator');
const _ = require('loadsh');

const RegisterResponse = createUnionType({
  name: 'SearchResult', // the name of the GraphQL union
  types: () => [RegistrationResponse, RegistrationErrors] // function that returns array of object types classes
});

@Resolver()
export class AuthResolver {
  @Query(() => String)
  async recipes() {
    return '';
  }

  @Mutation(() => RegisterResponse)
  async registerUser(@Args() { fullName, mail, password }: RegisterInput): Promise<typeof RegisterResponse> {
    const registrationErrors: RegistrationErrors = {};
    const user = await User.findOne({ mail: mail });
    if (user) {
      if (!user.isConfirmed) {
        registrationErrors.mailNeedsConfirmation = true;
      } else {
        registrationErrors.mailExists = true;
      }
    }

    if (zxcvbn(password).score < 3) {
      registrationErrors.passwordInvalid = true;
    }

    if (!validator.isEmail(mail)) {
      registrationErrors.mailInvalid = true;
    }

    if (!/[^%]{3,}/g.test(fullName)) {
      registrationErrors.fullNameInvalid = true;
    }

    if (_.some(registrationErrors)) {
      return plainToClass(RegistrationErrors, registrationErrors);
    }

    const hashedPassword = await argon2.hash(password);
    const newUser = await User.create({ mail, password: hashedPassword, fullName }).save();
    const confirmation = await RegisterConfirmation.create({ mail, token: uuid() }).save();

    sendConfirmationMail(newUser, confirmation.token);
    return plainToClass(RegistrationResponse, { success: true });
  }
}

export default AuthResolver;
