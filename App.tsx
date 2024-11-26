import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider as StoreProvider, useSelector, useDispatch } from 'react-redux';
import store from './Store';
import { checkAuth } from './redux/reducers/authReducer';

import SignIn from './Screens/Authentication/SignIn';
import SignUp from './Screens/Authentication/SignUp';
import AddAsset from './Screens/Asset/AddAsset';
import Navigation from './Navigation/Navigation';
// Import other screens as needed

const Stack = createStackNavigator();



const App = () => {
  return (
    <StoreProvider store={store}>
      <PaperProvider>
        <Navigation />
      </PaperProvider>
    </StoreProvider>
  );
};

export default App;
