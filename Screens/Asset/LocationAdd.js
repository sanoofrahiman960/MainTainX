import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  Image,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useLocationAsset } from '../../hooks/useLocationAsset';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import * as ImagePicker from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
import { BarCodeScanner } from 'expo-barcode-scanner';
import uuid from 'react-native-uuid';

export default function LocationAdd({ route }) {
  const navigation = useNavigation();
  const { addNewLocation, updateLocation, locations } = useLocationAsset();

  // Get editing location from route params if it exists
  const editingLocation = route?.params?.location;
  const isEditing = route?.params?.isEditing;

  // Initialize state with existing location data if editing
  const [locationName, setLocationName] = useState(editingLocation?.name || '');
  const [description, setDescription] = useState(editingLocation?.description || '');
  const [address, setAddress] = useState(editingLocation?.address || '');
  const [images, setImages] = useState(editingLocation?.images || []);
  const [qrCode, setQrCode] = useState(editingLocation?.qrCode || '');
  const [barCode, setBarCode] = useState(editingLocation?.barCode || '');
  const [teamsInCharge, setTeamsInCharge] = useState(editingLocation?.teamsInCharge || []);
  const [vendors, setVendors] = useState(editingLocation?.vendors || []);
  const [files, setFiles] = useState(editingLocation?.files || []);
  const [parentLocation, setParentLocation] = useState(editingLocation?.parentLocation || '');
  const [showScanner, setShowScanner] = useState(false);
  const [newTeam, setNewTeam] = useState('');
  const [newVendor, setNewVendor] = useState({ name: '', contact: '' });

  const Tab = createMaterialTopTabNavigator();

  // Image Picker
  const pickImage = async () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };

    try {
      const result = await ImagePicker.launchImageLibrary(options);
      if (!result.cancelled && result.assets[0]) {
        setImages([...images, result.assets[0].uri]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  // Take Picture
  const takePicture = async () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };

    try {
      const result = await ImagePicker.launchCamera(options);
      if (!result.cancelled && result.assets[0]) {
        setImages([...images, result.assets[0].uri]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take picture');
    }
  };

  // File Picker
  const pickFile = async () => {
    try {
      const results = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
        allowMultiSelection: true,
      });
      
      const newFiles = results.map(result => ({
        name: result.name,
        uri: result.uri,
        type: result.type,
        size: result.size
      }));
      
      setFiles([...files, ...newFiles]);
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        Alert.alert('Error', 'Failed to pick file');
      }
    }
  };

  // Add Team
  const addTeam = () => {
    if (newTeam.trim()) {
      setTeamsInCharge([...teamsInCharge, newTeam.trim()]);
      setNewTeam('');
    }
  };

  // Add Vendor
  const addVendor = () => {
    if (newVendor.name.trim()) {
      setVendors([...vendors, { ...newVendor, id: Date.now().toString() }]);
      setNewVendor({ name: '', contact: '' });
    }
  };

  const handleSave = () => {
    if (!locationName.trim()) {
      Alert.alert('Error', 'Location name is required');
      return;
    }

    const newLocation = {
      id: isEditing ? editingLocation.id : uuid.v4(),
      name: locationName.trim(),
      description: description.trim(),
      address: address.trim(),
      images,
      qrCode,
      barCode,
      teamsInCharge,
      vendors,
      files,
      parentLocation,
      createdAt: isEditing ? editingLocation.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (isEditing) {
      // Update existing location
      updateLocation(newLocation);
      Alert.alert('Success', 'Location updated successfully');
    } else {
      // Add new location
      addNewLocation(newLocation);
      Alert.alert('Success', 'Location added successfully');
    }

    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.formContainer}>
          {/* Basic Information */}
          <Text style={styles.sectionTitle}>Basic Information</Text>
          <TextInput
            style={styles.input}
            placeholder="Location Name"
            value={locationName}
            onChangeText={setLocationName}
          />
          <TextInput
            style={[styles.input, styles.multilineInput]}
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            multiline
          />
          <TextInput
            style={[styles.input, styles.multilineInput]}
            placeholder="Address"
            value={address}
            onChangeText={setAddress}
            multiline
          />

          {/* Images Section */}
          <Text style={styles.sectionTitle}>Images</Text>
          <View style={styles.imageButtons}>
            <TouchableOpacity style={styles.button} onPress={pickImage}>
              <Icon name="image-plus" size={24} color="#fff" />
              <Text style={styles.buttonText}>Pick Image</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={takePicture}>
              <Icon name="camera" size={24} color="#fff" />
              <Text style={styles.buttonText}>Take Picture</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal style={styles.imagePreview}>
            {images.map((uri, index) => (
              <Image key={index} source={{ uri }} style={styles.previewImage} />
            ))}
          </ScrollView>

          {/* QR/Barcode Section */}
          <Text style={styles.sectionTitle}>QR/Bar Code</Text>
          <View style={styles.codeContainer}>
            <TextInput
              style={styles.input}
              placeholder="QR Code"
              value={qrCode}
              onChangeText={setQrCode}
            />
            <TouchableOpacity style={styles.scanButton} onPress={() => setShowScanner(true)}>
              <Icon name="qrcode-scan" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Teams Section */}
          <Text style={styles.sectionTitle}>Teams in Charge</Text>
          <View style={styles.teamContainer}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Add Team"
              value={newTeam}
              onChangeText={setNewTeam}
            />
            <TouchableOpacity style={styles.addButton} onPress={addTeam}>
              <Icon name="plus" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          {teamsInCharge.map((team, index) => (
            <View key={index} style={styles.chip}>
              <Text>{team}</Text>
              <TouchableOpacity onPress={() => {
                setTeamsInCharge(teamsInCharge.filter((_, i) => i !== index));
              }}>
                <Icon name="close" size={20} color="#666" />
              </TouchableOpacity>
            </View>
          ))}

          {/* Vendors Section */}
          <Text style={styles.sectionTitle}>Vendors</Text>
          <View style={styles.vendorContainer}>
            <TextInput
              style={styles.input}
              placeholder="Vendor Name"
              value={newVendor.name}
              onChangeText={(text) => setNewVendor({ ...newVendor, name: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Contact Info"
              value={newVendor.contact}
              onChangeText={(text) => setNewVendor({ ...newVendor, contact: text })}
            />
            <TouchableOpacity style={styles.addButton} onPress={addVendor}>
              <Icon name="plus" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          {vendors.map((vendor, index) => (
            <View key={vendor.id} style={styles.vendorChip}>
              <Text>{vendor.name}</Text>
              <Text>{vendor.contact}</Text>
              <TouchableOpacity onPress={() => {
                setVendors(vendors.filter((_, i) => i !== index));
              }}>
                <Icon name="close" size={20} color="#666" />
              </TouchableOpacity>
            </View>
          ))}

          {/* Files Section */}
          <Text style={styles.sectionTitle}>Files</Text>
          <TouchableOpacity style={styles.button} onPress={pickFile}>
            <Icon name="file-plus" size={24} color="#fff" />
            <Text style={styles.buttonText}>Add File</Text>
          </TouchableOpacity>
          {files.map((file, index) => (
            <View key={index} style={styles.fileChip}>
              <Icon name="file" size={20} color="#666" />
              <Text>{file.name}</Text>
              <TouchableOpacity onPress={() => {
                setFiles(files.filter((_, i) => i !== index));
              }}>
                <Icon name="close" size={20} color="#666" />
              </TouchableOpacity>
            </View>
          ))}

          {/* Parent Location */}
          <Text style={styles.sectionTitle}>Parent Location</Text>
          <TextInput
            style={styles.input}
            placeholder="Parent Location ID"
            value={parentLocation}
            onChangeText={setParentLocation}
          />

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>{isEditing ? 'Update Location' : 'Save Location'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  formContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  imageButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0.48,
  },
  buttonText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 16,
  },
  imagePreview: {
    height: 120,
    marginBottom: 16,
  },
  previewImage: {
    width: 100,
    height: 100,
    marginRight: 8,
    borderRadius: 8,
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scanButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    marginLeft: 8,
  },
  teamContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    marginLeft: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 16,
    marginBottom: 8,
  },
  vendorContainer: {
    marginBottom: 12,
  },
  vendorChip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 16,
    marginBottom: 8,
  },
  fileChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 16,
    marginBottom: 8,
  },
  saveButton: {
    backgroundColor: '#34C759',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});