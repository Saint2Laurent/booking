import { LoginTicket } from 'google-auth-library';
import { User } from '../../../../entity/User';

const argon2 = require('argon2');

export const registerUserGoogle = async (ticket: LoginTicket): Promise<User> => {
  const user = await User.create({
    fullName: ticket.payload.name,
    mail: ticket.payload.email,
    password: await argon2.hash(ticket.payload.iss),
    isConfirmed: true,
    isGoogle: true,
    googleId: ticket.payload.sub
  }).save();

  return user;
};
