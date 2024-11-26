import React from 'react';
import { Provider } from 'react-redux';
import { store } from './Redux/store';
import Navigation from './Navigation/Navigation';

export default function App() {
  return (
    <Provider store={store}>
      <Navigation />
    </Provider>
  );
}
