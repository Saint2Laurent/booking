import {User} from "../../../entity/User";
import {RegistrationErrors} from "../auth-responses";
import {plainToClass} from "class-transformer";
const zxcvbn = require('zxcvbn');
const validator = require('validator')

interface RegistrationArgs {
    fullName: string;
    password: string;
    mail: string;
}

export const validateRegisterRequest = (credentials: RegistrationArgs, user?: User): RegistrationErrors => {
    const registrationErrors: RegistrationErrors = {};
    const { password, mail, fullName } = credentials;

    if (user) {
        if (!user.isConfirmed) {
            registrationErrors.mailNeedsConfirmation = true;
        } else {
            registrationErrors.mailExists = true;
        }
    }

    if (zxcvbn(credentials.password).score < 2) {
        registrationErrors.passwordInvalid = true;
    }

    if (!validator.isEmail(mail)) {
        registrationErrors.mailInvalid = true;
    }

    if (!/[^%]{3,}/g.test(fullName)) {
        registrationErrors.fullNameInvalid = true;
    }

    return registrationErrors
}