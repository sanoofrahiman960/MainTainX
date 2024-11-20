<<<<<<< HEAD
import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert ,Dimensions} from 'react-native';
=======
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
>>>>>>> c29c0c6 (procedure)
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
<<<<<<< HEAD
import { useSelector, useDispatch } from 'react-redux';
import { deleteAssets, deleteLocation } from '../../redux/actions/locationAction';
=======
import { Searchbar, Card, Badge, FAB, Portal, Modal } from 'react-native-paper';
>>>>>>> c29c0c6 (procedure)

const Tab = createMaterialTopTabNavigator();
const windowWidth = Dimensions.get('window').width;

<<<<<<< HEAD
const AssetScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const assets = useSelector(state => state.locations.assets);
  const handleDeleteAsset = (locationId) => {
    Alert.alert(
      "Delete Assets",
      "Are you sure you want to delete this Asset?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          onPress: () => dispatch(deleteAssets(locationId)),
          style: "destructive"
        }
      ]
    );
  };

  const renderAssetItem = ({ item }) => (
    <View style={styles.locationItem}>
      <TouchableOpacity
        style={styles.locationContent}
        onPress={() => {
          // Navigate to location details screen
          // navigation.navigate('LocationDetails', { locationId: item.id });
        }}
      >
        <Icon name="map-marker" size={24} color="#007bff" style={styles.locationIcon} />
        <View style={styles.locationInfo}>
          <Text style={styles.locationName}>{item.name}</Text>
          <Text style={styles.locationAddress} numberOfLines={1}>{item.description}</Text>
        </View>
        <Icon name="chevron-right" size={24} color="#999" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteAsset(item.id)}
      >
        <Icon name="trash" size={20} color="#ff4444" />
      </TouchableOpacity>
    </View>
  );

  const EmptyAssetsScreen = () => {
    const navigation = useNavigation();
    
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <Icon name="folder-open" size={80} color="#007bff" />
          <Text style={styles.emptyTitle}>How can we break it if we don't know what it is?</Text>
          <Text style={styles.emptySubtitle}>Start adding the Assets you're in charge of maintaining</Text>
          <TouchableOpacity>
            <Text style={styles.learnMore}>Learn More</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => { navigation.navigate('AssetsAdd') }} style={styles.newAssetButton}>
          <Text style={styles.newAssetText}>+ New Asset</Text>
        </TouchableOpacity>
      </View>
    );
  };
  

  return (
    <View style={styles.container}>
=======
// Sample data for assets and locations
const sampleAssets = [
  {
    id: '1',
    name: 'Air Conditioner',
    code: 'AC001',
    location: 'Main Office',
    status: 'Active',
    type: 'HVAC',
    lastMaintenance: '2023-10-15',
  },
  {
    id: '2',
    name: 'Generator',
    code: 'GEN001',
    location: 'Basement',
    status: 'Under Maintenance',
    type: 'Power',
    lastMaintenance: '2023-09-20',
  },
];

const sampleLocations = [
  {
    id: '1',
    name: 'Main Office',
    type: 'Office',
    assetCount: 12,
    address: '123 Business Ave',
  },
  {
    id: '2',
    name: 'Warehouse',
    type: 'Storage',
    assetCount: 25,
    address: '456 Industrial Park',
  },
];

const AssetsScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [assets, setAssets] = useState(sampleAssets);

  const renderAssetItem = ({ item }) => (
    <Card style={styles.card} onPress={() => navigation.navigate('AssetDetails', { asset: item })}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleContainer}>
            <Icon name="desktop-tower-monitor" size={24} color="#007bff" />
            <View style={styles.cardTitleText}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardSubtitle}>{item.code}</Text>
            </View>
          </View>
          <Badge style={[styles.badge, { backgroundColor: item.status === 'Active' ? '#4CAF50' : '#FFC107' }]}>
            {item.status}
          </Badge>
        </View>
        <View style={styles.cardDetails}>
          <View style={styles.detailItem}>
            <Icon name="map-marker" size={16} color="#666" />
            <Text style={styles.detailText}>{item.location}</Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="wrench" size={16} color="#666" />
            <Text style={styles.detailText}>Last: {item.lastMaintenance}</Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.screenContainer}>
      <Searchbar
        placeholder="Search assets..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />
>>>>>>> c29c0c6 (procedure)
      {assets.length > 0 ? (
        <FlatList
          data={assets}
          renderItem={renderAssetItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
<<<<<<< HEAD
          ListHeaderComponent={
            <Text style={styles.listHeader}>Your Assets</Text>
          }
        />
      ) : (
        <EmptyAssetsScreen />
      )}
      {assets.length > 0 && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate('AssetsAdd')}
        >
          <Icon name="plus" size={24} color="#fff" />
        </TouchableOpacity>
      )}
=======
        />
      ) : (
        <View style={styles.emptyState}>
          <Icon name="cube-outline" size={80} color="#007bff" />
          <Text style={styles.emptyTitle}>No Assets Found</Text>
          <Text style={styles.emptySubtitle}>Start adding the assets you're in charge of maintaining</Text>
        </View>
      )}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('AssetsAdd')}
        label="New Asset"
      />
