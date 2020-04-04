import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import ApolloClient, { InMemoryCache } from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import { Provider } from 'react-redux';
import store from './store/store';

import { IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import introspectionQueryResultData from './fragmentTypes.json';

const fragmentMatcher = new IntrospectionFragmentMatcher({

    introspectionQueryResultData
});

const client = new ApolloClient({
    cache: new InMemoryCache({
        fragmentMatcher
    }),
    uri: 'http://localhost:4000/',
});

ReactDOM.render(
  <Provider store={store}>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </Provider>,
  document.getElementById('root')
);
