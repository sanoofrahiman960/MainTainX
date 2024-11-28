import React, { useState, useCallback } from 'react';
import { StyleSheet, View, FlatList, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { 
    Text,
    Card, 
    Badge, 
    Searchbar, 
    FAB, 
    IconButton,
    Appbar,
    Menu,
    Chip,
    Portal,
    Dialog,
    Button,
    ActivityIndicator
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector, useDispatch } from 'react-redux';
// import { deleteAsset } from '../../Redux/slices/assetSlice';

export default function AssetScreen() {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const assets = useSelector(state => state.assets.assets);
    const locations = useSelector(state => state.locations.locations);
    
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [sortBy, setSortBy] = useState('name');
    const [menuVisible, setMenuVisible] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        // Add your refresh logic here
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);

    const handleDeleteAsset = (asset) => {
        setSelectedAsset(asset);
        setDeleteDialogVisible(true);
    };

    const confirmDelete = () => {
        if (selectedAsset) {
            dispatch(deleteAsset(selectedAsset.id));
            setDeleteDialogVisible(false);
            setSelectedAsset(null);
        }
    };

    const handleEditAsset = (asset) => {
        navigation.navigate('AssetsAdd', { asset, isEditing: true });
    };

    const getLocationName = (locationId) => {
        const location = locations.find(loc => loc.id === locationId);
        return location ? location.name : 'No Location';
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'active':
                return '#4CAF50';
            case 'inactive':
                return '#FF9800';
            case 'maintenance':
                return '#2196F3';
            case 'error':
                return '#f44336';
            default:
                return '#757575';
        }
    };

    const filteredAssets = assets
        .filter(asset => {
            const matchesSearch = 
                asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                asset.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                getLocationName(asset.locationId).toLowerCase().includes(searchQuery.toLowerCase());
            
            if (filterStatus === 'all') return matchesSearch;
            return matchesSearch && asset.status?.toLowerCase() === filterStatus.toLowerCase();
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'status':
                    return (a.status || '').localeCompare(b.status || '');
                case 'location':
                    return getLocationName(a.locationId).localeCompare(getLocationName(b.locationId));
                default:
                    return 0;
            }
        });

    const renderAssetItem = ({ item }) => (
        <Card 
            style={styles.card}
            onPress={() => navigation.navigate('AssetDetails', { asset: item })}
        >
            <Card.Content>
                <View style={styles.cardHeader}>
                    <View style={styles.cardTitleContainer}>
                        <Icon name="cube-outline" size={24} color="#42b0f5" />
                        <View style={styles.cardTitleText}>
                            <Text style={styles.cardTitle}>{item.name}</Text>
                            <Text style={styles.cardSubtitle}>{item.type}</Text>
                        </View>
                    </View>
                    <Menu
                        visible={menuVisible && selectedAsset?.id === item.id}
                        onDismiss={() => {
                            setMenuVisible(false);
                            setSelectedAsset(null);
                        }}
                        anchor={
                            <IconButton
                                icon="dots-vertical"
                                size={20}
                                onPress={() => {
                                    setSelectedAsset(item);
                                    setMenuVisible(true);
                                }}
                            />
                        }
                    >
                        <Menu.Item 
                            onPress={() => {
                                setMenuVisible(false);
                                handleEditAsset(item);
                            }} 
                            title="Edit"
                            leadingIcon="pencil"
                        />
                        <Menu.Item 
                            onPress={() => {
                                setMenuVisible(false);
                                navigation.navigate('NewWorkOrder', { 
                                    asset: item,
                                    prefilledData: {
                                        asset: item.name,
                                        location: getLocationName(item.locationId)
                                    }
                                });
                            }} 
                            title="Create Work Order"
                            leadingIcon="clipboard-plus"
                        />
                        <Menu.Item 
                            onPress={() => {
                                setMenuVisible(false);
                                handleDeleteAsset(item);
                            }} 
                            title="Delete"
                            leadingIcon="delete"
                        />
                    </Menu>
                </View>
                
                <View style={styles.cardDetails}>
                    <View style={styles.detailItem}>
                        <Icon name="map-marker" size={16} color="#666" />
                        <Text style={styles.detailText}>{getLocationName(item.locationId)}</Text>
                    </View>
                    <View style={styles.badgeContainer}>
                        {item.status && (
                            <Badge 
                                style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}
                            >
                                {item.status}
                            </Badge>
                        )}
                        {item.criticality && (
                            <Badge 
                                style={[styles.criticalityBadge, { 
                                    backgroundColor: 
                                        item.criticality.toLowerCase() === 'high' ? '#f44336' :
                                        item.criticality.toLowerCase() === 'medium' ? '#FF9800' : '#4CAF50'
                                }]}
                            >
                                {item.criticality}
                            </Badge>
                        )}
                    </View>
                </View>
            </Card.Content>
        </Card>
    );

    const EmptyState = () => (
        <View style={styles.emptyState}>
            <Icon name="cube-outline" size={64} color="#42b0f5" />
            <Text style={styles.emptyTitle}>No assets found</Text>
            <Text style={styles.emptySubtitle}>Start adding assets to track and maintain</Text>
            <Button
                mode="contained"
                onPress={() => navigation.navigate('AssetAdd')}
                style={styles.addButton}
                icon="plus"
            >
                Add Asset
            </Button>
        </View>
    );

    return (
        <View style={styles.container}>
            <Appbar.Header style={styles.header}>
                <Appbar.Content title="Assets" color="#fff" />
                <Appbar.Action icon="filter" color="#fff" onPress={() => {}} />
                <Appbar.Action 
                    icon="sort" 
                    color="#fff"
                    onPress={() => {}}
                />
            </Appbar.Header>

            <View style={styles.searchContainer}>
                <Searchbar
                    placeholder="Search assets..."
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    style={styles.searchbar}
                />
                <View style={styles.filterChips}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <Chip 
                            selected={filterStatus === 'all'}
                            onPress={() => setFilterStatus('all')}
                            style={styles.chip}
                        >
                            All
                        </Chip>
                        <Chip 
                            selected={filterStatus === 'active'}
                            onPress={() => setFilterStatus('active')}
                            style={styles.chip}
                        >
                            Active
                        </Chip>
                        <Chip 
                            selected={filterStatus === 'maintenance'}
                            onPress={() => setFilterStatus('maintenance')}
                            style={styles.chip}
                        >
                            Maintenance
                        </Chip>
                        <Chip 
                            selected={filterStatus === 'inactive'}
                            onPress={() => setFilterStatus('inactive')}
                            style={styles.chip}
                        >
                            Inactive
                        </Chip>
                    </ScrollView>
                </View>
            </View>

            <FlatList
                data={filteredAssets}
                renderItem={renderAssetItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
                ListEmptyComponent={EmptyState}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#42b0f5']}
                    />
                }
            />

            <FAB
                icon="plus"
                style={styles.fab}
                onPress={() => navigation.navigate('AssetAdd')}
                label="Add Asset"
            />

            <Portal>
                <Dialog
                    visible={deleteDialogVisible}
                    onDismiss={() => setDeleteDialogVisible(false)}
                >
                    <Dialog.Title>Delete Asset</Dialog.Title>
                    <Dialog.Content>
                        <Text>Are you sure you want to delete this asset? This action cannot be undone.</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setDeleteDialogVisible(false)}>Cancel</Button>
                        <Button onPress={confirmDelete} textColor="#f44336">Delete</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        backgroundColor: '#42b0f5',
    },
    searchContainer: {
        padding: 16,
        backgroundColor: '#fff',
        elevation: 2,
    },
    searchbar: {
        elevation: 0,
        backgroundColor: '#f5f5f5',
    },
    filterChips: {
        marginTop: 12,
        flexDirection: 'row',
    },
    chip: {
        marginRight: 8,
    },
    list: {
        padding: 16,
        paddingBottom: 80,
    },
    card: {
        marginBottom: 12,
        elevation: 2,
        borderRadius: 8,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
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
        marginTop: 2,
    },
    cardDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    detailText: {
        marginLeft: 8,
        color: '#666',
        fontSize: 14,
    },
    badgeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusBadge: {
        marginLeft: 8,
    },
    criticalityBadge: {
        marginLeft: 8,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
        marginBottom: 24,
    },
    addButton: {
        backgroundColor: '#42b0f5',
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: '#42b0f5',
    },
});