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
  Modal,
  List,
  IconButton,
  Searchbar,
  FAB,
  Surface,
  useTheme,
  Checkbox,
  Appbar,
  Portal,
} from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
import { useNavigation } from '@react-navigation/native';
import { addPart, updatePart, deletePart, selectPart, unselectPart } from '../../redux/slices/partSlice';

const Parts = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  
  const parts = useSelector(state => state.part.parts);
  const selectedParts = useSelector(state => state.part.selectedParts);
  
  // Part form states
  const [showAddPart, setShowAddPart] = useState(false);
  const [partName, setPartName] = useState('');
  const [partImage, setPartImage] = useState(null);
  const [description, setDescription] = useState('');
  const [unitsInStock, setUnitsInStock] = useState('');
  const [minimumStock, setMinimumStock] = useState('');
  const [unitCost, setUnitCost] = useState('');
  const [barcode, setBarcode] = useState('');
  const [partType, setPartType] = useState([]);
  const [location, setLocation] = useState('');
  const [area, setArea] = useState('');
  const [selectedAssets, setSelectedAssets] = useState([]);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [selectedVendors, setSelectedVendors] = useState([]);
  const [attachedFiles, setAttachedFiles] = useState([]);
  
  // Dialog states
  const [showImageOptions, setShowImageOptions] = useState(false);
  const [showPartTypes, setShowPartTypes] = useState(false);
  const [showLocations, setShowLocations] = useState(false);
  const [showAreas, setShowAreas] = useState(false);
  const [showTeams, setShowTeams] = useState(false);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  
  // Add new state for edit mode
  const [editingPart, setEditingPart] = useState(null);
  
  // Add new state for part type creation
  const [newPartType, setNewPartType] = useState('');
  const [showAddPartType, setShowAddPartType] = useState(false);

  // Update mock data to be state
  const [partTypes, setPartTypes] = useState([
    'Mechanical',
    'Electrical',
    'Electronic',
    'Hydraulic',
    'Pneumatic',
    'Consumable',
  ]);

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
      setPartImage(response.assets[0].uri);
    }
  };

  const handleFilePicker = async () => {
    try {
      const results = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
        allowMultiSelection: true,
      });
      setAttachedFiles([...attachedFiles, ...results]);
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        Alert.alert('Error', 'Failed to pick file');
      }
    }
  };

  const handleAddPart = () => {
    if (!validateForm()) return;

    const newPart = {
      id: Date.now().toString(),
      name: partName,
      image: partImage,
      description,
      unitsInStock: parseInt(unitsInStock) || 0,
      minimumStock: parseInt(minimumStock) || 0,
      unitCost: parseFloat(unitCost) || 0,
      barcode,
      partType: partType || [], // Ensure it's an array
      location,
      area,
      assets: selectedAssets,
      teams: selectedTeams,
      vendors: selectedVendors,
      attachedFiles,
    };

    dispatch(addPart(newPart));
    resetForm();
    setShowAddPart(false);
  };

  const handleEditPart = (part) => {
    setEditingPart(part);
    setPartName(part.name);
    setPartImage(part.image);
    setDescription(part.description || '');
    setUnitsInStock(part.unitsInStock.toString());
    setMinimumStock(part.minimumStock.toString());
    setUnitCost(part.unitCost.toString());
    setBarcode(part.barcode || '');
    setPartType(part.partType || []);
    setLocation(part.location || '');
    setArea(part.area || '');
    setSelectedAssets(part.assets || []);
    setSelectedTeams(part.teams || []);
    setSelectedVendors(part.vendors || []);
    setAttachedFiles(part.files || []);
    setShowAddPart(true);
  };

  const handleSaveEdit = () => {
    if (!validateForm()) return;

    const updatedPart = {
      ...editingPart,
      name: partName,
      image: partImage,
      description,
      unitsInStock: parseInt(unitsInStock) || 0,
      minimumStock: parseInt(minimumStock) || 0,
      unitCost: parseFloat(unitCost) || 0,
      barcode,
      partType: partType || [], // Ensure it's an array
      location,
      area,
      assets: selectedAssets,
      teams: selectedTeams,
      vendors: selectedVendors,
      attachedFiles,
    };

    dispatch(updatePart(updatedPart));
    resetForm();
    setEditingPart(null);
    setShowAddPart(false);
  };

  const handleDeletePart = (partId) => {
    Alert.alert(
      'Delete Part',
      'Are you sure you want to delete this part?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => dispatch(deletePart(partId))
        }
      ]
    );
  };

  const handlePartSelection = (partId) => {
    if (selectedParts.includes(partId)) {
      dispatch(unselectPart(partId));
    } else {
      dispatch(selectPart(partId));
    }
  };

  const validateForm = () => {
    if (!partName.trim()) {
      Alert.alert('Error', 'Please enter part name');
      return false;
    }
    if (!unitsInStock || isNaN(unitsInStock)) {
      Alert.alert('Error', 'Please enter valid units in stock');
      return false;
    }
    if (!minimumStock || isNaN(minimumStock)) {
      Alert.alert('Error', 'Please enter valid minimum stock');
      return false;
    }
    if (!unitCost || isNaN(unitCost)) {
      Alert.alert('Error', 'Please enter valid unit cost');
      return false;
    }
    return true;
  };

  const resetForm = () => {
    setPartName('');
    setPartImage(null);
    setDescription('');
    setUnitsInStock('');
    setMinimumStock('');
    setUnitCost('');
    setBarcode('');
    setPartType([]);
    setLocation('');
    setArea('');
    setSelectedAssets([]);
    setSelectedTeams([]);
    setSelectedVendors([]);
    setAttachedFiles([]);
    setEditingPart(null);
  };

  const handleAddPartType = () => {
    if (newPartType.trim()) {
      setPartTypes([...partTypes, newPartType.trim()]);
      setNewPartType('');
      setShowAddPartType(false);
    }
  };

  const handlePartTypeSelect = (type) => {
    setPartType(prevTypes => {
      const typeIndex = prevTypes.indexOf(type);
      if (typeIndex > -1) {
        return prevTypes.filter(t => t !== type);
      } else {
        return [...prevTypes, type];
      }
    });
  };

  const filteredParts = parts.filter(part =>
    part.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    part.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    part.partType?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Parts" subtitle={`${parts.length} parts`} />
      </Appbar.Header>

      <Searchbar
        placeholder="Search parts"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />

      <ScrollView>
        {filteredParts.map((part) => (
          <Surface key={part.id} style={styles.partCard}>
            <View style={styles.partHeader}>
              <View style={styles.partInfo}>
                {part.image && (
                  <Image source={{ uri: part.image }} style={styles.partImage} />
                )}
                <View>
                  <Text style={styles.partName}>{part.name}</Text>
                  <Text style={styles.partType}>
                    {Array.isArray(part.partType) ? part.partType.join(', ') : part.partType || ''}
                  </Text>
                </View>
              </View>
              <View style={styles.actions}>
                <Checkbox
                  status={selectedParts.includes(part.id) ? 'checked' : 'unchecked'}
                  onPress={() => handlePartSelection(part.id)}
                />
                <IconButton
                  icon="pencil"
                  onPress={() => handleEditPart(part)}
                />
                <IconButton
                  icon="delete"
                  onPress={() => handleDeletePart(part.id)}
                />
              </View>
            </View>
            {part.description && (
              <Text style={styles.description}>{part.description}</Text>
            )}
            <View style={styles.details}>
              <Text style={styles.detailText}>In Stock: {part.unitsInStock}</Text>
              <Text style={styles.detailText}>Min Stock: {part.minimumStock}</Text>
              <Text style={styles.detailText}>Cost: ${part.unitCost}</Text>
            </View>
          </Surface>
        ))}
      </ScrollView>

      <FAB
        icon="plus"
        onPress={() => setShowAddPart(true)}
        style={styles.fab}
      />

      <Modal
        visible={showAddPart}
        onDismiss={() => {
          setShowAddPart(false);
          resetForm();
        }}
        contentContainerStyle={styles.modalContainer}
      >
        <Surface style={styles.modalContent}>
          <Appbar.Header style={styles.modalHeader}>
            <Appbar.BackAction onPress={() => {
              setShowAddPart(false);
              resetForm();
            }} />
            <Appbar.Content title={editingPart ? 'Edit Part' : 'Add New Part'} />
          </Appbar.Header>

          <ScrollView style={styles.modalScroll}>
            <View style={styles.modalForm}>
              <TextInput
                label="Part Name"
                value={partName}
                onChangeText={setPartName}
                mode="outlined"
                style={styles.input}
              />
              
              <View style={styles.imageSection}>
                <Text style={styles.sectionTitle}>Part Image</Text>
                {partImage ? (
                  <View style={styles.imagePreview}>
                    <Image source={{ uri: partImage }} style={styles.previewImage} />
                    <IconButton
                      icon="close"
                      size={20}
                      style={styles.removeImage}
                      onPress={() => setPartImage(null)}
                    />
                  </View>
                ) : (
                  <Button
                    mode="outlined"
                    onPress={() => setShowImageOptions(true)}
                    style={styles.imageButton}
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

              <View style={styles.row}>
                <TextInput
                  label="Units in Stock"
                  value={unitsInStock}
                  onChangeText={setUnitsInStock}
                  mode="outlined"
                  keyboardType="numeric"
                  style={[styles.input, styles.halfInput]}
                />

                <TextInput
                  label="Minimum Stock"
                  value={minimumStock}
                  onChangeText={setMinimumStock}
                  mode="outlined"
                  keyboardType="numeric"
                  style={[styles.input, styles.halfInput]}
                />
              </View>

              <View style={styles.row}>
                <TextInput
                  label="Unit Cost"
                  value={unitCost}
                  onChangeText={setUnitCost}
                  mode="outlined"
                  keyboardType="decimal-pad"
                  style={[styles.input, styles.halfInput]}
                />

                <TextInput
                  label="Barcode"
                  value={barcode}
                  onChangeText={setBarcode}
                  mode="outlined"
                  style={[styles.input, styles.halfInput]}
                  right={<TextInput.Icon icon="barcode-scan" />}
                />
              </View>

              <List.Section>
                <List.Subheader>Part Details</List.Subheader>
                <List.Item
                  title="Part Type"
                  description={Array.isArray(partType) && partType.length > 0 
                    ? partType.join(', ') 
                    : 'Select Part Types'}
                  onPress={() => setShowPartTypes(true)}
                  right={props => <List.Icon {...props} icon="chevron-right" />}
                  style={styles.listItem}
                />

                <List.Item
                  title="Location"
                  description={location || 'Select location'}
                  onPress={() => navigation.navigate('LocationScreen', { multiSelect: false, onSelect: (loc) => setLocation(loc) })}
                  right={props => <List.Icon {...props} icon="chevron-right" />}
                  style={styles.listItem}
                />

                <List.Item
                  title="Area"
                  description={area || 'Select area'}
                  onPress={() => setShowAreas(true)}
                  right={props => <List.Icon {...props} icon="chevron-right" />}
                  style={styles.listItem}
                />
              </List.Section>

              <List.Section>
                <List.Subheader>Associations</List.Subheader>
                <List.Item
                  title="Assets"
                  description={selectedAssets.length ? `${selectedAssets.length} assets selected` : 'Select assets'}
                  onPress={() => navigation.navigate('AssetScreen', { multiSelect: true, onSelect: setSelectedAssets })}
                  right={props => <List.Icon {...props} icon="chevron-right" />}
                  style={styles.listItem}
                />

                <List.Item
                  title="Teams"
                  description={selectedTeams.length ? `${selectedTeams.length} teams selected` : 'Select teams'}
                  onPress={() => setShowTeams(true)}
                  right={props => <List.Icon {...props} icon="chevron-right" />}
                  style={styles.listItem}
                />

                <List.Item
                  title="Vendors"
                  description={selectedVendors.length ? `${selectedVendors.length} vendors selected` : 'Select vendors'}
                  onPress={() => navigation.navigate('Vendors', { multiSelect: true, onSelect: setSelectedVendors })}
                  right={props => <List.Icon {...props} icon="chevron-right" />}
                  style={styles.listItem}
                />
              </List.Section>

              <View style={styles.filesSection}>
                <List.Subheader>Attachments</List.Subheader>
                <Button
                  mode="outlined"
                  onPress={handleFilePicker}
                  icon="file-upload"
                  style={styles.fileButton}
                >
                  Add Files
                </Button>
                {attachedFiles.map((file, index) => (
                  <List.Item
                    key={index}
                    title={file.name}
                    description={`${(file.size / 1024).toFixed(2)} KB`}
                    left={props => <List.Icon {...props} icon="file" />}
                    right={props => (
                      <IconButton
                        {...props}
                        icon="close"
                        onPress={() => {
                          const newFiles = [...attachedFiles];
                          newFiles.splice(index, 1);
                          setAttachedFiles(newFiles);
                        }}
                      />
                    )}
                    style={styles.listItem}
                  />
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalActions}>
            <Button
              onPress={() => {
                setShowAddPart(false);
                resetForm();
              }}
              style={styles.actionButton}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={editingPart ? handleSaveEdit : handleAddPart}
              style={styles.actionButton}
            >
              {editingPart ? 'Save Changes' : 'Add Part'}
            </Button>
          </View>
        </Surface>
      </Modal>

      <Portal>
        <Modal 
          visible={showPartTypes} 
          onDismiss={() => setShowPartTypes(false)}
          contentContainerStyle={{
            backgroundColor: 'white',
            flex: 1,
          }}
        >
          <View style={{ flex: 1 }}>
            <Appbar.Header>
              <Appbar.BackAction onPress={() => {
                if (showAddPartType) {
                  setShowAddPartType(false);
                  setNewPartType('');
                } else {
                  setShowPartTypes(false);
                }
              }} />
              <Appbar.Content title={showAddPartType ? "Add Part Type" : "Select Part Type"} />
              {!showAddPartType && <Appbar.Action icon="plus" onPress={() => setShowAddPartType(true)} />}
            </Appbar.Header>

            {showAddPartType ? (
              <View style={{ padding: 16 }}>
                <TextInput
                  label="New Part Type"
                  value={newPartType}
                  onChangeText={setNewPartType}
                  mode="outlined"
                  style={{ marginBottom: 16 }}
                  autoFocus
                />
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8 }}>
                  <Button onPress={() => {
                    setShowAddPartType(false);
                    setNewPartType('');
                  }}>Cancel</Button>
                  <Button mode="contained" onPress={handleAddPartType} disabled={!newPartType.trim()}>Add</Button>
                </View>
              </View>
            ) : (
              <ScrollView>
                {partTypes.map((type, index) => (
                  <List.Item
                    key={index}
                    title={type}
                    onPress={() => handlePartTypeSelect(type)}
                    right={props => 
                      partType.includes(type) ? (
                        <List.Icon {...props} icon="check" />
                      ) : null
                    }
                    style={{ borderBottomWidth: 1, borderBottomColor: '#eee' }}
                  />
                ))}
              </ScrollView>
            )}
          </View>
        </Modal>
      </Portal>

      <Modal visible={showImageOptions} onDismiss={() => setShowImageOptions(false)}>
        <Surface style={styles.modalContent}>
          <Appbar.Header style={styles.modalHeader}>
            <Appbar.BackAction onPress={() => setShowImageOptions(false)} />
            <Appbar.Content title="Add Image" />
          </Appbar.Header>

          <View style={styles.modalForm}>
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
          </View>
        </Surface>
      </Modal>

      <Modal visible={showLocations} onDismiss={() => setShowLocations(false)}>
        <Surface style={styles.modalContent}>
          <Appbar.Header style={styles.modalHeader}>
            <Appbar.BackAction onPress={() => setShowLocations(false)} />
            <Appbar.Content title="Select Location" />
          </Appbar.Header>

          <ScrollView style={styles.modalScroll}>
            <View style={styles.modalForm}>
              <List.Item
                title="Location 1"
                onPress={() => {
                  setLocation('Location 1');
                  setShowLocations(false);
                }}
                right={props => <List.Icon {...props} icon="chevron-right" />}
                style={styles.listItem}
              />
              <List.Item
                title="Location 2"
                onPress={() => {
                  setLocation('Location 2');
                  setShowLocations(false);
                }}
                right={props => <List.Icon {...props} icon="chevron-right" />}
                style={styles.listItem}
              />
            </View>
          </ScrollView>
        </Surface>
      </Modal>

      <Modal visible={showAreas} onDismiss={() => setShowAreas(false)}>
        <Surface style={styles.modalContent}>
          <Appbar.Header style={styles.modalHeader}>
            <Appbar.BackAction onPress={() => setShowAreas(false)} />
            <Appbar.Content title="Select Area" />
          </Appbar.Header>

          <ScrollView style={styles.modalScroll}>
            <View style={styles.modalForm}>
              <List.Item
                title="Area 1"
                onPress={() => {
                  setArea('Area 1');
                  setShowAreas(false);
                }}
                right={props => <List.Icon {...props} icon="chevron-right" />}
                style={styles.listItem}
              />
              <List.Item
                title="Area 2"
                onPress={() => {
                  setArea('Area 2');
                  setShowAreas(false);
                }}
                right={props => <List.Icon {...props} icon="chevron-right" />}
                style={styles.listItem}
              />
            </View>
          </ScrollView>
        </Surface>
      </Modal>

      <Modal visible={showTeams} onDismiss={() => setShowTeams(false)}>
        <Surface style={styles.modalContent}>
          <Appbar.Header style={styles.modalHeader}>
            <Appbar.BackAction onPress={() => setShowTeams(false)} />
            <Appbar.Content title="Select Teams" />
          </Appbar.Header>

          <ScrollView style={styles.modalScroll}>
            <View style={styles.modalForm}>
              <List.Item
                title="Team 1"
                onPress={() => {
                  setSelectedTeams(['Team 1']);
                  setShowTeams(false);
                }}
                right={props => <List.Icon {...props} icon="chevron-right" />}
                style={styles.listItem}
              />
              <List.Item
                title="Team 2"
                onPress={() => {
                  setSelectedTeams(['Team 2']);
                  setShowTeams(false);
                }}
                right={props => <List.Icon {...props} icon="chevron-right" />}
                style={styles.listItem}
              />
            </View>
          </ScrollView>
        </Surface>
      </Modal>
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
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalContent: {
    flex: 1,
  },
  modalHeader: {
    elevation: 4,
  },
  modalScroll: {
    flex: 1,
  },
  modalForm: {
    padding: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  actionButton: {
    marginLeft: 8,
  },
  input: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: -8,
  },
  halfInput: {
    flex: 1,
    marginHorizontal: 8,
  },
  imageSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  imagePreview: {
    position: 'relative',
    alignItems: 'center',
    marginVertical: 8,
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
    elevation: 2,
  },
  imageButton: {
    marginBottom: 8,
  },
  listItem: {
    paddingVertical: 8,
  },
  filesSection: {
    marginTop: 16,
  },
  fileButton: {
    marginBottom: 16,
  },
  partCard: {
    margin: 8,
    padding: 16,
    elevation: 2,
  },
  partHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  partInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  partImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  partName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  partType: {
    fontSize: 14,
    color: '#666',
  },
  description: {
    marginTop: 8,
    color: '#666',
  },
  details: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginRight: 16,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addPartTypeContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  addPartTypeActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
    gap: 8,
  },
  partTypeList: {
    flex: 1,
    backgroundColor: '#fff',
  },
  partTypeItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});

export default Parts;