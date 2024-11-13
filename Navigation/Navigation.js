import { StyleSheet, Text, View } from 'react-native'
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import OverView from '../Screens/OverView/OverView';
import WorkOrder from '../Screens/WorkOrder/WorkOrder';
import Asset from '../Screens/Asset/Asset';
import More from '../Screens/More/More';
import LandingScreen from '../Screens/LandingScreen/LandingScreen';
import { NavigationContainer } from '@react-navigation/native';
// import { Icon } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function Navigation() {
    const Stack = createStackNavigator();

    return (
        <NavigationContainer>
            <Stack.Navigator>

                <Stack.Screen name="MoreScreen" component={LandingScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Tabs" component={tabs} options={{ headerShown: false }} />

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