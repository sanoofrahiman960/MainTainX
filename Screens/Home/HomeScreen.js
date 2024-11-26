import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Card, Title, Paragraph, Appbar, Text, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useLocationAsset } from '../../hooks/useLocationAsset';
import { useVendor } from '../../hooks/useVendor';

const HomeScreen = () => {
    const navigation = useNavigation();
    const theme = useTheme();
    const { assets, locations } = useLocationAsset();
    const { vendors } = useVendor();

    const menuItems = [
        {
            title: 'Assets',
            icon: 'package-variant-closed',
            count: assets?.length || 0,
            screen: 'AssetScreen',
            color: '#4CAF50',
            description: 'Manage your equipment and assets'
        },
        {
            title: 'Locations',
            icon: 'map-marker',
            count: locations?.length || 0,
            screen: 'LocationScreen',
            color: '#2196F3',
            description: 'View and manage facility locations'
        },
        {
            title: 'Vendors',
            icon: 'domain',
            count: vendors?.length || 0,
            screen: 'VendorList',
            color: '#9C27B0',
            description: 'Manage suppliers and service providers'
        },
        {
            title: 'Parts',
            icon: 'tools',
            count: 0, // You'll need to add parts count from your parts state
            screen: 'Parts',
            color: '#FF9800',
            description: 'Track spare parts and inventory'
        }
    ];

    const renderMenuItem = (item) => (
        <Card
            key={item.title}
            style={styles.card}
            onPress={() => navigation.navigate(item.screen)}
        >
            <Card.Content style={styles.cardContent}>
                <View style={styles.iconContainer}>
                    <Icon 
                        name={item.icon} 
                        size={32} 
                        color={item.color}
                        style={styles.icon}
                    />
                </View>
                <View style={styles.textContainer}>
                    <Title style={styles.title}>{item.title}</Title>
                    <Paragraph style={styles.description}>{item.description}</Paragraph>
                    <View style={styles.countContainer}>
                        <Text style={[styles.count, { color: item.color }]}>
                            {item.count} {item.title.toLowerCase()}
                        </Text>
                    </View>
                </View>
            </Card.Content>
        </Card>
    );

    return (
        <View style={styles.container}>
            <Appbar.Header>
                <Appbar.Content title="MainTainXX" subtitle="Asset Management" />
            </Appbar.Header>

            <ScrollView style={styles.scrollView}>
                <View style={styles.content}>
                    {menuItems.map(renderMenuItem)}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 16,
    },
    card: {
        marginBottom: 16,
        elevation: 2,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    icon: {
        opacity: 0.9,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    description: {
        color: '#666',
        fontSize: 14,
        marginBottom: 8,
    },
    countContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    count: {
        fontSize: 14,
        fontWeight: 'bold',
    },
});

export default HomeScreen;
