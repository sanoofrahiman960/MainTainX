import React, { useState ,useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { addLocation } from '../../redux/actions/locationAction';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

export default function LocationAdd() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [locationName, setLocationName] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const Tab = createMaterialTopTabNavigator();


  const saveLocation = async () => {
    if (!locationName.trim()) {
      Alert.alert('Error', 'Please enter a location name');
      return;
    }

    try {
      const newLocation = {
        id: Date.now().toString(),
        name: locationName,
        description,
        address,
        // Add other fields as needed
      };

      // Save to AsyncStorage
      const existingLocationsJson = await AsyncStorage.getItem('locations');
      const existingLocations = existingLocationsJson ? JSON.parse(existingLocationsJson) : [];
      const updatedLocations = [...existingLocations, newLocation];
      await AsyncStorage.setItem('locations', JSON.stringify(updatedLocations));

      // Dispatch to Redux
      dispatch(addLocation(newLocation));

      Alert.alert('Success', 'Location saved successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error saving location:', error);
      Alert.alert('Error', 'Failed to save location');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Location</Text>
        <TouchableOpacity onPress={saveLocation}>
          <Text style={styles.createButton}>CREATE</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <TextInput
          style={styles.nameInput}
          placeholder="Enter Location Name"
          placeholderTextColor="#999"
          value={locationName}
          onChangeText={setLocationName}
        />

        <TouchableOpacity style={styles.imageButton}>
          <Icon name="camera" size={24} color="#2196F3" />
          <Text style={styles.imageButtonText}>Add or take pictures</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.descriptionInput}
          placeholder="Add a description"
          placeholderTextColor="#999"
          multiline
          numberOfLines={4}
          value={description}
          onChangeText={setDescription}
        />

        <Text style={styles.label}>Address</Text>
        <TextInput
          style={styles.addressInput}
          placeholder="Address"
          placeholderTextColor="#999"
          value={address}
          onChangeText={setAddress}
        />

        <TouchableOpacity style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>QR Code/Barcode</Text>
          <View style={styles.fieldValue}>
            <Text style={styles.assignText}>Assign</Text>
            <Icon name="chevron-right" size={24} color="#999" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Teams in Charge</Text>
          <View style={styles.fieldValue}>
            <Text style={styles.chooseText}>Choose</Text>
            <Icon name="chevron-right" size={24} color="#999" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Vendors</Text>
          <View style={styles.fieldValue}>
            <Text style={styles.assignText}>Assign</Text>
            <Icon name="chevron-right" size={24} color="#999" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Files</Text>
          <View style={styles.fieldValue}>
            <Text style={styles.attachText}>Attach</Text>
            <Icon name="chevron-right" size={24} color="#999" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.fieldContainer}>
          <View style={styles.fieldLabelWithIcon}>
            <Text style={styles.fieldLabel}>Parent Location</Text>
            <Icon name="lock" size={16} color="#999" />
          </View>
          <View style={styles.fieldValue}>
            <Text style={styles.parentLocationText}>Parent Location</Text>
            <Icon name="chevron-right" size={24} color="#999" />
          </View>
        </TouchableOpacity>
      </ScrollView>
      {/* <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: { fontSize: 16, fontWeight: 'bold' },
        tabBarIndicatorStyle: { backgroundColor: '#007bff' },
        tabBarActiveTintColor: '#007bff',
        tabBarInactiveTintColor: '#000',
      }}
    >
       <Tab.Screen name="LocationAdd" component={LocationAdd} />
      </Tab.Navigator> */}
      {/* <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="chart-box" size={24} color="#2196F3" />
          <Text style={styles.navText}>Overview</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="clipboard-text" size={24} color="#999" />
          <Text style={styles.navText}>Work Orders</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="view-grid" size={24} color="#999" />
          <Text style={styles.navText}>Assets</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="message" size={24} color="#999" />
          <Text style={styles.navText}>Messages</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="menu" size={24} color="#999" />
          <Text style={styles.navText}>More</Text>
        </TouchableOpacity>
      </View> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2196F3',
    padding: 16,
  },
  headerTitle: {
    flex: 1,
    color: '#fff',
    fontSize: 20,
    marginLeft: 16,
  },
  createButton: {
    color: '#fff',
    fontSize: 16,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  nameInput: {
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 8,
    marginBottom: 16,
  },
  imageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F9FF',
    padding: 16,
    borderRadius: 4,
    marginBottom: 24,
  },
  imageButtonText: {
    color: '#2196F3',
    marginLeft: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 4,
    padding: 12,
    height: 100,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  addressInput: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 4,
    padding: 12,
    marginBottom: 16,
  },
  fieldContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  fieldLabel: {
    fontSize: 16,
    color: '#333',
  },
  fieldLabelWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  fieldValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  assignText: {
    color: '#2196F3',
    marginRight: 8,
  },
  chooseText: {
    color: '#2196F3',
    marginRight: 8,
  },
  attachText: {
    color: '#2196F3',
    marginRight: 8,
  },
  parentLocationText: {
    color: '#2196F3',
    marginRight: 8,
  },
  bottomNav: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingVertical: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
});