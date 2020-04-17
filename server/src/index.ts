import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import Express from 'express';
import { createConnection } from 'typeorm';
import { User } from './entity/User';
import RegisterResolver from './modules/auth/register/tranditional/register.resolver';
import { authUserMiddleware } from './middleware/auth-user-middleware';
import { RequestPasswordResetResolver } from './modules/auth/forgot-password/reset-request/request-password-reset.resolver';
import { PasswordResetResolver } from './modules/auth/forgot-password/reset/password-reset.resolver';
import { GoogleLoginResolver } from './modules/auth/login/google/google-login.resolver';
import { ResolveUserMiddleware } from './middleware/resolve-user-middleware';
import { resolveUser } from './middleware/resolve-user';
import { UserResolver } from './modules/user/user.resolver';
require('dotenv').config();

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
      resolvers: [
        RegisterResolver,
        RequestPasswordResetResolver,
        PasswordResetResolver,
        GoogleLoginResolver,
        UserResolver
      ],
      globalMiddlewares: [ResolveUserMiddleware],

      authChecker: authUserMiddleware
    });
  } catch (e) {
    console.log('Failed to create schema', e);
  }
};

const initServer = async () => {
  await connectToDb();
  await stitchSchema();

  const apolloServer = new ApolloServer({
    context: resolveUser,
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

  app.listen(process.env.PORT);
};

initServer()
  .then(() => {
    console.log('Server running at port ', process.env.PORT);
  })
  .catch(e => {
    console.log('Server failed to initialize', e);
  });
