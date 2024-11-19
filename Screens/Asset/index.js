import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert ,Dimensions} from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { deleteAssets, deleteLocation } from '../../redux/actions/locationAction';

const Tab = createMaterialTopTabNavigator();
const windowWidth = Dimensions.get('window').width;

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
      {assets.length > 0 && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate('AssetsAdd')}
        >
          <Icon name="plus" size={24} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const LocationsScreen = () => {
  const navigation = useNavigation();
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
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyState: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#007bff',
    marginTop: 20,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#555',
    marginTop: 10,
  },
  learnMore: {
    fontSize: 16,
    color: '#007bff',
    marginTop: 10,
    textDecorationLine: 'underline',
  },
  newAssetButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    marginTop: 20,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  newAssetText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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