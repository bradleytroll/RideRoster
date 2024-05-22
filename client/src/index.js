import React from 'react';
import { createRoot } from 'react-dom/client';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import App from './App';

const client = new ApolloClient({
  uri: 'http://localhost:4001/graphql', // Make sure this matches the port your backend is running on
  cache: new InMemoryCache()
});

const container = document.getElementById('root');
const root = createRoot(container); // Create a root.

root.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
