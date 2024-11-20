import React, { useState, useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  FlatList,
} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  Appbar,
  Portal,
  Dialog,
  List,
  Divider,
  IconButton,
  Menu,
  SegmentedButtons,
  FAB,
  Searchbar,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Navigation from '../../Navigation/Navigation';
import { useNavigation } from '@react-navigation/native';

const AddAsset = ({ navigation }) => {
  // State for form fields
  const [assetImage, setAssetImage] = useState(null);
  const [task, setTask] = useState('');
  const [description, setDescription] = useState('');
  const [barcode, setBarcode] = useState('');
  const [location, setLocation] = useState('');
  const [criticality, setCriticality] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [model, setModel] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [year, setYear] = useState('');
  const [assetType, setAssetType] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [team, setTeam] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [parts, setParts] = useState([]);
  const [showImageOptions, setShowImageOptions] = useState(false);

  // Dialog visibility states
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showTeamPicker, setShowTeamPicker] = useState(false);
  const [showVendorPicker, setShowVendorPicker] = useState(false);
  const [showPartsPicker, setShowPartsPicker] = useState(false);
  const [showAssetTypePicker, setShowAssetTypePicker] = useState(false);
  const [showAddAssetType, setShowAddAssetType] = useState(false);
  const [showAddPart, setShowAddPart] = useState(false);

  // Sample data
  const criticalityLevels = [
    { value: 'Critical', label: 'Critical' },
    { value: 'Important', label: 'Important' },
    { value: 'Normal', label: 'Normal' },
  ];

  // Asset Types State
  const [assetTypes, setAssetTypes] = useState([
    { id: '1', name: 'Machinery', category: 'Equipment' },
    { id: '2', name: 'Electronics', category: 'Equipment' },
    { id: '3', name: 'Vehicles', category: 'Transport' },
    { id: '4', name: 'Tools', category: 'Equipment' },
    { id: '5', name: 'Infrastructure', category: 'Facility' },
    { id: '6', name: 'HVAC', category: 'Facility' },
    { id: '7', name: 'Safety Equipment', category: 'Safety' },
  ]);
  const [newAssetTypeName, setNewAssetTypeName] = useState('');
  const [newAssetCategory, setNewAssetCategory] = useState('');
  const [assetTypeSearchQuery, setAssetTypeSearchQuery] = useState('');

  // Parts State
  const [partsList, setPartsList] = useState([
    { id: '1', name: 'Motor', category: 'Mechanical', quantity: 5 },
    { id: '2', name: 'Circuit Board', category: 'Electronic', quantity: 10 },
    { id: '3', name: 'Belt', category: 'Mechanical', quantity: 15 },
    { id: '4', name: 'Filter', category: 'Consumable', quantity: 20 },
    { id: '5', name: 'Sensor', category: 'Electronic', quantity: 8 },
  ]);
  const [newPartName, setNewPartName] = useState('');
  const [newPartCategory, setNewPartCategory] = useState('');
  const [newPartQuantity, setNewPartQuantity] = useState('');
  const [partsSearchQuery, setPartsSearchQuery] = useState('');

  // Categories
  const assetCategories = ['Equipment', 'Transport', 'Facility', 'Safety', 'Other'];
  const partCategories = ['Mechanical', 'Electronic', 'Consumable', 'Safety', 'Other'];

  // Location data
  const [locations, setLocations] = useState([
    { id: '1', name: 'Main Building', type: 'Building' },
    { id: '2', name: 'Production Floor', type: 'Area' },
    { id: '3', name: 'Warehouse A', type: 'Storage' },
    { id: '4', name: 'Maintenance Shop', type: 'Workshop' },
    { id: '5', name: 'Assembly Line 1', type: 'Production' },
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddLocation, setShowAddLocation] = useState(false);
  const [newLocationName, setNewLocationName] = useState('');
  const [newLocationType, setNewLocationType] = useState('');

  // Location type options
  const locationTypes = [
    'Building',
    'Area',
    'Storage',
    'Workshop',
    'Production',
    'Office',
    'Other'
  ];

  // Filter locations based on search
  const filteredLocations = locations.filter(location =>
    location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    location.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter functions
  const filteredAssetTypes = assetTypes.filter(type =>
    type.name.toLowerCase().includes(assetTypeSearchQuery.toLowerCase()) ||
    type.category.toLowerCase().includes(assetTypeSearchQuery.toLowerCase())
  );

  const filteredParts = partsList.filter(part =>
    part.name.toLowerCase().includes(partsSearchQuery.toLowerCase()) ||
    part.category.toLowerCase().includes(partsSearchQuery.toLowerCase())
  );

  // Handle adding new location
  const handleAddLocation = () => {
    if (!newLocationName.trim()) {
      Alert.alert('Error', 'Please enter a location name');
      return;
    }
    if (!newLocationType) {
      Alert.alert('Error', 'Please select a location type');
      return;
    }

    const newLocation = {
      id: (locations.length + 1).toString(),
      name: newLocationName.trim(),
      type: newLocationType,
    };

    setLocations([...locations, newLocation]);
    setNewLocationName('');
    setNewLocationType('');
    setShowAddLocation(false);
    Alert.alert('Success', 'New location added successfully');
  };

  // Handle adding new asset type
  const handleAddAssetType = () => {
    if (!newAssetTypeName.trim()) {
      Alert.alert('Error', 'Please enter an asset type name');
      return;
    }
    if (!newAssetCategory) {
      Alert.alert('Error', 'Please select a category');
      return;
    }

    const newType = {
      id: (assetTypes.length + 1).toString(),
      name: newAssetTypeName.trim(),
      category: newAssetCategory,
    };

    setAssetTypes([...assetTypes, newType]);
    setNewAssetTypeName('');
    setNewAssetCategory('');
    setShowAddAssetType(false);
    Alert.alert('Success', 'New asset type added successfully');
  };

  // Handle adding new part
  const handleAddPart = () => {
    if (!newPartName.trim()) {
      Alert.alert('Error', 'Please enter a part name');
      return;
    }
    if (!newPartCategory) {
      Alert.alert('Error', 'Please select a category');
      return;
    }
    if (!newPartQuantity || isNaN(newPartQuantity)) {
      Alert.alert('Error', 'Please enter a valid quantity');
      return;
    }

    const newPart = {
      id: (partsList.length + 1).toString(),
      name: newPartName.trim(),
      category: newPartCategory,
      quantity: parseInt(newPartQuantity),
    };

    setPartsList([...partsList, newPart]);
    setNewPartName('');
    setNewPartCategory('');
    setNewPartQuantity('');
    setShowAddPart(false);
    Alert.alert('Success', 'New part added successfully');
  };

  // Select location
  const handleSelectLocation = (selectedLocation) => {
    setLocation(`${selectedLocation.name} (${selectedLocation.type})`);
    setShowLocationPicker(false);
  };

  // Select handlers
  const handleSelectAssetType = (selectedType) => {
    setAssetType(selectedType.name);
    setShowAssetTypePicker(false);
  };

  const handleSelectPart = (selectedPart) => {
    setParts([...parts, selectedPart]);
    setShowPartsPicker(false);
  };

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
      launchCamera(options, (response) => {
        if (response.didCancel) {
          console.log('User cancelled camera');
        } else if (response.error) {
          console.log('Camera Error: ', response.error);
          Alert.alert('Error', 'Failed to take photo. Please try again.');
        } else if (response.assets && response.assets[0]) {
          setAssetImage(response.assets[0].uri);
        }
      });
    } else {
      launchImageLibrary(options, (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
          Alert.alert('Error', 'Failed to select image. Please try again.');
        } else if (response.assets && response.assets[0]) {
          setAssetImage(response.assets[0].uri);
        }
      });
    }
    setShowImageOptions(false);
  };

  // Handle file attachments
  const handleAttachment = () => {
    Alert.alert(
      'Add Attachment',
      'Choose attachment type',
      [
        {
          text: 'Take Photo',
          onPress: () => handleImagePicker('camera'),
        },
        {
          text: 'Choose from Library',
          onPress: () => handleImagePicker('library'),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  // Handle barcode input
  const handleBarcodeScan = () => {
    Alert.prompt(
      'Enter Barcode',
      'Please enter the barcode number:',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: code => setBarcode(code || ''),
        },
      ],
      'plain-text',
      '',
      'numeric'
    );
  };

  const handleSave = () => {
    // Validate required fields
    if (!task || !description || !location || !criticality) {
      Alert.alert('Required Fields', 'Please fill in all required fields');
      return;
    }

    // Create asset object
    const asset = {
      task,
      description,
      barcode,
      location,
      criticality,
      serialNumber,
      model,
      manufacturer,
      year,
      assetType,
      image: assetImage,
      attachments,
      team,
      vendors,
      parts,
    };

    // Here you would typically send this to your backend
    console.log('Saving asset:', asset);

    // Navigate back
    navigation.goBack();
  };
  const Navigation=useNavigation()

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Add New Asset" />
        <Appbar.Action icon="check" onPress={handleSave} />
      </Appbar.Header>

      <ScrollView style={styles.scrollView}>
        {/* Image Section */}
        <View style={styles.imageSection}>
          {assetImage ? (
            <TouchableOpacity onPress={() => setShowImageOptions(true)}>
              <Image source={{ uri: assetImage }} style={styles.assetImage} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.imagePlaceholder}
              onPress={() => setShowImageOptions(true)}
            >
              <Icon name="camera-plus" size={40} color="#666" />
              <Text>Add Photo</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Basic Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>

          <TextInput
            label="Task *"
            value={task}
            onChangeText={setTask}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Description *"
            value={description}
            onChangeText={setDescription}
            mode="outlined"
            multiline
            numberOfLines={3}
            style={styles.input}
          />

          <View style={styles.barcodeContainer}>
            <TextInput
              label="QR Code/Barcode"
              value={barcode}
              onChangeText={setBarcode}
              mode="outlined"
              style={styles.barcodeInput}
              keyboardType="numeric"
            />
            <IconButton
              icon="keyboard"
              size={24}
              onPress={handleBarcodeScan}
              style={styles.scanButton}
            />
          </View>
        </View>

        {/* Location and Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location & Details</Text>

          <List.Item
            title="Location *"
            description={location || "Select location"}
            onPress={() => setShowLocationPicker(true)}
            right={props => <List.Icon {...props} icon="chevron-right" />}
          />

          <Text style={styles.inputLabel}>Criticality *</Text>
          <SegmentedButtons
            value={criticality}
            onValueChange={setCriticality}
            buttons={criticalityLevels.map(level => ({
              value: level.value,
              label: level.label,
            }))}
            style={styles.segmentedButtons}
          />

          <TextInput
            label="Serial Number"
            value={serialNumber}
            onChangeText={setSerialNumber}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Model"
            value={model}
            onChangeText={setModel}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Manufacturer"
            value={manufacturer}
            onChangeText={setManufacturer}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Year"
            value={year}
            onChangeText={setYear}
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
          />
        </View>

        {/* Asset Type */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Asset Type</Text>
          <List.Item
            title="Asset Type"
            description={assetType || "Select asset type"}
            onPress={() => setShowAssetTypePicker(true)}
            right={props => <List.Icon {...props} icon="chevron-right" />}
          />
        </View>

        {/* Teams, Vendors, and Parts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Teams & Vendors</Text>

          <List.Item
            title="Teams in Charge"
            description={team.length > 0 ? `${team.length} teams selected` : "Select teams"}
            onPress={() => setShowTeamPicker(true)}
            right={props => <List.Icon {...props} icon="chevron-right" />}
          />

          <List.Item
            title="Vendors"
            description={vendors.length > 0 ? `${vendors.length} vendors selected` : "Select vendors"}
            onPress={() => { Navigation.navigate("Vendors")  }}
            right={props => <List.Icon {...props} icon="chevron-right" />}
          />

          <List.Item
            title="Parts"
            description={parts.length > 0 ? `${parts.length} parts added` : "Add parts"}
            onPress={() => setShowPartsPicker(true)}
            right={props => <List.Icon {...props} icon="chevron-right" />}
          />
        </View>

        {/* Attachments */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Attachments</Text>
          <Button
            mode="outlined"
            icon="file-plus"
            onPress={handleAttachment}
            style={styles.attachButton}
          >
            Add Files
          </Button>
          {attachments.map((file, index) => (
            <List.Item
              key={index}
              title={file.name}
              left={props => <List.Icon {...props} icon="file" />}
              right={props => (
                <IconButton
                  {...props}
                  icon="close"
                  onPress={() => {
                    const newAttachments = [...attachments];
                    newAttachments.splice(index, 1);
                    setAttachments(newAttachments);
                  }}
                />
              )}
            />
          ))}
        </View>
      </ScrollView>

      {/* Image Options Dialog */}
      <Portal>
        <Dialog visible={showImageOptions} onDismiss={() => setShowImageOptions(false)}>
          <Dialog.Title>Add Photo</Dialog.Title>
          <Dialog.Content>
            <List.Item
              title="Take Photo"
              left={props => <List.Icon {...props} icon="camera" />}
              onPress={() => handleImagePicker('camera')}
            />
            <List.Item
              title="Choose from Library"
              left={props => <List.Icon {...props} icon="image" />}
              onPress={() => handleImagePicker('library')}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowImageOptions(false)}>Cancel</Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog visible={showLocationPicker} onDismiss={() => setShowLocationPicker(false)} style={styles.locationDialog}>
          <Dialog.Title>Select Location</Dialog.Title>
          <Dialog.Content>
            <Searchbar
              placeholder="Search locations..."
              onChangeText={setSearchQuery}
              value={searchQuery}
              style={styles.searchBar}
            />
            <FlatList
              data={filteredLocations}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <List.Item
                  title={item.name}
                  description={item.type}
                  onPress={() => handleSelectLocation(item)}
                  left={props => <List.Icon {...props} icon="map-marker" />}
                />
              )}
              ItemSeparatorComponent={() => <Divider />}
              style={styles.locationList}
            />
            <FAB
              icon="plus"
              style={styles.fab}
              onPress={() => setShowAddLocation(true)}
              label="Add Location"
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowLocationPicker(false)}>Cancel</Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog visible={showAddLocation} onDismiss={() => setShowAddLocation(false)}>
          <Dialog.Title>Add New Location</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Location Name"
              value={newLocationName}
              onChangeText={setNewLocationName}
              mode="outlined"
              style={styles.input}
            />
            <Text style={styles.inputLabel}>Location Type</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typeScroll}>
              <SegmentedButtons
                value={newLocationType}
                onValueChange={setNewLocationType}
                buttons={locationTypes.map(type => ({
                  value: type,
                  label: type,
                }))}
                style={styles.typeButtons}
              />
            </ScrollView>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowAddLocation(false)}>Cancel</Button>
            <Button onPress={handleAddLocation}>Add</Button>
          </Dialog.Actions>
        </Dialog>

        {/* Asset Type Picker Dialog */}
        <Dialog visible={showAssetTypePicker} onDismiss={() => setShowAssetTypePicker(false)} style={styles.pickerDialog}>
          <Dialog.Title>Select Asset Type</Dialog.Title>
          <Dialog.Content>
            <Searchbar
              placeholder="Search asset types..."
              onChangeText={setAssetTypeSearchQuery}
              value={assetTypeSearchQuery}
              style={styles.searchBar}
            />
            <FlatList
              data={filteredAssetTypes}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <List.Item
                  title={item.name}
                  description={item.category}
                  onPress={() => handleSelectAssetType(item)}
                  left={props => <List.Icon {...props} icon="cube-outline" />}
                />
              )}
              ItemSeparatorComponent={() => <Divider />}
              style={styles.listContent}
            />
            <FAB
              icon="plus"
              style={styles.fab}
              onPress={() => setShowAddAssetType(true)}
              label="Add Type"
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowAssetTypePicker(false)}>Cancel</Button>
          </Dialog.Actions>
        </Dialog>

        {/* Add Asset Type Dialog */}
        <Dialog visible={showAddAssetType} onDismiss={() => setShowAddAssetType(false)}>
          <Dialog.Title>Add New Asset Type</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Asset Type Name"
              value={newAssetTypeName}
              onChangeText={setNewAssetTypeName}
              mode="outlined"
              style={styles.input}
            />
            <Text style={styles.inputLabel}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
              <SegmentedButtons
                value={newAssetCategory}
                onValueChange={setNewAssetCategory}
                buttons={assetCategories.map(category => ({
                  value: category,
                  label: category,
                }))}
                style={styles.categoryButtons}
              />
            </ScrollView>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowAddAssetType(false)}>Cancel</Button>
            <Button onPress={handleAddAssetType}>Add</Button>
          </Dialog.Actions>
        </Dialog>

        {/* Parts Picker Dialog */}
        <Dialog visible={showPartsPicker} onDismiss={() => setShowPartsPicker(false)} style={styles.pickerDialog}>
          <Dialog.Title>Select Parts</Dialog.Title>
          <Dialog.Content>
            <Searchbar
              placeholder="Search parts..."
              onChangeText={setPartsSearchQuery}
              value={partsSearchQuery}
              style={styles.searchBar}
            />
            <FlatList
              data={filteredParts}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <List.Item
                  title={item.name}
                  description={`${item.category} - Quantity: ${item.quantity}`}
                  onPress={() => handleSelectPart(item)}
                  left={props => <List.Icon {...props} icon="cog" />}
                />
              )}
              ItemSeparatorComponent={() => <Divider />}
              style={styles.listContent}
            />
            <FAB
              icon="plus"
              style={styles.fab}
              onPress={() => setShowAddPart(true)}
              label="Add Part"
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowPartsPicker(false)}>Cancel</Button>
          </Dialog.Actions>
        </Dialog>

        {/* Add Part Dialog */}
        <Dialog visible={showAddPart} onDismiss={() => setShowAddPart(false)}>
          <Dialog.Title>Add New Part</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Part Name"
              value={newPartName}
              onChangeText={setNewPartName}
              mode="outlined"
              style={styles.input}
            />
            <Text style={styles.inputLabel}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
              <SegmentedButtons
                value={newPartCategory}
                onValueChange={setNewPartCategory}
                buttons={partCategories.map(category => ({
                  value: category,
                  label: category,
                }))}
                style={styles.categoryButtons}
              />
            </ScrollView>
            <TextInput
              label="Quantity"
              value={newPartQuantity}
              onChangeText={setNewPartQuantity}
              mode="outlined"
              keyboardType="numeric"
              style={[styles.input, styles.marginTop]}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowAddPart(false)}>Cancel</Button>
            <Button onPress={handleAddPart}>Add</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  imageSection: {
    backgroundColor: '#fff',
    padding: 16,
    alignItems: 'center',
    marginBottom: 8,
  },
  assetImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
  },
  imagePlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  input: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  segmentedButtons: {
    marginVertical: 12,
  },
  attachButton: {
    marginBottom: 12,
  },
  scanButton: {
    margin: 0,
  },
  centerText: {
    fontSize: 18,
    padding: 32,
    color: '#fff',
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 8,
  },
  barcodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  barcodeInput: {
    flex: 1,
    marginRight: 8,
  },
  locationDialog: {
    maxHeight: '80%',
  },
  searchBar: {
    marginBottom: 8,
  },
  locationList: {
    maxHeight: 400,
  },
  fab: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    margin: 16,
  },
  typeScroll: {
    marginVertical: 8,
  },
  typeButtons: {
    marginVertical: 8,
  },
  pickerDialog: {
    maxHeight: '80%',
  },
  listContent: {
    maxHeight: 400,
  },
  categoryScroll: {
    marginVertical: 8,
  },
  categoryButtons: {
    marginVertical: 8,
  },
  marginTop: {
    marginTop: 16,
  },
});

export default AddAsset;
