import {LoginErrors} from "../auth-responses";
import {plainToClass} from "class-transformer";
import {User} from "../../../entity/User";
const argon2 = require('argon2');

interface LoginArgs{
    mail: string;
    password: string;
}

export const validateLoginRequest = async ({mail, password}: LoginArgs):Promise<LoginErrors> => {
    const user = await User.findOne({mail})
    if(user){
        const passwordMatched = await argon2.verify(user.password, password)
        if(passwordMatched){
            return plainToClass(LoginErrors, {})
        }else{
            return plainToClass(LoginErrors, {passwordInvalid: true})
        }
    }else{
        return plainToClass(LoginErrors, {notRegistered: true})
    }
}