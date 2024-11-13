import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { useRoute, useNavigation } from '@react-navigation/native';

export default function LandingScreen() {
    const navigation = useNavigation();

    useEffect(() => {
        // Set a timeout to change the message after 2 seconds


        const timer = setTimeout(() => {
            navigation.navigate('Tabs');
        }, 200);

        // Clean up the timer when the component unmounts
        return () => clearTimeout(timer);
    }, []);

    return (
        <View>
            <Text>LandingScreen</Text>
        </View>
    )
}

const styles = StyleSheet.create({})