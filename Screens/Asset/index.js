import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { deleteAssets, deleteLocation } from '../../redux/actions/locationAction';
import { Searchbar, Card, Badge, FAB } from 'react-native-paper';
import AssetListingPage from './AssetListing';

const Tab = createMaterialTopTabNavigator();
const windowWidth = Dimensions.get('window').width;

const AssetsScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const assets = useSelector(state => state.assets.assets);
  const [searchQuery, setSearchQuery] = useState('');

  const handleDeleteAsset = (assetId) => {
    Alert.alert(
      "Delete Asset",
      "Are you sure you want to delete this asset?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          onPress: () => dispatch(deleteAssets(assetId)),
          style: "destructive"
        }
      ]
    );
  };

  const renderAssetItem = ({ item }) => (
    <Card style={styles.card} onPress={() => alert(item.description)}>
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
            {item.criticality}
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

  const EmptyAssetsScreen = () => (
    <View style={styles.emptyState}>
      <Icon name="folder-open" size={80} color="#007bff" />
      <Text style={styles.emptyTitle}>How can we break it if we don't know what it is?</Text>
      <Text style={styles.emptySubtitle}>Start adding the Assets you're in charge of maintaining</Text>
      <TouchableOpacity>
        <Text style={styles.learnMore}>Learn More</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.screenContainer}>
      <Searchbar
        placeholder="Search assets..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />
      {assets.length > 0 ? (
        <FlatList
          data={assets}
          renderItem={renderAssetItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          ListHeaderComponent={
            <Text style={styles.listHeader}>Your Assets</Text>
          }
        />
      ) : (
        <EmptyAssetsScreen />
      )}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('AssetsAdd')}
        label="New Asset"
      />
    </View>
  );
};

const LocationsScreen = () => {
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
            {item.assetCount} Location
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
    </View>
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
          ListHeaderComponent={
            <Text style={styles.listHeader}>Your Locations</Text>
          }
        />
      ) : (
        <EmptyState />
      )}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('LocationAdd')}
        label="New Location"
      />
    </View>
  );
};

const AssetsTabNavigator = ({route}) => {
  const { tab } = route.params || {}; 
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
        <Tab.Screen name="Assets" component={AssetListingPage} />
      </> :
      <>
        <Tab.Screen name="Assets" component={AssetListingPage} />
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
  listHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
    paddingHorizontal: 8,
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
  learnMore: {
    fontSize: 16,
    color: '#007bff',
    marginTop: 10,
    textDecorationLine: 'underline',
  },
  newLocationButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 20,
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
  },
});

export default AssetsTabNavigator;