/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React from 'react';
import { StyleSheet, useColorScheme } from 'react-native';
import Navigation from './Navigation/Navigation';
<<<<<<< HEAD
import store from "./Store";
import { Provider } from 'react-redux';
=======
import store from "./Store"
import { Provider } from 'react-redux'
import { Provider as PaperProvider } from 'react-native-paper';




>>>>>>> c29c0c6 (procedure)
function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    
    <Provider store={store}>
      <PaperProvider>
        <Navigation />
      </PaperProvider>
    </Provider>
  );
}
const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
