
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Alert, Dimensions, ScrollView, SectionList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Searchbar, Card, Text, Badge, FAB, Chip, Menu, Divider } from 'react-native-paper';

const windowWidth = Dimensions.get('window').width;

const AssetListingPage = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const assets = useSelector(state => state.assets.assets);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredAssets, setFilteredAssets] = useState(assets);
  const [sortBy, setSortBy] = useState('name');
  const [filterBy, setFilterBy] = useState('all');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [newlyAddedAssets, setNewlyAddedAssets] = useState([]);

  useEffect(() => {
    const filtered = assets.filter(asset => 
      asset.task.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredAssets(filtered);
  }, [searchQuery, assets]);

  useEffect(() => {
    const mockNewAsset = [
      {
        id: 'new-asset-1',
        task: 'New Asset',
        description: 'This is a newly added asset',
        status: 'Active',
        location: 'Main Office',
        lastMaintenance: '2023-05-15',
        criticality: 'High',
      },
      {
        id: 'new-asset-1',
        task: 'New Asset1',
        description: 'This is a newly added asset',
        status: 'Active',
        location: 'Main Office',
        lastMaintenance: '2023-05-15',
        criticality: 'High',
      },
      {
        id: 'new-asset-1',
        task: 'New Asset2',
        description: 'This is a newly added asset',
        status: 'Active',
        location: 'Main Office',
        lastMaintenance: '2023-05-15',
        criticality: 'High',
      },
      // Additional mock assets
    ];

    setNewlyAddedAssets(mockNewAsset); // Fixed to avoid nesting
  }, []);

  const handleDeleteAsset = (assetId) => {
    Alert.alert(
      "Delete Asset",
      "Are you sure you want to delete this asset?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive"
        }
      ]
    );
  };

  const sortAssets = (assets) => {
    const assetsCopy = [...assets]; // Prevent mutating original array
    switch (sortBy) {
      case 'name':
        return assetsCopy.sort((a, b) => a.task.localeCompare(b.task));
      case 'status':
        return assetsCopy.sort((a, b) => a.status.localeCompare(b.status));
      case 'criticality':
        return assetsCopy.sort((a, b) => b.criticality.localeCompare(a.criticality));
      default:
        return assetsCopy;
    }
  };

  const filterAssets = (assets) => {
    switch (filterBy) {
      case 'active':
        return assets.filter(asset => asset.status === 'Active');
      case 'inactive':
        return assets.filter(asset => asset.status !== 'Active');
      case 'critical':
        return assets.filter(asset => asset.criticality === 'Critical');
      default:
        return assets;
    }
  };

  const renderAssetItem = ({ item, index, section }) => (
    <Card style={[styles.card, section.title === 'New Assets' && styles.newAssetCard]} onPress={() => navigation.navigate('WorkOrderAdd', { asset: item })}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleContainer}>
            <Icon name="desktop-tower-monitor" size={24} color="#007bff" />
            <View style={styles.cardTitleText}>
              <Text style={styles.cardTitle}>{item.task}</Text>
              <Text style={styles.cardSubtitle}>{item.description}</Text>
            </View>
          </View>
          <Badge style={[styles.badge, { backgroundColor: item.status === 'Active' ? '#4CAF50' : '#FFC107' }]}>
            {item.status}
          </Badge>
        </View>
        <Divider style={styles.divider} />
        <View style={styles.cardDetails}>
          <View style={styles.detailItem}>
            <Icon name="map-marker" size={16} color="#666" />
            <Text style={styles.detailText}>{item.location}</Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="wrench" size={16} color="#666" />
            <Text style={styles.detailText}>Last: {item.lastMaintenance}</Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="alert-circle" size={16} color="#666" />
            <Text style={styles.detailText}>Criticality: {item.criticality}</Text>
          </View>
        </View>
      </Card.Content>
      <Card.Actions>
        <TouchableOpacity onPress={() => navigation.navigate('EditAsset', { asset: item })}>
          <Icon name="pencil" size={20} color="#007bff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeleteAsset(item.id)}>
          <Icon name="delete" size={20} color="#dc3545" />
        </TouchableOpacity>
      </Card.Actions>
    </Card>
  );

  const sortedAndFilteredAssets = sortAssets(filterAssets(filteredAssets));

  const sections = [
    { title: 'New Assets', data: newlyAddedAssets },
    { title: 'All Assets', data: sortedAndFilteredAssets },
  ];

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search assets..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />
      <View style={styles.filterContainer}>
        <Menu
          visible={showSortMenu}
          onDismiss={() => setShowSortMenu(false)}
          anchor={
            <TouchableOpacity onPress={() => setShowSortMenu(true)} style={styles.sortButton}>
              <Icon name="sort" size={20} color="#007bff" />
              <Text style={styles.sortButtonText}>Sort</Text>
            </TouchableOpacity>
          }
        >
          <Menu.Item onPress={() => { setSortBy('name'); setShowSortMenu(false); }} title="Sort by Name" />
          <Menu.Item onPress={() => { setSortBy('status'); setShowSortMenu(false); }} title="Sort by Status" />
          <Menu.Item onPress={() => { setSortBy('criticality'); setShowSortMenu(false); }} title="Sort by Criticality" />
        </Menu>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipContainer}>
          <Chip
            selected={filterBy === 'all'}
            onPress={() => setFilterBy('all')}
            style={styles.chip}
          >
            All
          </Chip>
          <Chip
            selected={filterBy === 'active'}
            onPress={() => setFilterBy('active')}
            style={styles.chip}
          >
            Active
          </Chip>
          <Chip
            selected={filterBy === 'inactive'}
            onPress={() => setFilterBy('inactive')}
            style={styles.chip}
          >
            Inactive
          </Chip>
          <Chip
            selected={filterBy === 'critical'}
            onPress={() => setFilterBy('critical')}
            style={styles.chip}
          >
            Critical
          </Chip>
        </ScrollView>
      </View>
      <SectionList
        sections={sections}
        keyExtractor={(item, index) => item.id || `section-item-${index}`}
        renderItem={renderAssetItem}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
        ListEmptyComponent={
          sections.every(section => section.data.length === 0) && (
            <View style={styles.emptyState}>
              <Icon name="folder-open" size={64} color="#007bff" />
              <Text style={styles.emptyTitle}>No assets found</Text>
              <Text style={styles.emptySubtitle}>Add some assets or try a different search</Text>
            </View>
          )
        }
        contentContainerStyle={styles.listContainer}
      />
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('AssetsAdd')}
        label="New Asset"
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
    elevation: 2,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortButtonText: {
    marginLeft: 4,
    color: '#007bff',
    fontWeight: 'bold',
  },
  chipContainer: {
    flexGrow: 0,
  },
  chip: {
    marginRight: 8,
  },
  listContainer: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  newAssetCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitleText: {
    marginLeft: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  badge: {
    paddingHorizontal: 8,
  },
  divider: {
    marginVertical: 8,
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
    fontSize: 14,
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
    textAlign: 'center',
    color: '#007bff',
    marginTop: 20,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginTop: 10,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#007bff',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: '#f0f0f0',
    padding: 8,
    marginTop: 16,
    marginBottom: 8,
  },
});

export default AssetListingPage;

