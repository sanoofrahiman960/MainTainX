import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput } from 'react-native';

interface EstimatedTimeModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (hours: number, minutes: number) => void;
  initialHours?: number;
  initialMinutes?: number;
}

export const EstimatedTimeModal: React.FC<EstimatedTimeModalProps> = ({
  visible,
  onClose,
  onSave,
  initialHours = 1,
  initialMinutes = 0,
}) => {
  const [hours, setHours] = useState(initialHours.toString());
  const [minutes, setMinutes] = useState(initialMinutes.toString());

  useEffect(() => {
    setHours(initialHours.toString());
    setMinutes(initialMinutes.toString());
  }, [initialHours, initialMinutes]);

  const handleSave = () => {
    const parsedHours = Math.max(0, Math.min(parseInt(hours) || 0, 23));
    const parsedMinutes = Math.max(0, Math.min(parseInt(minutes) || 0, 59));
    onSave(parsedHours, parsedMinutes);
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.cancelButton}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Estimated Time</Text>
            <TouchableOpacity onPress={handleSave}>
              <Text style={styles.doneButton}>Done</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={hours}
                onChangeText={setHours}
                keyboardType="number-pad"
                maxLength={2}
              />
              <Text style={styles.inputLabel}>Hour</Text>
            </View>
            <Text style={styles.separator}>:</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={minutes}
                onChangeText={setMinutes}
                keyboardType="number-pad"
                maxLength={2}
              />
              <Text style={styles.inputLabel}>Minutes</Text>
            </View>
          </View>
          <Text style={styles.helperText}>
            How long do you think this work order will take?
          </Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    fontSize: 16,
    color: '#007AFF',
  },
  doneButton: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  inputWrapper: {
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 5,
    padding: 10,
    width: 80,
    fontSize: 24,
    textAlign: 'center',
  },
  inputLabel: {
    marginTop: 5,
    fontSize: 14,
    color: '#666666',
  },
  separator: {
    fontSize: 24,
    marginHorizontal: 10,
  },
  helperText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
});

