import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import Express from 'express';
import { createConnection } from 'typeorm';
import { User } from './entity/User';
import RegisterResolver from './modules/auth/register/register-resolver';
import { authChecker } from './modules/auth/auth-middleware';
require('dotenv').config();

const jwt = require('jsonwebtoken');

const app = Express();
let schema: any;

const connectToDb = async () => {
  try {
    await createConnection();
    console.log('Connected to database');
  } catch (e) {
    console.log('Connection to db failed \n', e);
  }
};

const stitchSchema = async () => {
  try {
    schema = await buildSchema({
      resolvers: [RegisterResolver],
      authChecker
    });
  } catch (e) {
    console.log('Failed to create schema', e);
  }
};

const initServer = async () => {
  await connectToDb();
  await stitchSchema();

  const apolloServer = new ApolloServer({
    context: async ({ req }) => {
      if (req.headers.authorization) {
        const token = req.headers.authorization.split('Bearer ')[1];
        if (token !== 'null') {
          const tokenInfo = jwt.verify(token, process.env.JWT_SECRET);
          if (Math.floor(Date.now() / 1000) < tokenInfo.exp) {
            const user = await User.findOne({ id: tokenInfo.id });
            if (user) {
              return { userId: tokenInfo.id, role: user.role };
            }
          }
        }
      }
      return {};
    },
    schema
  });

  apolloServer.applyMiddleware({
    app,
    cors: {
      credentials: true,
      origin: true
    },
    path: '/'
  });

  app.listen(process.env.PORT, () => {
    console.log('Server running on port', process.env.PORT);
  });
};

initServer();
