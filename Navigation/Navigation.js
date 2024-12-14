// import { StyleSheet } from 'react-native';
// import React, { useEffect } from 'react';
// import { createStackNavigator } from '@react-navigation/stack';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { NavigationContainer } from '@react-navigation/native';
// import Icon from 'react-native-vector-icons/FontAwesome';
// import { useSelector, useDispatch } from 'react-redux';

// // Screens
// import OverView from '../Screens/OverView/OverView';
// import WorkOrder from '../Screens/WorkOrder/WorkOrder';
// import Asset from '../Screens/Asset/index';
// import More from '../Screens/More/More';
// import LandingScreen from '../Screens/LandingScreen/LandingScreen';
// import Procedure from '../Screens/Procedure/Procedure';
// import Options from '../Screens/Procedure/Options';
// import AssetAdd from '../Screens/Asset/AssetAdd';
// import LocationAdd from '../Screens/Asset/LocationAdd';
// import NewWorkOrder from '../Screens/WorkOrder/WorkOrder';
// import AddAsset from '../Screens/Asset/AddAsset';
// import Vendors from '../Screens/Vendors/Vendors';
// import AssetsTabNavigator from '../Screens/Asset/index';
// import AssetDetail from '../Screens/Asset/AssetDetail';
// import LocationDetails from '../Screens/Asset/LocationDetails';
// import Home from '../Screens/Home/Home';
// import WorkOrderDetails from '../Screens/WorkOrder/WorkOrderDetails';
// import SignIn from '../Screens/Authentication/SignIn';
// import SignUp from '../Screens/Authentication/SignUp';
// import EditWorkOrder from '../Screens/WorkOrder/EditWorkOrder';

// // Redux actions
// import { checkAuth } from '../redux/reducers/authReducer';
// import LocationScreen from '../Screens/Asset/LocationScreen';
// import AssetScreen from '../Screens/Asset/AssetScreen';
// import Parts from '../Screens/Parts/Parts';
// import WorkOrderView from '../Screens/WorkOrder/WorkOrderView';
// // import WorkOrderListing from '../Screens/WorkOrder/WorkOrderListing';

// // export default function Navigation() {
// //     const Stack = createStackNavigator();

// //     return (
// //         <NavigationContainer>
// //             <Stack.Navigator>
// //                 <Stack.Screen name="MoreScreen" component={LandingScreen} options={{ headerShown: false }} />
// //                 <Stack.Screen name="Tabs" component={tabs} options={{ headerShown: false }} />
// //                 <Stack.Screen name="Procedure" component={Procedure} options={{ headerShown: false }} />
// //                 <Stack.Screen name="Options" component={Options} options={{ headerShown: false }} />
// //                 <Stack.Screen name="Assets" component={AssetsTabNavigator} options={{ headerShown: false }} />
// //                 {/* <Stack.Screen name="AssetsAdd" component={AssetAdd} options={{ headerShown: false }} /> */}
// //                 <Stack.Screen name="AssetsAdd" component={AddAsset} options={{ headerShown: false }} />
// //                 <Stack.Screen name="LocationAdd" component={LocationAdd} options={{ headerShown: false }} />
// //                 <Stack.Screen name="WorkOrderAdd" component={NewWorkOrder} options={{ headerShown: false }} />
// //                 <Stack.Screen name="Vendors" component={Vendors} options={{ headerShown: false }} />
              
// //             </Stack.Navigator>
// //         </NavigationContainer>
// //     )
// // }




// // const tabs = () => {
//     const Tab = createBottomTabNavigator();
//     const Stack = createStackNavigator();
//     // Authentication stack
//     const AuthStack = () => (
//         <Stack.Navigator>
//               <Stack.Screen name="ServerConnection" component={ServerConnectionSettings} />
//               <Stack.Screen name="LoginMaster" component={LoginMasterScreen} />
//             <Stack.Screen
//                 name="SignIn"
//                 component={SignIn}
//                 options={{ headerShown: false }}
//             />
//             <Stack.Screen
//                 name="SignUp"
//                 component={SignUp}
//                 options={{ headerShown: false }}
//             />
//         </Stack.Navigator>
//     );

