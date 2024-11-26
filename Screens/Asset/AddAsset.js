import React, { useState } from 'react';
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
  SegmentedButtons,
  FAB,
  Searchbar,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { addAsset, addLocation, addAssetType, addPart } from '../../redux/reducers/assetReducer';

const AddAsset = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  // Redux state
  const locations = useSelector((state) => state.locations.locations);
  const assetTypes = useSelector((state) => state.assets.assetTypes);
  const partsList = useSelector((state) => state.assets.parts);

  // Local state
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

  // Dialog visibility states
  const [showImageOptions, setShowImageOptions] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showTeamPicker, setShowTeamPicker] = useState(false);
  const [showVendorPicker, setShowVendorPicker] = useState(false);
  const [showPartsPicker, setShowPartsPicker] = useState(false);
  const [showAssetTypePicker, setShowAssetTypePicker] = useState(false);
  const [showAddAssetType, setShowAddAssetType] = useState(false);
  const [showAddPart, setShowAddPart] = useState(false);
  const [showAddLocation, setShowAddLocation] = useState(false);

  // Search queries
  const [searchQuery, setSearchQuery] = useState('');
  const [assetTypeSearchQuery, setAssetTypeSearchQuery] = useState('');
  const [partsSearchQuery, setPartsSearchQuery] = useState('');

  // New item states
  const [newLocationName, setNewLocationName] = useState('');
  const [newLocationType, setNewLocationType] = useState('');
  const [newAssetTypeName, setNewAssetTypeName] = useState('');
  const [newAssetCategory, setNewAssetCategory] = useState('');
  const [newPartName, setNewPartName] = useState('');
  const [newPartCategory, setNewPartCategory] = useState('');
  const [newPartQuantity, setNewPartQuantity] = useState('');

  // Sample data
  const criticalityLevels = [
    { value: 'Critical', label: 'Critical' },
    { value: 'Important', label: 'Important' },
    { value: 'Normal', label: 'Normal' },
  ];

  const assetCategories = ['Equipment', 'Transport', 'Facility', 'Safety', 'Other'];
  const partCategories = ['Mechanical', 'Electronic', 'Consumable', 'Safety', 'Other'];
  const locationTypes = ['Building', 'Area', 'Storage', 'Workshop', 'Production', 'Office', 'Other'];

  // Filter functions
  const filteredLocations = locations.filter(location =>
    location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    location.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAssetTypes = assetTypes.filter(type =>
    type.name.toLowerCase().includes(assetTypeSearchQuery.toLowerCase()) ||
    type.category.toLowerCase().includes(assetTypeSearchQuery.toLowerCase())
  );

  const filteredParts = partsList.filter(part =>
    part.name.toLowerCase().includes(partsSearchQuery.toLowerCase()) ||
    part.category.toLowerCase().includes(partsSearchQuery.toLowerCase())
  );

  // Handler functions
  const handleImagePicker = (type) => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
      quality: 0.8,
    };

    const launchFunction = type === 'camera' ? launchCamera : launchImageLibrary;

    launchFunction(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
        Alert.alert('Error', 'Failed to select image. Please try again.');
      } else if (response.assets && response.assets[0]) {
        setAssetImage(response.assets[0].uri);
      }
    });

    setShowImageOptions(false);
  };

  const handleAddLocation = () => {
    if (!newLocationName.trim()) {
      Alert.alert('Error', 'Please enter a location name');
      return;
    }
    if (!newLocationType) {
      Alert.alert('Error', 'Please select a location type');
      return;
    }
    dispatch(addLocation({ name: newLocationName.trim(), type: newLocationType }));
    setNewLocationName('');
    setNewLocationType('');
    setShowAddLocation(false);
    Alert.alert('Success', 'New location added successfully');
  };

  const handleAddAssetType = () => {
    if (!newAssetTypeName.trim()) {
      Alert.alert('Error', 'Please enter an asset type name');
      return;
    }
    if (!newAssetCategory) {
      Alert.alert('Error', 'Please select a category');
      return;
    }
    dispatch(addAssetType({ name: newAssetTypeName.trim(), category: newAssetCategory }));
    setNewAssetTypeName('');
    setNewAssetCategory('');
    setShowAddAssetType(false);
    Alert.alert('Success', 'New asset type added successfully');
  };

  const handleAddPart = () => {
    if (!newPartName.trim()) {
      Alert.alert('Error', 'Please enter a part name');
      return;
    }
    if (!newPartCategory) {
      Alert.alert('Error', 'Please select a category');
      return;
    }
    if (!newPartQuantity || isNaN(parseInt(newPartQuantity))) {
      Alert.alert('Error', 'Please enter a valid quantity');
      return;
    }
    dispatch(addPart({
      name: newPartName.trim(),
      category: newPartCategory,
      quantity: parseInt(newPartQuantity),
    }));
    setNewPartName('');
    setNewPartCategory('');
    setNewPartQuantity('');
    setShowAddPart(false);
    Alert.alert('Success', 'New part added successfully');
  };

  const handleSelectLocation = (selectedLocation) => {
    setLocation(`${selectedLocation.name} (${selectedLocation.type})`);
    setShowLocationPicker(false);
  };

  const handleSelectAssetType = (selectedType) => {
    setAssetType(selectedType.name);
    setShowAssetTypePicker(false);
  };

  const handleSelectPart = (selectedPart) => {
    setParts([...parts, selectedPart]);
    setShowPartsPicker(false);
  };

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

  const handleSave = () => {
    if (!task || !description || !criticality) {
      Alert.alert('Required Fields', 'Please fill in all required fields');
      return;
    }
    const asset = {
      id: Date.now().toString(),
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
    alert(asset.task)
    dispatch(addAsset(asset));
    console.log('Saving asset:', asset);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Add New Asset" />
        <Appbar.Action icon="check" onPress={handleSave} />
      </Appbar.Header>
      <ScrollView style={styles.scrollView}>
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
              onPress={() => Alert.alert('Barcode', 'Scan or enter barcode')}
              style={styles.scanButton}
            />
          </View>
        </View>

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

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Asset Type</Text>
          <List.Item
            title="Asset Type"
            description={assetType || "Select asset type"}
            onPress={() => setShowAssetTypePicker(true)}
            right={props => <List.Icon {...props} icon="chevron-right" />}
          />
        </View>

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
            onPress={() => navigation.navigate("Vendors")}
            right={props => <List.Icon {...props} icon="chevron-right" />}
          />
          <List.Item
            title="Parts"
            description={parts.length > 0 ? `${parts.length} parts added` : "Add parts"}
            onPress={() => setShowPartsPicker(true)}
            right={props => <List.Icon {...props} icon="chevron-right" />}
          />
        </View>

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

        <Dialog visible={showLocationPicker} onDismiss={() => setShowLocationPicker(false)} style={styles.pickerDialog}>
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
              style={styles.listContent}
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
  barcodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  barcodeInput: {
    flex: 1,
    marginRight: 8,
  },
  scanButton: {
    margin: 0,
  },
  pickerDialog: {
    maxHeight: '80%',
  },
  searchBar: {
    marginBottom: 8,
  },
  listContent: {
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