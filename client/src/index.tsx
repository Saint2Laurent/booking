import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ApolloProvider } from 'react-apollo';
import { Provider } from 'react-redux';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import introspectionQueryResultData from './fragmentTypes.json';
import ApolloClient from 'apollo-client';
import { ApolloLink, Observable } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './store/store';

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData
});

const headerLink = setContext((request, previousContext) => ({
  headers: {
    ...previousContext.headers,
    authorization: 'Bearer ' + localStorage.getItem('token')
  }
}));

const client = new ApolloClient({
  cache: new InMemoryCache({
    fragmentMatcher
  }),
  link: new HttpLink({
    uri: 'http://localhost:4000/graphql',
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token')
    }
  }).concat(headerLink)
});

ReactDOM.render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </PersistGate>
  </Provider>,
  document.getElementById('root')
);
