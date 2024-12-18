import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, FlatList } from 'react-native';

interface WorkTypeModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (workType: string) => void;
  currentWorkType: string;
}

const workTypes = ['Cycle Count', 'Other', 'Preventive', 'Reactive'];

export const WorkTypeModal: React.FC<WorkTypeModalProps> = ({
  visible,
  onClose,
  onSelect,
  currentWorkType,
}) => {
  const renderItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[
        styles.item,
        currentWorkType === item && styles.selectedItem
      ]}
      onPress={() => {
        onSelect(item);
        onClose();
      }}
    >
      <Text style={[
        styles.itemText,
        currentWorkType === item && styles.selectedItemText
      ]}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Select Work Type</Text>
          <FlatList
            data={workTypes}
            renderItem={renderItem}
            keyExtractor={(item) => item}
          />
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  item: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  selectedItem: {
    backgroundColor: '#e3f2fd',
  },
  itemText: {
    fontSize: 18,
  },
  selectedItemText: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
  cancelButton: {
    alignItems: 'center',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  cancelButtonText: {
    fontSize: 18,
    color: '#007AFF',
  },
});

