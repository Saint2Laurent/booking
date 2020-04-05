import {AuthChecker} from "type-graphql";
import {Role} from "../../entity/User";
import {isEmpty} from "../../../../shared/utils/is-empty";


interface Context {
    userId: string;
    role: Role
}

export const authChecker: AuthChecker<Context> = ({ context: { userId, role } }, roles) => {

    console.log(userId)

    if(roles.length === 0 && userId){
        return true
    }

    if(roles.includes(Role[role])){
        return true
    }

    return false
};