//     // Tab navigator
//     const Tabs = () => (
//         <Tab.Navigator>
//             <Tab.Screen
//                 name="Overview"
//                 component={OverView}
//                 options={{
//                     headerShown: false,
//                     tabBarIcon: ({ color, size }) => (
//                         <Icon name="home" color={color} size={size} />
//                     ),
//                 }}
//             />
//             <Tab.Screen
//                 name="WorkOrders"
//                 component={WorkOrderView}
//                 options={{
//                     headerShown: false,
//                     tabBarIcon: ({ color, size }) => (
//                         <Icon name="clipboard" color={color} size={size} />
//                     ),
//                 }}
//             />
//             <Tab.Screen
//                 name="Assets"
//                 component={Asset}
//                 options={{
//                     headerShown: false,
//                     tabBarIcon: ({ color, size }) => (
//                         <Icon name="cogs" color={color} size={size} />
//                     ),
//                 }}
//             />
//             <Tab.Screen
//                 name="More"
//                 component={More}
//                 options={{
//                     headerShown: false,
//                     tabBarIcon: ({ color, size }) => (
//                         <Icon name="ellipsis-h" color={color} size={size} />
//                     ),
//                 }}
//             />
//         </Tab.Navigator>
//     );

//     // Main stack
//     const MainStack = () => (
//         <Stack.Navigator>
//             <Stack.Screen
//                 name="MoreScreen"
//                 component={LandingScreen}
//                 options={{ headerShown: false }}
//             />
//             <Stack.Screen
//                 name="Tabs"
//                 component={Tabs}
//                 options={{ headerShown: false }}
//             />
//             <Stack.Screen
//                 name="Procedure"
//                 component={Procedure}
//                 options={{ headerShown: false }}
//             />
//             <Stack.Screen
//                 name="Options"
//                 component={Options}
//                 options={{ headerShown: false }}
//             />
//             <Stack.Screen
//                 name="Assets"
//                 component={AssetsTabNavigator}
//                 options={{ headerShown: false }}
//             />
//              <Stack.Screen
//                 name="Asset"
//                 component={AssetScreen}
//                 options={{ headerShown: false }}
//             />
//             <Stack.Screen
//                 name="AssetsAdd"
//                 component={AddAsset}
//                 options={{ headerShown: false }}
//             />
//               <Stack.Screen
//                 name="Location"
//                 component={LocationScreen}
//                 options={{ headerShown: false }}
//             />
//             <Stack.Screen
//                 name="LocationAdd"
//                 component={LocationAdd}
//                 options={{ headerShown: false }}
//             />
//             <Stack.Screen
//                 name="WorkOrderAdd"
//                 component={NewWorkOrder}
//                 options={{ headerShown: false }}
//             />
//             <Stack.Screen
//                 name="Vendors"
//                 component={Vendors}
//                 options={{ headerShown: false }}
//             />
//               <Stack.Screen
//                   name="AssetDetails"
//                   component={AssetDetail}
//                   options={{ headerShown: false }}
//                 />
//                 <Stack.Screen
//                   name="LocationDetails"
//                   component={LocationDetails}
//                   options={{ headerShown: false }}
//                 />
//                 <Stack.Screen
//                   name="Home"
//                   component={Home}
//                   options={{ headerShown: false }}
//                 />
//                 <Stack.Screen
//                   name="NewWorkOrder"
//                   component={NewWorkOrder}
//                   options={{ headerShown: false }}
//                 />
//                 <Stack.Screen
//                   name="WorkOrderDetails"
//                   component={WorkOrderDetails}
//                   options={{ headerShown: false }}
//                 />
//                  <Stack.Screen
//                   name="Parts"
//                   component={Parts}
//                   options={{ headerShown: false }}
//                 />
//                    <Stack.Screen
//                   name="WorkListing"
//                   component={WorkOrder}
//                   options={{ headerShown: false }}
//                 />
//                 <Stack.Screen
//                   name="EditWorkOrder"
//                   component={EditWorkOrder}
//                   options={{ headerShown: false }}
//                 />
//         </Stack.Navigator>
//     );

