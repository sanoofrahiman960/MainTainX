import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList } from 'react-native';
import { BottomSheet, ListItem, Icon, SearchBar } from '@rneui/themed';

const fieldTypes = [
  { id: '1', type: 'Heading', icon: 'title', description: 'Add a heading with customizable size (H1-H6)' },
  { id: '2', type: 'Text Field', icon: 'text-fields', description: 'Single line text input' },
  { id: '3', type: 'Number Field', icon: 'pin', description: 'Numeric input only' },
  { id: '4', type: 'Amount', icon: 'attach-money', description: 'Currency amount input' },
  { id: '5', type: 'Date', icon: 'event', description: 'Date selector' },
  { id: '6', type: 'Meter Reading', icon: 'speed', description: 'Input for meter readings' },
  { id: '7', type: 'Checkbox Options', icon: 'check-box', description: 'Multiple selectable options' },
  { id: '8', type: 'Checklist', icon: 'playlist-add-check', description: 'List of items to check off' },
  { id: '9', type: 'Multiple Choice', icon: 'radio-button-checked', description: 'Single selection from multiple options' },
  { id: '10', type: 'Inspection Check', icon: 'fact-check', description: 'Pass/Fail inspection items' },
  { id: '11', type: 'Yes/No', icon: 'thumbs-up-down', description: 'Simple yes or no selection' },
  { id: '12', type: 'File/Picture', icon: 'image', description: 'Upload files or take pictures' },
  { id: '13', type: 'Signature Block', icon: 'draw', description: 'Capture signatures' },
];

const FieldTypesSheet = ({ isVisible, onClose, onSelectFieldType }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFieldTypes = fieldTypes.filter(field =>
    field.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <ListItem
      onPress={() => onSelectFieldType(item)}
      containerStyle={styles.listItem}
    >
      <Icon name={item.icon} type="material" />
      <ListItem.Content>
        <ListItem.Title style={styles.itemTitle}>{item.type}</ListItem.Title>
      </ListItem.Content>
      <ListItem.Chevron />
    </ListItem>
  );

  return (
    <BottomSheet isVisible={isVisible} onBackdropPress={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Select Field Type</Text>
        </View>
        <SearchBar
          placeholder="Search field types..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          containerStyle={styles.searchContainer}
          inputContainerStyle={styles.searchInputContainer}
          platform="ios"
        />
        <FlatList
          data={filteredFieldTypes}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          style={styles.list}
        />
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  searchContainer: {
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  searchInputContainer: {
    backgroundColor: '#f2f2f2',
  },
  list: {
    maxHeight: '70%',
  },
  listItem: {
    paddingVertical: 12,
  },
  itemTitle: {
    fontSize: 16,
  },
});

export default FieldTypesSheet;
