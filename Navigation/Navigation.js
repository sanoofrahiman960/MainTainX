import { StyleSheet, Text, View } from 'react-native'
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import OverView from '../Screens/OverView/OverView';
import WorkOrder from '../Screens/WorkOrder/WorkOrder';
import Asset from '../Screens/Asset/index';
import More from '../Screens/More/More';
import LandingScreen from '../Screens/LandingScreen/LandingScreen';
import { NavigationContainer } from '@react-navigation/native';
// import { Icon } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome';
import Procedure from '../Screens/Procedure/Procedure';
import Options from '../Screens/Procedure/Options';
import AssetAdd from '../Screens/Asset/AssetAdd';
import LocationAdd from '../Screens/Asset/LocationAdd';
import AddAsset from '../Screens/Asset/AddAsset';
import Vendors from '../Screens/Vendors/Vendors';


export default function Navigation() {
    const Stack = createStackNavigator();

    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="MoreScreen" component={LandingScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Tabs" component={tabs} options={{ headerShown: false }} />
                <Stack.Screen name="Procedure" component={Procedure} options={{ headerShown: false }} />
                <Stack.Screen name="Options" component={Options} options={{ headerShown: false }} />
                <Stack.Screen name="Assets" component={Asset} options={{ headerShown: false }} />
                <Stack.Screen name="AssetsAdd" component={AddAsset} options={{ headerShown: false }} />
                <Stack.Screen name="LocationAdd" component={LocationAdd} options={{ headerShown: false }} />
                <Stack.Screen name="Vendors" component={Vendors} options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}




const tabs = () => {
    const Tab = createBottomTabNavigator();
    return (
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
}
const styles = StyleSheet.create({})