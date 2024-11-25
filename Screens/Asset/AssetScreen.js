import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Card, Badge, Searchbar, FAB, IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useLocationAsset } from '../../hooks/useLocationAsset';
import { Alert } from 'react-native';

export default function AssetScreen() {
    const navigation = useNavigation();
    const { assets, removeAsset, locations } = useLocationAsset();
    const [searchQuery, setSearchQuery] = useState('');

    const handleDeleteAsset = (assetId) => {
        Alert.alert(
            "Delete Asset",
            "Are you sure you want to delete this asset?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    onPress: () => removeAsset(assetId),
                    style: "destructive"
                }
            ]
        );
    };

    const handleEditAsset = (asset) => {
        navigation.navigate('AssetsAdd', { asset, isEditing: true });
    };

    const getLocationName = (locationId) => {
        const location = locations.find(loc => loc.id === locationId);
        return location ? location.name : 'No Location';
    };

    const renderAssetItem = ({ item }) => (
        <Card style={styles.card}>
            <Card.Content>
                <View style={styles.cardHeader}>
                    <TouchableOpacity 
                        style={styles.cardTitleContainer}
                        onPress={() => navigation.navigate('AssetDetails', { asset: item })}
                    >
                        <Icon name="cube-outline" size={24} color="#007bff" />
                        <View style={styles.cardTitleText}>
                            <Text style={styles.cardTitle}>{item.name}</Text>
                            <Text style={styles.cardSubtitle}>{item.type}</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.cardActions}>
                        <IconButton
                            icon="pencil"
                            size={20}
                            onPress={() => handleEditAsset(item)}
                            style={styles.actionButton}
                        />
                        <IconButton
                            icon="delete"
                            size={20}
                            onPress={() => handleDeleteAsset(item.id)}
                            style={styles.actionButton}
                        />
                    </View>
                </View>
                <View style={styles.cardDetails}>
                    <View style={styles.detailItem}>
                        <Icon name="map-marker" size={16} color="#666" />
                        <Text style={styles.detailText}>{getLocationName(item.locationId)}</Text>
                    </View>
                    {item.status && (
                        <Badge style={[styles.statusBadge, { backgroundColor: item.status === 'active' ? '#4CAF50' : '#FF9800' }]}>
                            {item.status}
                        </Badge>
                    )}
                </View>
            </Card.Content>
        </Card>
    );

    const EmptyState = () => (
        <View style={styles.emptyState}>
            <Icon name="cube-outline" size={64} color="#007bff" />
            <Text style={styles.emptyTitle}>No assets found</Text>
            <Text style={styles.emptySubtitle}>Start adding assets to track and maintain</Text>
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate('AssetAdd')}
            >
                <Text style={styles.addButtonText}>Add Asset</Text>
            </TouchableOpacity>
        </View>
    );

    const filteredAssets = assets.filter(asset =>
        asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        getLocationName(asset.locationId).toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <View style={styles.container}>
            <Searchbar
                placeholder="Search assets..."
                onChangeText={setSearchQuery}
                value={searchQuery}
                style={styles.searchBar}
            />
            {assets.length > 0 ? (
                <FlatList
                    data={filteredAssets}
                    renderItem={renderAssetItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContainer}
                />
            ) : (
                <EmptyState />
            )}
            <FAB
                icon="plus"
                style={styles.fab}
                onPress={() => navigation.navigate('AssetsAdd')}
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
    statusBadge: {
        alignSelf: 'flex-start',
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
    cardActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionButton: {
        margin: -8, // Reduce the default padding
    },
});