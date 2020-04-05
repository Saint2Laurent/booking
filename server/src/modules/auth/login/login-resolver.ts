import {Args, createUnionType, Mutation, Resolver} from "type-graphql";
import {LoginErrors, LoginInput, LoginResponse, RegistrationErrors, RegistrationResponse} from "../auth-responses";
import {User} from "../../../entity/User";
import {plainToClass} from "class-transformer";
import {validateLoginRequest} from "./login-validations";

const _ = require('loadsh')


const RegisterResult = createUnionType({
    name: 'LoginResult',
    types: () => [LoginResponse, LoginErrors]
});

export const logUser = (user: User): LoginResponse => {
    const jwt = require('jsonwebtoken')
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {expiresIn: process.env.TOKEN_EXPIRES_AFTER});
    return plainToClass(LoginResponse, {user: user, token: token})
}

@Resolver()
export class LoginResolver {

    @Mutation(()=> RegisterResult)
    async loginUser(@Args() {mail, password}: LoginInput): Promise<typeof RegisterResult>{
        const loginErrors: LoginErrors = await validateLoginRequest({mail, password})

        if(!_.some(loginErrors)){
            const user = await User.findOne({mail})
            return logUser(user!)
        }

        return plainToClass(LoginErrors, loginErrors)
    }
}