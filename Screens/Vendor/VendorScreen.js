import React, { useState } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Card, Text, FAB, Searchbar, IconButton, Appbar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useVendor } from '../../hooks/useVendor';

export default function VendorScreen() {
    const navigation = useNavigation();
    const { vendors, removeVendor } = useVendor();
    const [searchQuery, setSearchQuery] = useState('');

    const handleDeleteVendor = (vendorId) => {
        Alert.alert(
            "Delete Vendor",
            "Are you sure you want to delete this vendor?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    onPress: () => removeVendor(vendorId),
                    style: "destructive"
                }
            ]
        );
    };

    const handleEditVendor = (vendor) => {
        navigation.navigate('VendorAdd', { vendor, isEditing: true });
    };

    const renderVendorItem = ({ item }) => (
        <Card style={styles.card}>
            <Card.Content>
                <View style={styles.cardHeader}>
                    <TouchableOpacity 
                        style={styles.cardTitleContainer}
                        onPress={() => navigation.navigate('VendorDetails', { vendor: item })}
                    >
                        <Icon name="account-tie" size={24} color="#007bff" />
                        <View style={styles.cardTitleText}>
                            <Text style={styles.cardTitle}>{item.name}</Text>
                            <Text style={styles.cardSubtitle}>{item.email}</Text>
                            <Text style={styles.cardSubtitle}>{item.phone}</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.cardActions}>
                        <IconButton
                            icon="pencil"
                            size={20}
                            onPress={() => handleEditVendor(item)}
                            style={styles.actionButton}
                        />
                        <IconButton
                            icon="delete"
                            size={20}
                            onPress={() => handleDeleteVendor(item.id)}
                            style={styles.actionButton}
                        />
                    </View>
                </View>
                {item.description && (
                    <Text style={styles.description}>{item.description}</Text>
                )}
                {item.address && (
                    <Text style={styles.address}>{item.address}</Text>
                )}
                {item.services && (
                    <View style={styles.services}>
                        <Text style={styles.servicesTitle}>Services:</Text>
                        <Text>{item.services}</Text>
                    </View>
                )}
            </Card.Content>
        </Card>
    );

    const filteredVendors = vendors.filter(vendor =>
        vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <View style={styles.container}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="Vendors" />
            </Appbar.Header>
            
            <Searchbar
                placeholder="Search vendors..."
                onChangeText={setSearchQuery}
                value={searchQuery}
                style={styles.searchBar}
            />
            
            <FlatList
                data={filteredVendors}
                renderItem={renderVendorItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContainer}
            />
            
            <FAB
                icon="plus"
                style={styles.fab}
                onPress={() => navigation.navigate('VendorAdd')}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    searchBar: {
        margin: 16,
        elevation: 4,
    },
    listContainer: {
        padding: 16,
    },
    card: {
        marginBottom: 16,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    cardTitleContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        flex: 1,
    },
    cardTitleText: {
        marginLeft: 12,
        flex: 1,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    cardSubtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 2,
    },
    description: {
        marginTop: 8,
        color: '#666',
    },
    address: {
        marginTop: 8,
        color: '#666',
        fontStyle: 'italic',
    },
    services: {
        marginTop: 8,
    },
    servicesTitle: {
        fontWeight: 'bold',
        marginBottom: 4,
    },
    cardActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionButton: {
        margin: -8,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: '#007bff',
    },
});
