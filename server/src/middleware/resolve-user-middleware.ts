import { MiddlewareFn } from 'type-graphql';
import { User } from '../entity/User';
const jwt = require('jsonwebtoken');

export const ResolveUserMiddleware: MiddlewareFn = async ({ info, args, context }, next) => {
  // let token = args.token;
  // console.log(info);
  // if (token && token !== 'Bearer undefined' && token !== '') {
  //   const tokenInfo = jwt.verify(token, process.env.JWT_SECRET);
  //   if (tokenInfo) {
  //     if (Math.floor(Date.now() / 1000) < tokenInfo.exp) {
  //       await User.findOne({ id: tokenInfo.id })
  //         .then(user => {
  //           context = { userId: tokenInfo.id, role: user!.role };
  //         })
  //         .catch(e => {
  //           console.log(e);
  //         });
  //     }
  //   }
  // }
  return next();
};
