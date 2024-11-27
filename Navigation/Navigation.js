import { StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useSelector, useDispatch } from 'react-redux';

// Screens
import OverView from '../Screens/OverView/OverView';
import WorkOrder from '../Screens/WorkOrder/WorkOrder';
import Asset from '../Screens/Asset/index';
import More from '../Screens/More/More';
import LandingScreen from '../Screens/LandingScreen/LandingScreen';
import Procedure from '../Screens/Procedure/Procedure';
import Options from '../Screens/Procedure/Options';
import AssetAdd from '../Screens/Asset/AssetAdd';
import LocationAdd from '../Screens/Asset/LocationAdd';
import NewWorkOrder from '../Screens/WorkOrder/WorkOrder';
import AddAsset from '../Screens/Asset/AddAsset';
import Vendors from '../Screens/Vendors/Vendors';
import AssetsTabNavigator from '../Screens/Asset/index';
import SignIn from '../Screens/Authentication/SignIn';
import SignUp from '../Screens/Authentication/SignUp';

// Redux actions
import { checkAuth } from '../redux/reducers/authReducer';
import WorkOrderListing from '../Screens/WorkOrder/WorkOrderListing';
import TaskDetailsScreen from '../Screens/WorkOrder/TaskDetails';
import AssignTo from '../Screens/WorkOrder/AssignTo/AssignTo';
import InviteScreen from '../Screens/WorkOrder/AssignTo/InviteScreen';
import ManualInviteScreen from '../Screens/WorkOrder/AssignTo/ManualInvite';
import CustomerSelectionPage from '../Screens/Customer/CustomerSelectionPage';
import RecurrenceScreen from '../Screens/Recurrence/RecurrenceModal';
import AssetListingPage from '../Screens/Asset/AssetListing';
import LocationScreen from '../Screens/Asset/LocationScreen';

export default function Navigation() {
    const Stack = createStackNavigator();
    const Tab = createBottomTabNavigator();
    // Authentication stack
    const AuthStack = () => (
        <Stack.Navigator>
            <Stack.Screen
                name="SignIn"
                component={SignIn}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="SignUp"
                component={SignUp}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );

    // Tab navigator
    const Tabs = () => (
        <Tab.Navigator>
            <Tab.Screen
                name="Overview"
                component={OverView}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="home" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="Work Orders"
                component={WorkOrder}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="clipboard" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="Assets"
                component={Asset}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="cogs" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="More"
                component={More}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="ellipsis-h" color={color} size={size} />
                    ),
                }}
            />
        </Tab.Navigator>
    );

    // Main stack
    const MainStack = () => (
        <Stack.Navigator>
            <Stack.Screen
                name="MoreScreen"
                component={LandingScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Tabs"
                component={Tabs}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Procedure"
                component={Procedure}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Options"
                component={Options}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Assets"
                component={AssetsTabNavigator}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="AssetsAdd"
                component={AddAsset}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="LocationAdd"
                component={LocationAdd}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="WorkOrderAdd"
                component={NewWorkOrder}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="WorkOrderListing"
                component={WorkOrderListing}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Vendors"
                component={Vendors}
                options={{ headerShown: false }}
            />
             <Stack.Screen
                name="WorkOrderDetails"
                component={TaskDetailsScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="AssignTo"
                component={AssignTo}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="InviteScreen"
                component={InviteScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="ManualInvite"
                component={ManualInviteScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="customerSelect"
                component={CustomerSelectionPage}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="recurrence"
                component={RecurrenceScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="AssetListing"
                component={AssetsTabNavigator}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );

    // App content
    const AppContent = () => {
        const dispatch = useDispatch();
        const user = useSelector((state) => state.auth.user);
        const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

        useEffect(() => {
            dispatch(checkAuth());
            // dispatch({ type: 'RESET_STORE' });
        }, [dispatch]);

        return (
            <NavigationContainer>
                {isAuthenticated ? <MainStack /> : <AuthStack />}
            </NavigationContainer>
        );
    };

    return <AppContent />;
}

const styles = StyleSheet.create({});
