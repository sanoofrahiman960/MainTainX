import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Card, Searchbar, IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector, useDispatch } from 'react-redux';
import { deleteLocation } from '../../Redux/slices/locationSlice';
import { Alert } from 'react-native';

export default function LocationScreen() {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const locations = useSelector(state => state.locations.locations);
    const [searchQuery, setSearchQuery] = useState('');

    const handleDeleteLocation = (locationId) => {
        Alert.alert(
            "Delete Location",
            "Are you sure you want to delete this location?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    onPress: () => dispatch(deleteLocation(locationId)),
                    style: "destructive"
                }
            ]
        );
    };

    const handleEditLocation = (location) => {
        navigation.navigate('LocationAdd', { location, isEditing: true });
    };

    const renderLocationItem = ({ item }) => (
        <Card style={styles.card}>
            <Card.Content>
                <View style={styles.cardHeader}>
                    <TouchableOpacity 
                        style={styles.cardTitleContainer}
                        onPress={() => navigation.navigate('LocationDetails', { location: item })}
                    >
                        <Icon name="map-marker" size={24} color="#007bff" />
                        <View style={styles.cardTitleText}>
                            <Text style={styles.cardTitle}>{item.name}</Text>
                            <Text style={styles.cardSubtitle}>{item.address}</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.cardActions}>
                        <IconButton
                            icon="pencil"
                            size={20}
                            onPress={() => handleEditLocation(item)}
                            style={styles.actionButton}
                        />
                        <IconButton
                            icon="delete"
                            size={20}
                            onPress={() => handleDeleteLocation(item.id)}
                            style={styles.actionButton}
                        />
                    </View>
                </View>
            </Card.Content>
        </Card>
    );

    const EmptyState = () => (
        <View style={styles.emptyState}>
            <Icon name="map-marker" size={64} color="#007bff" />
            <Text style={styles.emptyTitle}>No locations found</Text>
            <Text style={styles.emptySubtitle}>Start adding locations to organize your assets</Text>
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
            <FlatList
                data={filteredLocations}
                renderItem={renderLocationItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={EmptyState}
            />
            <FAB
                style={styles.fab}
                icon="plus"
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
        elevation: 2,
    },
    listContainer: {
        padding: 16,
        paddingBottom: 80,
    },
    card: {
        marginBottom: 12,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    cardTitleText: {
        marginLeft: 12,
        flex: 1,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    cardSubtitle: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    cardActions: {
        flexDirection: 'row',
    },
    actionButton: {
        margin: -8,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
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
        fontWeight: '600',
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: '#007bff',
    },
});
