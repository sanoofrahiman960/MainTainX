import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BottomSheet, ListItem, Icon } from '@rneui/themed';

const ProcedureOptionsSheet = ({ isVisible, onClose, onOptionSelect }) => {
  const options = [
    {
      title: 'Quick Create',
      icon: 'flash',
      onPress: () => onOptionSelect('quick'),
    },
    {
      title: 'Add Procedure from Library',
      icon: 'library-books',
      onPress: () => onOptionSelect('library'),
    },
    {
      title: 'Start from Blank',
      icon: 'add-circle-outline',
      onPress: () => onOptionSelect('blank'),
    },
  ];

  return (
    <BottomSheet isVisible={isVisible} onBackdropPress={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Create New Procedure</Text>
        </View>
        {options.map((option, index) => (
          <ListItem
            key={index}
            onPress={option.onPress}
            containerStyle={styles.optionContainer}
          >
            <Icon name={option.icon} type="material" />
            <ListItem.Content>
              <ListItem.Title style={styles.optionTitle}>
                {option.title}
              </ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>
        ))}
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
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
  optionContainer: {
    paddingVertical: 12,
  },
  optionTitle: {
    fontSize: 16,
  },
});

export default ProcedureOptionsSheet;
