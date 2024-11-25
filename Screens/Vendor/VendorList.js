import React, { useState } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity } from 'react-native';
import { Card, Text, FAB, Searchbar, IconButton, Appbar, Avatar, Chip } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useVendor } from '../../hooks/useVendor';

const VendorList = () => {
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

    const renderVendorCard = ({ item }) => (
        <Card style={styles.card} onPress={() => navigation.navigate('EditVendor', { vendor: item, isEditing: true })}>
            <Card.Content>
                <View style={styles.cardHeader}>
                    <View style={styles.cardTitleContainer}>
                        <Avatar.Icon size={40} icon="domain" style={styles.avatar} />
                        <View style={styles.titleContainer}>
                            <Text style={styles.title}>{item.name}</Text>
                            <Text style={styles.subtitle}>{item.email}</Text>
                        </View>
                    </View>
                    <View style={styles.actionButtons}>
                        <IconButton
                            icon="pencil"
                            size={20}
                            onPress={() => navigation.navigate('EditVendor', { vendor: item, isEditing: true })}
                        />
                        <IconButton
                            icon="delete"
                            size={20}
                            onPress={() => handleDeleteVendor(item.id)}
                        />
                    </View>
                </View>

                {item.services && (
                    <View style={styles.servicesContainer}>
                        {item.services.split(',').map((service, index) => (
                            <Chip 
                                key={index} 
                                style={styles.chip}
                                textStyle={styles.chipText}
                            >
                                {service.trim()}
                            </Chip>
                        ))}
                    </View>
                )}

                <View style={styles.infoContainer}>
                    {item.phone && (
                        <View style={styles.infoRow}>
                            <IconButton icon="phone" size={20} />
                            <Text>{item.phone}</Text>
                        </View>
                    )}
                    {item.address && (
                        <View style={styles.infoRow}>
                            <IconButton icon="map-marker" size={20} />
                            <Text>{item.address}</Text>
                        </View>
                    )}
                </View>
            </Card.Content>
        </Card>
    );

    const filteredVendors = vendors.filter(vendor =>
        vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.services?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <View style={styles.container}>
            <Appbar.Header>
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
                renderItem={renderVendorCard}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContainer}
            />

            <FAB
                icon="plus"
                style={styles.fab}
                onPress={() => navigation.navigate('EditVendor')}
            />
        </View>
    );
};

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
        marginBottom: 12,
    },
    cardTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatar: {
        backgroundColor: '#007AFF',
    },
    titleContainer: {
        marginLeft: 12,
        flex: 1,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
    },
    actionButtons: {
        flexDirection: 'row',
    },
    servicesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 12,
    },
    chip: {
        marginRight: 8,
        marginBottom: 8,
        backgroundColor: '#E8F0FE',
    },
    chipText: {
        color: '#1967D2',
    },
    infoContainer: {
        marginTop: 8,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: '#007AFF',
    },
});

export default VendorList;
