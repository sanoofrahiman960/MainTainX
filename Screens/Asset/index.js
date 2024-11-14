import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

const Tab = createMaterialTopTabNavigator();

const AssetsScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      {/* Content for Assets tab */}
      <View style={styles.emptyState}>
        <Icon name="folder-outline" size={80} color="#007bff" />
        <Text style={styles.emptyTitle}>How can we break it if we don’t know what it is?</Text>
        <Text style={styles.emptySubtitle}>Start adding the Assets you’re in charge of maintaining</Text>
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

const LocationsScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      {/* Content for Locations tab */}
      <Text style={styles.emptyTitle}>No locations found.</Text>
      <Text style={styles.emptySubtitle}>Start adding locations you're in charge of.</Text>
      <TouchableOpacity onPress={() => { navigation.navigate('LocationAdd') }} style={styles.newAssetButton}>
        <Text style={styles.newAssetText}>+ New Location</Text>
      </TouchableOpacity>
    </View>
  );
};

const AssetsTabNavigator = () => {

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: { fontSize: 16, fontWeight: 'bold' },
        tabBarIndicatorStyle: { backgroundColor: '#007bff' },
        tabBarActiveTintColor: '#007bff',
        tabBarInactiveTintColor: '#000',
      }}
    >
      <Tab.Screen name="Assets" component={AssetsScreen} />
      <Tab.Screen name="Locations" component={LocationsScreen} />
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
});

export default AssetsTabNavigator;
