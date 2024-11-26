import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  Modal,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { addLocation } from '../../redux/actions/locationAction';
import DocumentPicker, { DocumentPickerResponse } from 'react-native-document-picker';

export default function LocationAdd() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [locationName, setLocationName] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [teamsInCharge, setTeamsInCharge] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [files, setFiles] = useState<DocumentPickerResponse[]>([]);
  const [parentLocation, setParentLocation] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', content: null });

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
        qrCode,
        teamsInCharge,
        vendors,
        files: files.map(file => ({ name: file.name, size: file.size, type: file.type })),
        parentLocation,
      };

      // Save to AsyncStorage
      const existingLocationsJson = await AsyncStorage.getItem('locations');
      const existingLocations = existingLocationsJson ? JSON.parse(existingLocationsJson) : [];
      const updatedLocations = [...existingLocations, newLocation];
      await AsyncStorage.setItem('locations', JSON.stringify(updatedLocations));

      // Dispatch to Redux
      dispatch(addLocation(newLocation));

      Alert.alert('Success', 'Location saved successfully',newLocation);
      navigation.goBack();
    } catch (error) {
      console.error('Error saving location:', error);
      Alert.alert('Error', 'Failed to save location');
    }
  };

  const handleAssignQRCode = () => {
    setModalContent({
      title: 'Assign QR Code/Barcode',
      content: (
        <View>
          <TextInput
            style={styles.modalInput}
            placeholder="Enter QR Code/Barcode"
            value={qrCode}
            onChangeText={setQrCode}
          />
          <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
            <Text style={styles.modalButtonText}>Assign</Text>
          </TouchableOpacity>
        </View>
      ),
    });
    setModalVisible(true);
  };

  const handleChooseTeams = () => {
    // Implement team selection logic
  };

  const handleAssignVendors = () => {
    // Implement vendor assignment logic
  };

  const handleAttachFiles = () => {
    setModalContent({
      title: 'Attach Files',
      content: (
        <View style={styles.fileAttachmentContainer}>
          <FlatList
            data={files}
            keyExtractor={(item) => item.name}
            renderItem={({ item }) => (
              <View style={styles.fileItem}>
                <Text>{item.name} ({(item.size / 1024).toFixed(2)} KB)</Text>
                <TouchableOpacity onPress={() => removeFile(item.name)}>
                  <Icon name="close" size={20} color="#999" />
                </TouchableOpacity>
              </View>
            )}
          />
          <TouchableOpacity style={styles.selectFileButton} onPress={selectFile}>
            <Text style={styles.selectFileButtonText}>Select File</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
            <Text style={styles.modalButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      ),
    });
    setModalVisible(true);
  };

  const selectFile = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      setFiles([...files, ...result]);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker
      } else {
        console.error('Error selecting file:', err);
        Alert.alert('Error', 'Failed to select file');
      }
    }
  };

  const removeFile = (fileName: string) => {
    setFiles(files.filter(file => file.name !== fileName));
  };

  const handleChooseParentLocation = () => {
    // Implement parent location selection logic
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

        <FieldOption 
          label="QR Code/Barcode" 
          value={qrCode || "Assign"} 
          onPress={handleAssignQRCode} 
        />
        <FieldOption 
          label="Teams in Charge" 
          value={teamsInCharge.length > 0 ? `${teamsInCharge.length} team(s)` : "Choose"} 
          onPress={handleChooseTeams} 
        />
        <FieldOption 
          label="Vendors" 
          value={vendors.length > 0 ? `${vendors.length} vendor(s)` : "Assign"} 
          onPress={handleAssignVendors} 
        />
        <FieldOption 
          label="Files" 
          value={files.length > 0 ? `${files.length} file(s)` : "Attach"} 
          onPress={handleAttachFiles} 
        />
        <FieldOption 
          label="Parent Location" 
          value={parentLocation || "Choose"} 
          icon="lock" 
          onPress={handleChooseParentLocation} 
        />
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>{modalContent.title}</Text>
          {modalContent.content}
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function FieldOption({ label, value, icon, onPress }) {
  return (
    <TouchableOpacity style={styles.fieldContainer} onPress={onPress}>
      <View style={styles.fieldLabelWithIcon}>
        <Text style={styles.fieldLabel}>{label}</Text>
        {icon && <Icon name={icon} size={16} color="#999" />}
      </View>
      <View style={styles.fieldValue}>
        <Text style={styles.fieldValueText}>{value}</Text>
        <Icon name="chevron-right" size={24} color="#999" />
      </View>
    </TouchableOpacity>
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
  fieldValueText: {
    color: '#2196F3',
    marginRight: 8,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalTitle: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold'
  },
  modalInput: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: 200
  },
  modalButton: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: '#2196F3',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  fileAttachmentContainer: {
    width: '100%',
    maxHeight: 300,
  },
  fileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectFileButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 4,
    marginTop: 10,
    alignItems: 'center',
  },
  selectFileButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

