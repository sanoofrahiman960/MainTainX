import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider as StoreProvider, useSelector, useDispatch } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './redux/store';
import { checkAuth } from './redux/reducers/authReducer';

import SignIn from './Screens/Authentication/SignIn';
import SignUp from './Screens/Authentication/SignUp';
import AddAsset from './Screens/Asset/AddAsset';
import Navigation from './Navigation/Navigation';
import AppContent from './Navigation/Navigation';
// Import other screens as needed

const Stack = createStackNavigator();



const App = () => {
  return (
    <StoreProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PaperProvider>
          <AppContent />
        </PaperProvider>
      </PersistGate>
    </StoreProvider>
  );
};

export default App;