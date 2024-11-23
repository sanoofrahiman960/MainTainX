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
import { useDispatch } from 'react-redux';
import { addAssets } from '../../redux/actions/locationAction';
import DocumentPicker from 'react-native-document-picker';
import Navigation from '../../Navigation/Navigation';
import { useNavigation } from '@react-navigation/native';

const AddAsset = ({ navigation }) => {
  const dispatch = useDispatch();
  const [assetName, setAssetName] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [qrCode, setQrCode] = useState('');
  const [barCode, setBarCode] = useState('');
  const [files, setFiles] = useState([]);
  const [showImageOptions, setShowImageOptions] = useState(false);
  const [task, setTask] = useState('');
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
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showTeamPicker, setShowTeamPicker] = useState(false);
  const [showVendorPicker, setShowVendorPicker] = useState(false);
  const [showPartsPicker, setShowPartsPicker] = useState(false);
  const [showAssetTypePicker, setShowAssetTypePicker] = useState(false);
  const [showAddAssetType, setShowAddAssetType] = useState(false);
  const [showAddPart, setShowAddPart] = useState(false);
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
  const [locationTypes, setLocationTypes] = useState([
    'Building',
    'Area',
    'Storage',
    'Workshop',
    'Production',
    'Office',
    'Other'
  ]);

  const [assetCategories] = useState([
    'Equipment',
    'Transport',
    'Facility',
    'Safety',
    'Other'
  ]);

  const [partCategories] = useState([
    'Mechanical',
    'Electronic',
    'Consumable',
    'Safety',
    'Other'
  ]);

  const criticalityLevels = [
    { value: 'Critical', label: 'Critical' },
    { value: 'Important', label: 'Important' },
    { value: 'Normal', label: 'Normal' }
  ];

  const [filteredLocations, setFilteredLocations] = useState(locations);
  const [filteredAssetTypes, setFilteredAssetTypes] = useState(assetTypes);
  const [filteredParts, setFilteredParts] = useState(partsList);
  const Navigation=useNavigation()

  const handleSave = () => {
    if (!assetName.trim()) {
      Alert.alert('Error', 'Please enter an asset name');
      return;
    }

    const newAsset = {
      id: Date.now().toString(),
      name: assetName,
      description,
      images,
      qrCode,
      barCode,
      files,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      task,
      barcode,
      location,
      criticality,
      serialNumber,
      model,
      manufacturer,
      year,
      assetType,
      attachments,
      team,
      vendors,
      parts,
    };

    dispatch(addAssets(newAsset));
    navigation.goBack();
  };

  const handleImagePicker = async (type) => {
    const options = {
      mediaType: 'photo',
      quality: 1,
      selectionLimit: 1,
    };

    try {
      let result;
      if (type === 'camera') {
        result = await launchCamera(options);
      } else {
        result = await launchImageLibrary(options);
      }

      if (!result.didCancel && result.assets && result.assets[0]) {
        setImages([...images, result.assets[0].uri]);
      }
    } catch (error) {
      console.error('ImagePicker Error:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
    setShowImageOptions(false);
  };

  const handleAttachment = async () => {
    try {
      const results = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
        allowMultiSelection: true,
        presentationStyle: 'fullScreen',
      });
      
      const newFiles = Array.isArray(results) ? results : [results];
      const processedFiles = newFiles.map(result => ({
        name: result.name || 'Untitled',
        uri: result.uri,
        type: result.type || 'application/octet-stream',
        size: result.size || 0
      }));
      
      setFiles(prevFiles => [...prevFiles, ...processedFiles]);
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        console.error('DocumentPicker Error:', err);
        Alert.alert('Error', 'Failed to pick file');
      }
    }
  };

  const removeFile = (index) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

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
          onPress: (code) => setBarCode(code),
        },
      ],
    );
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

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Add Asset" />
        <Appbar.Action icon="check" onPress={handleSave} />
      </Appbar.Header>

      <ScrollView style={styles.content}>
        <TextInput
          label="Asset Name"
          value={assetName}
          onChangeText={setAssetName}
          style={styles.input}
        />

        <TextInput
          label="Description"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          style={styles.input}
        />

        <Button
          mode="outlined"
          icon="camera"
          onPress={() => setShowImageOptions(true)}
          style={styles.button}
        >
          Add Images
        </Button>

        {images.length > 0 && (
          <ScrollView horizontal style={styles.imagePreview}>
            {images.map((uri, index) => (
              <View key={index} style={styles.imageContainer}>
                <Image source={{ uri }} style={styles.image} />
                <IconButton
                  icon="close"
                  size={20}
                  style={styles.removeImage}
                  onPress={() => {
                    setImages(images.filter((_, i) => i !== index));
                  }}
                />
              </View>
            ))}
          </ScrollView>
        )}

        <Button
          mode="outlined"
          icon="qrcode"
          onPress={handleBarcodeScan}
          style={styles.button}
        >
          Add QR/Barcode
        </Button>

        <Button
          mode="outlined"
          icon="file"
          onPress={handleAttachment}
          style={styles.button}
        >
          Add Files
        </Button>

        {files.length > 0 && (
          <View style={styles.filesList}>
            {files.map((file, index) => (
              <List.Item
                key={index}
                title={file.name}
                description={`${((file.size || 0) / (1024 * 1024)).toFixed(2)} MB`}
                left={props => <List.Icon {...props} icon="file" />}
                right={props => (
                  <IconButton
                    {...props}
                    icon="close"
                    onPress={() => removeFile(index)}
                  />
                )}
              />
            ))}
          </View>
        )}

        <TextInput
          label="Task"
          value={task}
          onChangeText={setTask}
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="Barcode"
          value={barcode}
          onChangeText={setBarcode}
          mode="outlined"
          style={styles.input}
        />

        <List.Item
          title="Location"
          description={location || "Select location"}
          onPress={() => setShowLocationPicker(true)}
          right={props => <List.Icon {...props} icon="chevron-right" />}
        />

        <Text style={styles.inputLabel}>Criticality</Text>
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
          style={styles.input}
        />

        <List.Item
          title="Asset Type"
          description={assetType || "Select asset type"}
          onPress={() => setShowAssetTypePicker(true)}
          right={props => <List.Icon {...props} icon="chevron-right" />}
        />

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
      </ScrollView>

      <Portal>
        <Dialog
          visible={showImageOptions}
          onDismiss={() => setShowImageOptions(false)}
        >
          <Dialog.Title>Add Image</Dialog.Title>
          <Dialog.Content>
            <Button
              icon="camera"
              mode="contained"
              onPress={() => {
                handleImagePicker('camera');
                setShowImageOptions(false);
              }}
              style={styles.dialogButton}
            >
              Take Photo
            </Button>
            <Button
              icon="image"
              mode="contained"
              onPress={() => {
                handleImagePicker('library');
                setShowImageOptions(false);
              }}
              style={styles.dialogButton}
            >
              Choose from Library
            </Button>
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
    backgroundColor: '#fff',
  },
  content: {
    padding: 16,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginBottom: 16,
  },
  imagePreview: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  imageContainer: {
    marginRight: 8,
    position: 'relative',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeImage: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  filesList: {
    marginBottom: 16,
  },
  dialogButton: {
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    marginLeft: 4,
  },
  segmentedButtons: {
    marginBottom: 16,
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