>>>>>>> c29c0c6 (procedure)
    </View>
  );
};

const LocationsScreen = () => {
  const navigation = useNavigation();
<<<<<<< HEAD
  const dispatch = useDispatch();
  const locations = useSelector(state => state.locations.locations);

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

  const renderLocationItem = ({ item }) => (
    <View style={styles.locationItem}>
      <TouchableOpacity
        style={styles.locationContent}
        onPress={() => {
          // Navigate to location details screen
          // navigation.navigate('LocationDetails', { locationId: item.id });
        }}
      >
        <Icon name="map-marker" size={24} color="#007bff" style={styles.locationIcon} />
        <View style={styles.locationInfo}>
          <Text style={styles.locationName}>{item.name}</Text>
          <Text style={styles.locationAddress} numberOfLines={1}>{item.address}</Text>
        </View>
        <Icon name="chevron-right" size={24} color="#999" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteLocation(item.id)}
      >
        <Icon name="trash" size={20} color="#ff4444" />
      </TouchableOpacity>
    </View>
  );

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="map-marker" size={64} color="#007bff" />
      <Text style={styles.emptyTitle}>No locations found.</Text>
      <Text style={styles.emptySubtitle}>Start adding locations you're in charge of.</Text>
      <TouchableOpacity
        style={styles.newLocationButton}
        onPress={() => navigation.navigate('LocationAdd')}
      >
        <Text style={styles.newLocationText}>Add New Location</Text>
      </TouchableOpacity>
=======
  const [searchQuery, setSearchQuery] = useState('');
  const [locations, setLocations] = useState(sampleLocations);

  const renderLocationItem = ({ item }) => (
    <Card style={styles.card} onPress={() => navigation.navigate('LocationDetails', { location: item })}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleContainer}>
            <Icon name="office-building" size={24} color="#007bff" />
            <View style={styles.cardTitleText}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardSubtitle}>{item.type}</Text>
            </View>
          </View>
          <Badge style={styles.countBadge}>
            {item.assetCount} Assets
          </Badge>
        </View>
        <View style={styles.cardDetails}>
          <View style={styles.detailItem}>
            <Icon name="map-marker" size={16} color="#666" />
            <Text style={styles.detailText}>{item.address}</Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.screenContainer}>
      <Searchbar
        placeholder="Search locations..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />
      {locations.length > 0 ? (
        <FlatList
          data={locations}
          renderItem={renderLocationItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyState}>
          <Icon name="map-marker-outline" size={80} color="#007bff" />
          <Text style={styles.emptyTitle}>No Locations Found</Text>
          <Text style={styles.emptySubtitle}>Start adding locations to organize your assets</Text>
        </View>
      )}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('LocationAdd')}
        label="New Location"
      />
>>>>>>> c29c0c6 (procedure)
    </View>
  );

  return (
    <View style={styles.container}>
      {locations.length > 0 ? (
        <FlatList
          data={locations}
          renderItem={renderLocationItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          ListHeaderComponent={
            <Text style={styles.listHeader}>Your Locations</Text>
          }
        />
      ) : (
        <EmptyState />
      )}
      {locations.length > 0 && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate('LocationAdd')}
        >
          <Icon name="plus" size={24} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
};

<<<<<<< HEAD
const AssetsTabNavigator = ({route}) => {
  const { tab } = route.params || {}; 
=======
const AssetsTabNavigator = () => {
>>>>>>> c29c0c6 (procedure)
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: { fontSize: 16, fontWeight: 'bold' },
        tabBarIndicatorStyle: { backgroundColor: '#007bff' },
        tabBarActiveTintColor: '#007bff',
        tabBarInactiveTintColor: '#000',
      }}
    >
      {tab !== "Asset" ?
      <>
        <Tab.Screen name="Locations" component={LocationsScreen} />
        <Tab.Screen name="Assets" component={AssetScreen} />
      </> :
      <>
        <Tab.Screen name="Assets" component={AssetScreen} />
        <Tab.Screen name="Locations" component={LocationsScreen} />
      </>}
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchBar: {
    margin: 16,
    elevation: 2,
  },
  listContainer: {
    padding: 16,
  },
  card: {
    marginBottom: 12,
    elevation: 2,
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
  badge: {
    paddingHorizontal: 8,
  },
  countBadge: {
    backgroundColor: '#E3F2FD',
    color: '#1976D2',
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
    color: '#333',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#007bff',
  },
  listContainer: {
    padding: 16,
  },
  listHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
    paddingHorizontal: 8,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: windowWidth - 62, // Subtracting padding from both sides
  },
  locationContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  locationIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
    paddingHorizontal:28
  },
  locationAddress: {
    fontSize: 14,
    color: '#666',
    paddingHorizontal:28

  },
  deleteButton: {
    padding: 16,
    borderLeftWidth: 1,
    borderLeftColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginTop: 20,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginTop: 10,
    marginBottom: 20,
  },
  newLocationButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  newLocationText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#007bff',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});

export default AssetsTabNavigator;