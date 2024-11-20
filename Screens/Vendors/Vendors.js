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
  SegmentedButtons,
} from 'react-native-paper';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
const Vendors = ({ navigation }) => {
  const theme = useTheme();
  const [vendors, setVendors] = useState([]);
  const [showAddVendor, setShowAddVendor] = useState(false);
  const [showImageOptions, setShowImageOptions] = useState(false);
  const [showVendorTypes, setShowVendorTypes] = useState(false);
  const [showLocations, setShowLocations] = useState(false);
  const [showAssets, setShowAssets] = useState(false);
  const [showFiles, setShowFiles] = useState(false);
  // Form states
  const [vendorName, setVendorName] = useState('');
  const [vendorImage, setVendorImage] = useState(null);
  const [selectedColor, setSelectedColor] = useState('#1976D2');
  const [description, setDescription] = useState('');
  const [contacts, setContacts] = useState([]);
  const [vendorType, setVendorType] = useState('');
  const [location, setLocation] = useState('');
  const [assets, setAssets] = useState([]);
  const [files, setFiles] = useState([]);
  // Search states
  const [vendorTypeSearch, setVendorTypeSearch] = useState('');
  const [locationSearch, setLocationSearch] = useState('');
  // Predefined data
  const colors = [
    '#1976D2', '#388E3C', '#E64A19', '#7B1FA2',
    '#C2185B', '#FBC02D', '#455A64', '#D32F2F'
  ];
  const vendorTypes = [
    { id: '1', name: 'Supplier' },
    { id: '2', name: 'Manufacturer' },
    { id: '3', name: 'Service Provider' },
    { id: '4', name: 'Contractor' },
    { id: '5', name: 'Consultant' }
  ];
  const locations = [
    { id: '1', name: 'Main Warehouse' },
    { id: '2', name: 'Production Floor' },
    { id: '3', name: 'Office Building' },
    { id: '4', name: 'Distribution Center' }
  ];
  // Handle image capture/selection
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
    if (response.didCancel) {
      return;
    }
    if (response.error) {
      Alert.alert('Error', 'Image selection failed');
      return;
    }
    if (response.assets && response.assets[0]) {
      setVendorImage(response.assets[0].uri);
    }
  };
  // Handle adding new vendor
  const handleAddVendor = () => {
    if (!vendorName.trim()) {
      Alert.alert('Error', 'Please enter vendor name');
      return;
    }
    const newVendor = {
      id: (vendors.length + 1).toString(),
      name: vendorName,
      image: vendorImage,
      color: selectedColor,
      description,
      contacts,
      type: vendorType,
      location,
      assets,
      files,
    };
    setVendors([...vendors, newVendor]);
    resetForm();
    setShowAddVendor(false);
  };
  // Reset form
  const resetForm = () => {
    setVendorName('');
    setVendorImage(null);
    setSelectedColor('#1976D2');
    setDescription('');
    setContacts([]);
    setVendorType('');
    setLocation('');
    setAssets([]);
    setFiles([]);
  };
  // Render empty state
  if (vendors.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        {/* <Image
          source={require('../../assets/empty-vendors.png')}
          style={styles.emptyImage}
        /> */}
        <Text style={styles.emptyTitle}>No Vendors Yet</Text>
        <Text style={styles.emptyDescription}>
          Add your first vendor to start managing your supplier relationships
        </Text>
        <Button
          mode="contained"
          onPress={() => setShowAddVendor(true)}
          style={styles.addButton}
        >
          Create Vendor
        </Button>
        {/* Add Vendor Dialog */}
        <Portal>
          <Dialog visible={showAddVendor} onDismiss={() => setShowAddVendor(false)}>
            <Dialog.Title>Add New Vendor</Dialog.Title>
            <Dialog.ScrollArea>
              <ScrollView>
                <View style={styles.dialogContent}>
                  {/* Vendor Name */}
                  <TextInput
                    label="Vendor Name"
                    value={vendorName}
                    onChangeText={setVendorName}
                    mode="outlined"
                    style={styles.input}
                  />
                  {/* Vendor Image */}
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
                  {/* Color Selection */}
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
                  {/* Description */}
                  <TextInput
                    label="Description"
                    value={description}
                    onChangeText={setDescription}
                    mode="outlined"
                    multiline
                    numberOfLines={3}
                    style={styles.input}
                  />
                  {/* Vendor Type */}
                  <List.Item
                    title="Vendor Type"
                    description={vendorType || "Select vendor type"}
                    onPress={() => setShowVendorTypes(true)}
                    left={props => <List.Icon {...props} icon="domain" />}
                    right={props => <List.Icon {...props} icon="chevron-right" />}
                  />
                  {/* Location */}
                  <List.Item
                    title="Location"
                    description={location || "Select location"}
                    onPress={() => setShowLocations(true)}
                    left={props => <List.Icon {...props} icon="map-marker" />}
                    right={props => <List.Icon {...props} icon="chevron-right" />}
                  />
                  {/* Assets and Files */}
                  <List.Item
                    title="Assets"
                    description={`${assets.length} assets selected`}
                    onPress={() => setShowAssets(true)}
                    left={props => <List.Icon {...props} icon="package-variant" />}
                    right={props => <List.Icon {...props} icon="chevron-right" />}
                  />
                  <List.Item
                    title="Files"
                    description={`${files.length} files attached`}
                    onPress={() => setShowFiles(true)}
                    left={props => <List.Icon {...props} icon="file-multiple" />}
                    right={props => <List.Icon {...props} icon="chevron-right" />}
                  />
                </View>
              </ScrollView>
            </Dialog.ScrollArea>
            <Dialog.Actions>
              <Button onPress={() => setShowAddVendor(false)}>Cancel</Button>
              <Button onPress={handleAddVendor}>Add Vendor</Button>
            </Dialog.Actions>
          </Dialog>
          {/* Image Options Dialog */}
          <Dialog visible={showImageOptions} onDismiss={() => setShowImageOptions(false)}>
            <Dialog.Title>Add Image</Dialog.Title>
            <Dialog.Content>
              <List.Item
                title="Take Photo"
                left={props => <List.Icon {...props} icon="camera" />}
                onPress={() => handleImagePicker('camera')}
              />
              <List.Item
                title="Choose from Gallery"
                left={props => <List.Icon {...props} icon="image" />}
                onPress={() => handleImagePicker('gallery')}
              />
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setShowImageOptions(false)}>Cancel</Button>
            </Dialog.Actions>
          </Dialog>
          {/* Vendor Types Dialog */}
          <Dialog visible={showVendorTypes} onDismiss={() => setShowVendorTypes(false)}>
            <Dialog.Title>Select Vendor Type</Dialog.Title>
            <Dialog.Content>
              <Searchbar
                placeholder="Search vendor types"
                onChangeText={setVendorTypeSearch}
                value={vendorTypeSearch}
                style={styles.searchBar}
              />
              {vendorTypes
                .filter(type => 
                  type.name.toLowerCase().includes(vendorTypeSearch.toLowerCase())
                )
                .map(type => (
                  <List.Item
                    key={type.id}
                    title={type.name}
                    onPress={() => {
                      setVendorType(type.name);
                      setShowVendorTypes(false);
                    }}
                  />
                ))}
            </Dialog.Content>
          </Dialog>
          {/* Locations Dialog */}
          <Dialog visible={showLocations} onDismiss={() => setShowLocations(false)}>
            <Dialog.Title>Select Location</Dialog.Title>
            <Dialog.Content>
              <Searchbar
                placeholder="Search locations"
                onChangeText={setLocationSearch}
                value={locationSearch}
                style={styles.searchBar}
              />
              {locations
                .filter(loc => 
                  loc.name.toLowerCase().includes(locationSearch.toLowerCase())
                )
                .map(loc => (
                  <List.Item
                    key={loc.id}
                    title={loc.name}
                    onPress={() => {
                      setLocation(loc.name);
                      setShowLocations(false);
                    }}
                  />
                ))}
            </Dialog.Content>
          </Dialog>
        </Portal>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      {/* Vendor list view will be implemented here */}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => setShowAddVendor(true)}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  emptyImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  emptyDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  addButton: {
    paddingHorizontal: 30,
  },
  dialogContent: {
    padding: 20,
  },
  input: {
    marginBottom: 15,
  },
  imageSection: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  imagePreview: {
    position: 'relative',
    width: '100%',
    height: 200,
    marginBottom: 10,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  removeImage: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  colorSection: {
    marginBottom: 15,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  colorItem: {
    width: 40,
    height: 40,
    borderRadius: 20,
    margin: 5,
  },
  selectedColor: {
    borderWidth: 3,
    borderColor: '#000',
  },
  searchBar: {
    marginBottom: 10,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
export default Vendors;
