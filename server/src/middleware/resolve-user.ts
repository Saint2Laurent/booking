import { User } from '../entity/User';
const jwt = require('jsonwebtoken');

export const resolveUser = async ({ req }: any) => {
  let ctx = {};
  let token = req.headers.authorization;
  if (token && token.split('Bearer ')[1] && token !== 'Bearer null') {
    const tokenInfo = jwt.verify(token.split('Bearer ')[1], process.env.JWT_SECRET);
    if (tokenInfo) {
      if (Math.floor(Date.now() / 1000) < tokenInfo.exp) {
        await User.findOne({ id: tokenInfo.id })
          .then(user => {
            ctx = { user };
          })
          .catch(e => {
            console.log(e);
          });
      }
    }
  }

  return ctx;
};
