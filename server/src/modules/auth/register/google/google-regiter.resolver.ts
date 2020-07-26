import { LoginTicket } from 'google-auth-library';
import { User } from '../../../../entity/User';

const argon2 = require('argon2');

export const registerUserGoogle = async (ticket: LoginTicket): Promise<User | null> => {

  const payload = ticket.getPayload()

  if(payload){
    return await User.create({
      fullName: payload.name,
      mail: payload.email,
      password: await argon2.hash(payload.iss),
      isConfirmed: true,
      isGoogle: true,
      googleId: payload.sub,
      profileImageUrl: payload.picture
    }).save();
  }

  return null


};
