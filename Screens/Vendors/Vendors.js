import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  Portal,
  Dialog,
  List,
  Divider,
  IconButton,
  Searchbar,
  FAB,
  Surface,
  useTheme,
  Checkbox,
} from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { addVendor, updateVendor, deleteVendor, selectVendor, unselectVendor } from '../../redux/slices/vendorSlice';

const Vendors = ({ navigation }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const vendors = useSelector(state => state.vendor.vendors);
  const selectedVendors = useSelector(state => state.vendor.selectedVendors);
  const locations = useSelector(state => state.location.locations);

  const [showAddVendor, setShowAddVendor] = useState(false);
  const [showImageOptions, setShowImageOptions] = useState(false);
  const [showVendorTypes, setShowVendorTypes] = useState(false);
  const [showLocations, setShowLocations] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Form states
  const [vendorName, setVendorName] = useState('');
  const [vendorImage, setVendorImage] = useState(null);
  const [selectedColor, setSelectedColor] = useState('#1976D2');
  const [description, setDescription] = useState('');
  const [vendorType, setVendorType] = useState('');
  const [location, setLocation] = useState('');
  const [files, setFiles] = useState([]);

  // Predefined data
  const colors = [
    '#1976D2', '#388E3C', '#E64A19', '#7B1FA2',
    '#C2185B', '#FBC02D', '#455A64', '#D32F2F'
  ];

  const vendorTypes = [
    { id: '1', name: 'Supplier', color: '#1976D2' },
    { id: '2', name: 'Manufacturer', color: '#388E3C' },
    { id: '3', name: 'Service Provider', color: '#E64A19' },
    { id: '4', name: 'Contractor', color: '#7B1FA2' },
    { id: '5', name: 'Consultant', color: '#C2185B' }
  ];

  const handleImagePicker = (type) => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
      quality: 0.8,
    };
    if (type === 'camera') {
      launchCamera(options, handleImageResponse);
    } else {
      launchImageLibrary(options, handleImageResponse);
    }
    setShowImageOptions(false);
  };

  const handleImageResponse = (response) => {
    if (response.didCancel) return;
    if (response.error) {
      Alert.alert('Error', 'Image selection failed');
      return;
    }
    if (response.assets && response.assets[0]) {
      setVendorImage(response.assets[0].uri);
    }
  };

  const handleAddVendor = () => {
    if (!vendorName.trim()) {
      Alert.alert('Error', 'Please enter vendor name');
      return;
    }

    const vendorData = {
      id: editingVendor ? editingVendor.id : Date.now().toString(),
      name: vendorName,
      image: vendorImage,
      color: selectedColor,
      description,
      type: vendorType,
      location,
      files,
    };

    if (editingVendor) {
      dispatch(updateVendor(vendorData));
    } else {
      dispatch(addVendor(vendorData));
    }

    resetForm();
    setShowAddVendor(false);
  };

  const handleDeleteVendor = (vendorId) => {
    Alert.alert(
      'Delete Vendor',
      'Are you sure you want to delete this vendor?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete',
          style: 'destructive',
          onPress: () => dispatch(deleteVendor(vendorId))
        }
      ]
    );
  };

  const handleVendorSelection = (vendorId) => {
    if (selectedVendors.includes(vendorId)) {
      dispatch(unselectVendor(vendorId));
    } else {
      dispatch(selectVendor(vendorId));
    }
  };

  const resetForm = () => {
    setVendorName('');
    setVendorImage(null);
    setSelectedColor('#1976D2');
    setDescription('');
    setVendorType('');
    setLocation('');
    setFiles([]);
    setEditingVendor(null);
  };

  const filteredVendors = vendors.filter(vendor => 
    vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vendor.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search vendors"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />

      <ScrollView>
        {filteredVendors.map((vendor) => (
          <Surface key={vendor.id} style={styles.vendorCard}>
            <View style={styles.vendorHeader}>
              <View style={styles.vendorInfo}>
                {vendor.image && (
                  <Image source={{ uri: vendor.image }} style={styles.vendorImage} />
                )}
                <View>
                  <Text style={styles.vendorName}>{vendor.name}</Text>
                  <Text style={styles.vendorType}>
                    {vendorTypes.find(t => t.id === vendor.type)?.name}
                  </Text>
                </View>
              </View>
              <View style={styles.actions}>
                <Checkbox
                  status={selectedVendors.includes(vendor.id) ? 'checked' : 'unchecked'}
                  onPress={() => handleVendorSelection(vendor.id)}
                />
                <IconButton
                  icon="pencil"
                  onPress={() => {
                    setEditingVendor(vendor);
                    setVendorName(vendor.name);
                    setVendorImage(vendor.image);
                    setSelectedColor(vendor.color);
                    setDescription(vendor.description);
                    setVendorType(vendor.type);
                    setLocation(vendor.location);
                    setFiles(vendor.files || []);
                    setShowAddVendor(true);
                  }}
                />
                <IconButton
                  icon="delete"
                  onPress={() => handleDeleteVendor(vendor.id)}
                />
              </View>
            </View>
            {vendor.description && (
              <Text style={styles.description}>{vendor.description}</Text>
            )}
          </Surface>
        ))}
      </ScrollView>

      <FAB
        icon="plus"
        onPress={() => setShowAddVendor(true)}
        style={styles.fab}
      />

      <Portal>
        <Dialog visible={showAddVendor} onDismiss={() => {
          setShowAddVendor(false);
          resetForm();
        }}>
          <Dialog.Title>{editingVendor ? 'Edit Vendor' : 'Add New Vendor'}</Dialog.Title>
          <Dialog.ScrollArea>
            <ScrollView>
              <View style={styles.dialogContent}>
                <TextInput
                  label="Vendor Name"
                  value={vendorName}
                  onChangeText={setVendorName}
                  mode="outlined"
                  style={styles.input}
                />

                <View style={styles.imageSection}>
                  <Text style={styles.sectionTitle}>Vendor Image</Text>
                  {vendorImage ? (
                    <View style={styles.imagePreview}>
                      <Image source={{ uri: vendorImage }} style={styles.previewImage} />
                      <IconButton
                        icon="close"
                        size={20}
                        onPress={() => setVendorImage(null)}
                        style={styles.removeImage}
                      />
                    </View>
                  ) : (
                    <Button
                      mode="outlined"
                      onPress={() => setShowImageOptions(true)}
                      icon="camera"
                    >
                      Add Image
                    </Button>
                  )}
                </View>

                <TextInput
                  label="Description"
                  value={description}
                  onChangeText={setDescription}
                  mode="outlined"
                  multiline
                  numberOfLines={3}
                  style={styles.input}
                />

                <List.Item
                  title="Vendor Type"
                  description={vendorTypes.find(t => t.id === vendorType)?.name || 'Select type'}
                  onPress={() => setShowVendorTypes(true)}
                  right={props => <List.Icon {...props} icon="chevron-right" />}
                />

                <List.Item
                  title="Location"
                  description={location || 'Select location'}
                  onPress={() => setShowLocations(true)}
                  right={props => <List.Icon {...props} icon="chevron-right" />}
                />

                <View style={styles.colorSection}>
                  <Text style={styles.sectionTitle}>Vendor Color</Text>
                  <View style={styles.colorGrid}>
                    {colors.map((color) => (
                      <TouchableOpacity
                        key={color}
                        style={[
                          styles.colorItem,
                          { backgroundColor: color },
                          selectedColor === color && styles.selectedColor,
                        ]}
                        onPress={() => setSelectedColor(color)}
                      />
                    ))}
                  </View>
                </View>
              </View>
            </ScrollView>
          </Dialog.ScrollArea>
          <Dialog.Actions>
            <Button onPress={() => {
              setShowAddVendor(false);
              resetForm();
            }}>Cancel</Button>
            <Button mode="contained" onPress={handleAddVendor}>
              {editingVendor ? 'Update' : 'Add'} Vendor
            </Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog visible={showImageOptions} onDismiss={() => setShowImageOptions(false)}>
          <Dialog.Title>Add Image</Dialog.Title>
          <Dialog.Content>
            <Button
              icon="camera"
              mode="outlined"
              onPress={() => handleImagePicker('camera')}
              style={styles.imageButton}
            >
              Take Photo
            </Button>
            <Button
              icon="image"
              mode="outlined"
              onPress={() => handleImagePicker('gallery')}
              style={styles.imageButton}
            >
              Choose from Gallery
            </Button>
          </Dialog.Content>
        </Dialog>

        <Dialog visible={showVendorTypes} onDismiss={() => setShowVendorTypes(false)}>
          <Dialog.Title>Select Vendor Type</Dialog.Title>
          <Dialog.Content>
            {vendorTypes.map((type) => (
              <List.Item
                key={type.id}
                title={type.name}
                onPress={() => {
                  setVendorType(type.id);
                  setShowVendorTypes(false);
                }}
                left={props => (
                  <View style={[styles.typeIndicator, { backgroundColor: type.color }]} />
                )}
              />
            ))}
          </Dialog.Content>
        </Dialog>

        <Dialog visible={showLocations} onDismiss={() => setShowLocations(false)}>
          <Dialog.Title>Select Location</Dialog.Title>
          <Dialog.Content>
            {locations.map((loc, index) => (
              <List.Item
                key={index}
                title={loc}
                onPress={() => {
                  setLocation(loc);
                  setShowLocations(false);
                }}
              />
            ))}
          </Dialog.Content>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchbar: {
    margin: 16,
  },
  vendorCard: {
    margin: 8,
    padding: 16,
    elevation: 2,
  },
  vendorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vendorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vendorImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  vendorName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  vendorType: {
    fontSize: 14,
    color: '#666',
  },
  description: {
    marginTop: 8,
    color: '#666',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dialogContent: {
    padding: 16,
  },
  input: {
    marginBottom: 16,
  },
  imageSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 8,
  },
  imagePreview: {
    position: 'relative',
    alignItems: 'center',
  },
  previewImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
  },
  removeImage: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  colorSection: {
    marginTop: 16,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  colorItem: {
    width: 40,
    height: 40,
    borderRadius: 20,
    margin: 4,
  },
  selectedColor: {
    borderWidth: 2,
    borderColor: '#000',
  },
  imageButton: {
    marginBottom: 8,
  },
  typeIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
});

export default Vendors;
