import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Card, Badge, Searchbar, FAB } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useLocationAsset } from '../../hooks/useLocationAsset';

export default function LocationScreen() {
    const navigation = useNavigation();
    const { locations, removeLocation } = useLocationAsset();
    const [searchQuery, setSearchQuery] = useState('');

    const handleDeleteLocation = (locationId) => {
        Alert.alert(
            "Delete Location",
            "Are you sure you want to delete this location?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    onPress: () => removeLocation(locationId),
                    style: "destructive"
                }
            ]
        );
    };

    const renderLocationItem = ({ item }) => (
        <Card style={styles.card} onPress={() => navigation.navigate('LocationDetails', { location: item })}>
            <Card.Content>
                <View style={styles.cardHeader}>
                    <View style={styles.cardTitleContainer}>
                        <Icon name="office-building" size={24} color="#007bff" />
                        <View style={styles.cardTitleText}>
                            <Text style={styles.cardTitle}>{item.name}</Text>
                            <Text style={styles.cardSubtitle}>{item.description}</Text>
                        </View>
                    </View>
                    <TouchableOpacity onPress={() => handleDeleteLocation(item.id)}>
                        <Icon name="delete" size={24} color="#ff4444" />
                    </TouchableOpacity>
                </View>
                {item.address && (
                    <View style={styles.cardDetails}>
                        <View style={styles.detailItem}>
                            <Icon name="map-marker" size={16} color="#666" />
                            <Text style={styles.detailText}>{item.address}</Text>
                        </View>
                    </View>
                )}
            </Card.Content>
        </Card>
    );

    const EmptyState = () => (
        <View style={styles.emptyState}>
            <Icon name="map-marker" size={64} color="#007bff" />
            <Text style={styles.emptyTitle}>No locations found</Text>
            <Text style={styles.emptySubtitle}>Start adding locations you're in charge of</Text>
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate('LocationAdd')}
            >
                <Text style={styles.addButtonText}>Add Location</Text>
            </TouchableOpacity>
        </View>
    );

    const filteredLocations = locations.filter(location =>
        location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.address?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <View style={styles.container}>
            <Searchbar
                placeholder="Search locations..."
                onChangeText={setSearchQuery}
                value={searchQuery}
                style={styles.searchBar}
            />
            {locations.length > 0 ? (
                <FlatList
                    data={filteredLocations}
                    renderItem={renderLocationItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContainer}
                />
            ) : (
                <EmptyState />
            )}
            <FAB
                icon="plus"
                style={styles.fab}
                onPress={() => navigation.navigate('LocationAdd')}
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
        elevation: 4,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    cardTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardTitleText: {
        marginLeft: 8,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    cardSubtitle: {
        fontSize: 14,
        color: '#666',
    },
    cardDetails: {
        marginTop: 8,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    detailText: {
        marginLeft: 8,
        color: '#666',
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 16,
    },
    emptySubtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginTop: 8,
    },
    addButton: {
        backgroundColor: '#007bff',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
        marginTop: 24,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: '#007bff',
    },
});
