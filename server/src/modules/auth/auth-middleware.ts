import {AuthChecker} from "type-graphql";
import {Role} from "../../../../shared/types/entity/User";


interface Context {
    userId: string;
    role: Role
}

export const authChecker: AuthChecker<Context> = ({ context: { userId, role } }, roles) => {


    if(roles.length === 0 && userId){
        return true
    }

    if(roles.includes(Role[role])){
        return true
    }

    return false
};