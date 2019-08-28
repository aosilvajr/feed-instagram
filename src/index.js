import React from 'react';
import { StatusBar } from 'react-native';

// import { Container } from './styles';

import Routes from './routes';

export default function App() {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />
      <Routes />
    </>
  );
}
