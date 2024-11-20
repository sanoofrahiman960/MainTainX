import React, { useState, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Icon, Button, CheckBox, Input, Overlay } from '@rneui/themed';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'react-native-image-picker';
import SignatureCanvas from 'react-native-signature-canvas';
import { WebView } from 'react-native-webview';

const ProcedureField = ({ type, onDelete }) => {
  const [value, setValue] = useState('');
  const [description, setDescription] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [checkboxOptions, setCheckboxOptions] = useState([]);
  const [multipleChoiceOptions, setMultipleChoiceOptions] = useState([]);
  const [checklistItems, setChecklistItems] = useState([]);
  const [yesNoOptions, setYesNoOptions] = useState({
    yes: { label: 'Yes', value: 'yes' },
    no: { label: 'No', value: 'no' }
  });
  const [inspectionItems, setInspectionItems] = useState([
    { id: 1, label: 'Inspection Point 1', status: null }, // null, 'pass', or 'fail'
    { id: 2, label: 'Inspection Point 2', status: null },
    { id: 3, label: 'Inspection Point 3', status: null }
  ]);
  const [showSignature, setShowSignature] = useState(false);
  const [signature, setSignature] = useState(null);
  const [image, setImage] = useState(null);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [newOptionLabel, setNewOptionLabel] = useState('');
  const [newOptionValue, setNewOptionValue] = useState('');
  const [editingOption, setEditingOption] = useState(null);
  const [currentFieldType, setCurrentFieldType] = useState(null);
  const [headingLevel, setHeadingLevel] = useState('h1');
  const [showHeadingOptions, setShowHeadingOptions] = useState(false);

  const handleImagePicker = () => {
    ImagePicker.launchCamera({
      mediaType: 'photo',
      includeBase64: true,
    }, (response) => {
      if (response.assets) {
        setImage(response.assets[0].uri);
      }
    });
  };

  const handleAddOption = () => {
    if (!newOptionLabel.trim() || !newOptionValue.trim()) {
      Alert.alert('Error', 'Please enter both label and value for the option');
      return;
    }

    const newOption = {
      id: Date.now().toString(),
      label: newOptionLabel,
      value: newOptionValue,
      checked: false,
      selected: false
    };

    switch (currentFieldType) {
      case 'Checkbox Options':
        setCheckboxOptions([...checkboxOptions, newOption]);
        break;
      case 'Multiple Choice':
        setMultipleChoiceOptions([...multipleChoiceOptions, newOption]);
        break;
      case 'Checklist':
        setChecklistItems([...checklistItems, newOption]);
        break;
      case 'Yes/No':
        if (newOptionValue.toLowerCase() === 'yes') {
          setYesNoOptions(prev => ({
            ...prev,
            yes: { label: newOptionLabel, value: newOptionValue }
          }));
        } else if (newOptionValue.toLowerCase() === 'no') {
          setYesNoOptions(prev => ({
            ...prev,
            no: { label: newOptionLabel, value: newOptionValue }
          }));
        }
        break;
    }

    setNewOptionLabel('');
    setNewOptionValue('');
  };

  const handleEditOption = (option) => {
    setEditingOption(option);
    setNewOptionLabel(option.label);
    setNewOptionValue(option.value);
  };

  const handleUpdateOption = () => {
    if (!newOptionLabel.trim() || !newOptionValue.trim()) {
      Alert.alert('Error', 'Please enter both label and value for the option');
      return;
    }

    const updatedOption = {
      ...editingOption,
      label: newOptionLabel,
      value: newOptionValue
    };

    switch (currentFieldType) {
      case 'Checkbox Options':
        setCheckboxOptions(checkboxOptions.map(option =>
          option.id === editingOption.id ? updatedOption : option
        ));
        break;
      case 'Multiple Choice':
        setMultipleChoiceOptions(multipleChoiceOptions.map(option =>
          option.id === editingOption.id ? updatedOption : option
        ));
        break;
      case 'Checklist':
        setChecklistItems(checklistItems.map(option =>
          option.id === editingOption.id ? updatedOption : option
        ));
        break;
      case 'Yes/No':
        if (updatedOption.value.toLowerCase() === 'yes') {
          setYesNoOptions(prev => ({
            ...prev,
            yes: { label: updatedOption.label, value: updatedOption.value }
          }));
        } else if (updatedOption.value.toLowerCase() === 'no') {
          setYesNoOptions(prev => ({
            ...prev,
            no: { label: updatedOption.label, value: updatedOption.value }
          }));
        }
        break;
    }

    setEditingOption(null);
    setNewOptionLabel('');
    setNewOptionValue('');
  };

  const handleDeleteOption = (optionId) => {
    switch (currentFieldType) {
      case 'Checkbox Options':
        setCheckboxOptions(checkboxOptions.filter(option => option.id !== optionId));
        break;
      case 'Multiple Choice':
        setMultipleChoiceOptions(multipleChoiceOptions.filter(option => option.id !== optionId));
        break;
      case 'Checklist':
        setChecklistItems(checklistItems.filter(option => option.id !== optionId));
        break;
    }
  };

  const handleCheckboxToggle = (id) => {
    setCheckboxOptions(checkboxOptions.map(option =>
      option.id === id ? { ...option, checked: !option.checked } : option
    ));
  };

  const handleMultipleChoiceSelect = (id) => {
    setMultipleChoiceOptions(multipleChoiceOptions.map(option =>
      option.id === id ? { ...option, selected: true } : { ...option, selected: false }
    ));
  };

  const handleChecklistToggle = (id) => {
    setChecklistItems(checklistItems.map(item =>
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const handleInspectionStatus = (id, status) => {
    setInspectionItems(inspectionItems.map(item =>
      item.id === id ? { ...item, status } : item
    ));
  };

  const renderHeadingOptions = () => (
    <Overlay
      isVisible={showHeadingOptions}
      onBackdropPress={() => setShowHeadingOptions(false)}
      overlayStyle={styles.overlay}
    >
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Select Heading Level</Text>
        
        <View style={styles.headingOptions}>
          {['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map((level) => (
            <Button
              key={level}
              title={level.toUpperCase()}
              onPress={() => {
                setHeadingLevel(level);
                setShowHeadingOptions(false);
              }}
              type={headingLevel === level ? 'solid' : 'outline'}
              containerStyle={styles.headingLevelButton}
            />
          ))}
        </View>
      </View>
    </Overlay>
  );

  const renderHeadingPreview = () => {
    const styles = {
      h1: { fontSize: 32, fontWeight: 'bold' },
      h2: { fontSize: 28, fontWeight: 'bold' },
      h3: { fontSize: 24, fontWeight: 'bold' },
      h4: { fontSize: 20, fontWeight: 'bold' },
      h5: { fontSize: 18, fontWeight: 'bold' },
      h6: { fontSize: 16, fontWeight: 'bold' },
    };

    return (
      <Text style={[styles[headingLevel], { color: '#333' }]}>
        {value || 'Heading Preview'}
      </Text>
    );
  };

  const OptionsModal = () => (
    <Overlay
      isVisible={showOptionsModal}
      onBackdropPress={() => setShowOptionsModal(false)}
      overlayStyle={styles.overlay}
    >
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>
          Manage {currentFieldType} Options
        </Text>
        
        <View style={styles.addOptionContainer}>
          <Input
            placeholder="Option Label"
            value={newOptionLabel}
            onChangeText={setNewOptionLabel}
            containerStyle={styles.optionInput}
          />
          <Input
            placeholder="Option Value"
            value={newOptionValue}
            onChangeText={setNewOptionValue}
            containerStyle={styles.optionInput}
          />
          <Button
            title={editingOption ? "Update" : "Add"}
            onPress={editingOption ? handleUpdateOption : handleAddOption}
            buttonStyle={styles.addButton}
          />
        </View>

        <ScrollView style={styles.optionsList}>
          {(() => {
            let options = [];
            switch (currentFieldType) {
              case 'Checkbox Options':
                options = checkboxOptions;
                break;
              case 'Multiple Choice':
                options = multipleChoiceOptions;
                break;
              case 'Checklist':
                options = checklistItems;
                break;
              case 'Yes/No':
                options = [
                  { id: 'yes', ...yesNoOptions.yes },
                  { id: 'no', ...yesNoOptions.no }
                ];
                break;
            }
            return options.map(option => (
              <View key={option.id} style={styles.optionItem}>
                <View style={styles.optionDetails}>
                  <Text style={styles.optionLabel}>{option.label}</Text>
                  <Text style={styles.optionValue}>{option.value}</Text>
                </View>
                <View style={styles.optionButtons}>
                  <Button
                    icon={<Icon name="edit" size={20} color="#2089dc" />}
                    type="clear"
                    onPress={() => handleEditOption(option)}
                  />
                  {currentFieldType !== 'Yes/No' && (
                    <Button
                      icon={<Icon name="delete" size={20} color="red" />}
                      type="clear"
                      onPress={() => handleDeleteOption(option.id)}
                    />
                  )}
                </View>
              </View>
            ));
          })()}
        </ScrollView>

        <Button
          title="Done"
          onPress={() => setShowOptionsModal(false)}
          buttonStyle={styles.doneButton}
        />
      </View>
    </Overlay>
  );

  const renderFieldInput = () => {
    switch (type.type) {
      case 'Section':
        return (
          <View style={styles.sectionContainer}>
            <Input
              placeholder="Section Title"
              value={value}
              onChangeText={setValue}
              containerStyle={styles.sectionInput}
              leftIcon={<Icon name="view-list" size={24} color="#666" />}
            />
            <Input
              placeholder="Section Description (optional)"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              containerStyle={styles.sectionDescriptionInput}
              leftIcon={<Icon name="description" size={24} color="#666" />}
            />
            <View style={styles.sectionPreview}>
              <Text style={styles.sectionTitle}>{value || 'Section Title'}</Text>
              {description && (
                <Text style={styles.sectionDescription}>{description}</Text>
              )}
            </View>
          </View>
        );

      case 'Heading':
        return (
          <View style={styles.headingContainer}>
            <View style={styles.headingControls}>
              <Input
                placeholder="Enter heading text"
                value={value}
                onChangeText={setValue}
                containerStyle={styles.headingInput}
              />
              <Button
                title={headingLevel.toUpperCase()}
                onPress={() => setShowHeadingOptions(true)}
                type="outline"
                containerStyle={styles.headingLevelSelect}
              />
            </View>
            <View style={styles.headingPreview}>
              {renderHeadingPreview()}
            </View>
            {renderHeadingOptions()}
          </View>
        );

      case 'Checkbox Options':
      case 'Multiple Choice':
      case 'Checklist':
      case 'Yes/No':
        return (
          <View>
            <Button
              title="Manage Options"
              onPress={() => {
                setCurrentFieldType(type.type);
                setShowOptionsModal(true);
              }}
              type="outline"
              containerStyle={styles.manageButton}
            />
            {type.type === 'Checkbox Options' && checkboxOptions.map(option => (
              <CheckBox
                key={option.id}
                title={`${option.label} (${option.value})`}
                checked={option.checked}
                onPress={() => handleCheckboxToggle(option.id)}
              />
            ))}
            {type.type === 'Multiple Choice' && multipleChoiceOptions.map(option => (
              <CheckBox
                key={option.id}
                title={`${option.label} (${option.value})`}
                checked={option.selected}
                onPress={() => handleMultipleChoiceSelect(option.id)}
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
              />
            ))}
            {type.type === 'Checklist' && checklistItems.map(option => (
              <CheckBox
                key={option.id}
                title={`${option.label} (${option.value})`}
                checked={option.checked}
                onPress={() => handleCheckboxToggle(option.id)}
              />
            ))}
            {type.type === 'Yes/No' && (
              <View style={styles.yesNoContainer}>
                <Button
                  title={yesNoOptions.yes.label}
                  onPress={() => setValue(yesNoOptions.yes.value)}
                  buttonStyle={[
                    styles.yesNoButton,
                    value === yesNoOptions.yes.value && styles.selectedButton
                  ]}
                  type={value === yesNoOptions.yes.value ? "solid" : "outline"}
                />
                <Button
                  title={yesNoOptions.no.label}
                  onPress={() => setValue(yesNoOptions.no.value)}
                  buttonStyle={[
                    styles.yesNoButton,
                    value === yesNoOptions.no.value && styles.selectedButton
                  ]}
                  type={value === yesNoOptions.no.value ? "solid" : "outline"}
                />
              </View>
            )}
          </View>
        );

      case 'Text Field':
        return (
          <Input
            placeholder="Enter text"
            value={value}
            onChangeText={setValue}
            leftIcon={<Icon name={type.icon} type="material" size={24} color="grey" />}
          />
        );
      
      case 'Number Field':
        return (
          <Input
            placeholder="Enter number"
            value={value}
            onChangeText={setValue}
            keyboardType="numeric"
            leftIcon={<Icon name={type.icon} type="material" size={24} color="grey" />}
          />
        );

      case 'Amount':
        return (
          <Input
            placeholder="Enter amount"
            value={value}
            onChangeText={setValue}
            keyboardType="decimal-pad"
            leftIcon={<Icon name={type.icon} type="material" size={24} color="grey" />}
            prefix="$"
          />
        );

      case 'Meter Reading':
        return (
          <Input
            placeholder="Enter meter reading"
            value={value}
            onChangeText={setValue}
            keyboardType="decimal-pad"
            leftIcon={<Icon name={type.icon} type="material" size={24} color="grey" />}
          />
        );
      
      case 'Date':
        return (
          <View>
            <Button
              title={value || "Select Date"}
              onPress={() => setShowDatePicker(true)}
              icon={<Icon name={type.icon} type="material" size={24} color="grey" />}
              type="outline"
            />
            {showDatePicker && (
              <DateTimePicker
                value={value ? new Date(value) : new Date()}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    setValue(selectedDate.toLocaleDateString());
                  }
                }}
              />
            )}
          </View>
        );
      
      case 'Inspection Check':
        return (
          <View>
            {inspectionItems.map(item => (
              <View key={item.id} style={styles.inspectionItem}>
                <Text>{item.label}</Text>
                <View style={styles.inspectionButtons}>
                  <Button
                    title="Pass"
                    type={item.status === 'pass' ? 'solid' : 'outline'}
                    onPress={() => handleInspectionStatus(item.id, 'pass')}
                    buttonStyle={[styles.inspectionButton, item.status === 'pass' && styles.passButton]}
                  />
                  <Button
                    title="Fail"
                    type={item.status === 'fail' ? 'solid' : 'outline'}
                    onPress={() => handleInspectionStatus(item.id, 'fail')}
                    buttonStyle={[styles.inspectionButton, item.status === 'fail' && styles.failButton]}
                  />
                </View>
              </View>
            ))}
          </View>
        );

      case 'File/Picture':
        return (
          <View style={styles.imageContainer}>
            {image ? (
              <View>
                <Image source={{ uri: image }} style={styles.image} />
                <Button
                  title="Take New Picture"
                  onPress={handleImagePicker}
                  type="outline"
                />
              </View>
            ) : (
              <Button
                title="Take Picture"
                onPress={handleImagePicker}
                icon={<Icon name="camera-alt" type="material" />}
              />
            )}
          </View>
        );

      case 'Signature Block':
        return (
          <View style={styles.signatureContainer}>
            <View style={styles.signatureBox}>
              <Button
                title="Capture Signature"
                onPress={() => {
                  ImagePicker.launchCamera({
                    mediaType: 'photo',
                    includeBase64: true,
                    quality: 0.7,
                  }, (response) => {
                    if (response.assets) {
                      setSignature(response.assets[0].uri);
                    }
                  });
                }}
                icon={<Icon name="draw" type="material" />}
              />
              {signature && (
                <View style={styles.signaturePreview}>
                  <Image
                    source={{ uri: signature }}
                    style={styles.signatureImage}
                    resizeMode="contain"
                  />
                  <Button
                    title="Clear Signature"
                    onPress={() => setSignature(null)}
                    type="outline"
                    containerStyle={styles.clearButton}
                  />
                </View>
              )}
            </View>
          </View>
        );

      default:
        return (
          <Input
            placeholder="Enter value"
            value={value}
            onChangeText={setValue}
            leftIcon={<Icon name={type.icon} type="material" size={24} color="grey" />}
          />
        );
    }
  };

  return (
    <View style={[
      styles.container,
      type.type === 'Section' && styles.sectionFieldContainer
    ]}>
      <View style={styles.header}>
        <Text style={styles.fieldType}>{type.type}</Text>
        <Button
          icon={<Icon name="delete" color="red" />}
          type="clear"
          onPress={onDelete}
        />
      </View>
      {renderFieldInput()}
      <OptionsModal />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  fieldType: {
    fontSize: 16,
    fontWeight: '600',
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 10,
    borderRadius: 8,
  },
  signatureContainer: {
    marginVertical: 10,
  },
  signatureBox: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 16,
  },
  signaturePreview: {
    marginTop: 16,
    alignItems: 'center',
  },
  signatureImage: {
    width: '100%',
    height: 150,
    backgroundColor: '#f5f5f5',
    marginBottom: 10,
    borderRadius: 8,
  },
  clearButton: {
    marginTop: 8,
  },
  yesNoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  yesNoButton: {
    width: 120,
  },
  selectedButton: {
    backgroundColor: '#2089dc',
  },
  inspectionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5,
  },
  inspectionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  inspectionButton: {
    width: 80,
  },
  passButton: {
    backgroundColor: '#4CAF50',
  },
  failButton: {
    backgroundColor: '#F44336',
  },
  overlay: {
    width: '90%',
    borderRadius: 10,
    padding: 0,
  },
  modalContent: {
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  addOptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  optionInput: {
    flex: 1,
    marginRight: 10,
  },
  addButton: {
    minWidth: 80,
  },
  optionsList: {
    maxHeight: 300,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  optionDetails: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 16,
  },
  optionValue: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  optionButtons: {
    flexDirection: 'row',
  },
  doneButton: {
    marginTop: 20,
  },
  manageButton: {
    marginBottom: 10,
  },
  headingContainer: {
    marginVertical: 10,
  },
  headingControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  headingInput: {
    flex: 1,
    marginRight: 10,
  },
  headingLevelSelect: {
    width: 80,
  },
  headingPreview: {
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginTop: 10,
  },
  headingOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 10,
  },
  headingLevelButton: {
    width: '30%',
    marginVertical: 5,
  },
  sectionContainer: {
    marginVertical: 10,
  },
  sectionInput: {
    marginBottom: 10,
  },
  sectionDescriptionInput: {
    marginBottom: 15,
  },
  sectionPreview: {
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  sectionFieldContainer: {
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: '#e9ecef',
  },
});

export default ProcedureField;