//     // App content
//     const dispatch = useDispatch();
//     const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
//     const serverUrl = useSelector((state) => state.auth.serverUrl);

//     useEffect(() => {
//         dispatch(checkAuth());  
//     }, [dispatch]);

//     if (!isAuthenticated) {
//         if (serverUrl) {
//             return <AuthStack initialRouteName="LoginMaster" />;
//         } else {
//             return <AuthStack initialRouteName="ServerConnection" />;
//         }
//     }

//     return <MainStack />;

//     // return <AppContent />;
// // }

// export default function Navigation() {
//     return (
//         <NavigationContainer>
//             <AppContent />
//         </NavigationContainer>
//     );
// }


import { StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
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
import AssetDetail from '../Screens/Asset/AssetDetail';
import LocationDetails from '../Screens/Asset/LocationDetails';
import Home from '../Screens/Home/Home';
import WorkOrderDetails from '../Screens/WorkOrder/WorkOrderDetails';
import SignIn from '../Screens/Authentication/SignIn';
import SignUp from '../Screens/Authentication/SignUp';
import { checkAuth } from '../redux/reducers/authReducer';
import LoginMasterScreen from '../Screens/ServerConnection/LoginMasterScreen';
import UrlSelectionScreen from '../Screens/ServerConnection/UrlSelectionScreen';
import * as asyncCache from '../Util/Storage';
import WorkOrderView from '../Screens/WorkOrder/WorkOrderView';
// import ServerConnectionSettings from '../Screens/ServerConnection/ServerConnectionSettings';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Authentication stack
const AuthStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="ServerConnection" component={UrlSelectionScreen} />
        <Stack.Screen name="LoginMaster" component={LoginMasterScreen} />
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="Main" component={MainStack} />
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
            component={WorkOrderView}
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
    <Stack.Navigator initialRouteName='Tabs' screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MoreScreen" component={LandingScreen} />
        <Stack.Screen name="AuthStack" component={AuthStack} />
        <Stack.Screen name="Tabs" component={Tabs} />
        <Stack.Screen name="Procedure" component={Procedure} />
        <Stack.Screen name="Options" component={Options} />
        <Stack.Screen name="Assets" component={AssetsTabNavigator} />
        <Stack.Screen name="AssetsAdd" component={AddAsset} />
        <Stack.Screen name="LocationAdd" component={LocationAdd} />
        <Stack.Screen name="WorkOrderAdd" component={NewWorkOrder} />
        <Stack.Screen name="Vendors" component={Vendors} />
        <Stack.Screen name="AssetDetails" component={AssetDetail} />
        <Stack.Screen name="LocationDetails" component={LocationDetails} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="NewWorkOrder" component={NewWorkOrder} />
        <Stack.Screen name="WorkOrderDetails" component={WorkOrderDetails} />
    </Stack.Navigator>
);

// App content
const AppContent = () => {
    const dispatch = useDispatch();
    const [initialRoute, setInitialRoute] = useState(null);
  
    useEffect(() => {
        const checkToken = async () => {
            try {
                const Token = await asyncCache.getData("ACCESS_TOKEN");
                console.log("Raw Token Value:", Token);
                console.log("Token Type:", typeof Token);
                console.log("Token Truthy Check:", !!Token);

                // More explicit token validation
                const isValidToken = Token && Token.trim() !== "";
                console.log("Is Valid Token:", isValidToken);

                setInitialRoute(isValidToken ? "Main" : "ServerConnection");
            } catch (error) {
                console.error("Error checking token:", error);
                setInitialRoute("ServerConnection");
            }
        };
        checkToken();
    }, []);

    console.log("Current Initial Route:", initialRoute);

    if (initialRoute === null) {
        return null; // Loading state
    }

    return initialRoute === "Main" ? 
        <MainStack /> : 
        <AuthStack initialRouteName="ServerConnection" />;
};

export default function Navigation() {
    return (
        <NavigationContainer>
            <AppContent />
        </NavigationContainer>
    );
}
