import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema, formatArgumentValidationError } from 'type-graphql';
import Express from 'express';
import { createConnection } from 'typeorm';
import { User } from './entity/User';
import AuthResolver from './modules/auth/auth-resolver';
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
      resolvers: [AuthResolver]
    });
  } catch (e) {
    console.log('Failed to create schema', e);
  }
};

const initServer = async () => {
  await connectToDb();
  await stitchSchema();

  const apolloServer = new ApolloServer({ schema, formatError: formatArgumentValidationError });
  apolloServer.applyMiddleware({ app });

  app.listen(process.env.PORT, () => {
    console.log('Server running on port', process.env.PORT);
  });
};

initServer();
