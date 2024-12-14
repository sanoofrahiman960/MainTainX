import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

const UrlSelectionScreen = ({ navigation }) => {
  const [selectedUrl, setSelectedUrl] = useState('');
  const urls = [
    // { label: 'Select a server', value: '' },
    // { label: 'Production Server', value: 'https://prod.example.com' },
    // { label: 'Staging Server', value: 'https://staging.example.com' },
    { label: 'Development Server', value: 'https://zamcodev-odoo-staging-16677381.dev.odoo.com' },
  ];

  const handleContinue = () => {
    if (selectedUrl) {
      navigation.navigate('LoginMaster', { serverUrl: selectedUrl });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Select Server</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedUrl}
            onValueChange={(itemValue) => setSelectedUrl(itemValue)}
            style={styles.picker}
          >
            {urls.map((url) => (
              <Picker.Item key={url.value} label={url.label} value={url.value} />
            ))}
          </Picker>
        </View>
        <TouchableOpacity
          style={[styles.button, !selectedUrl && styles.buttonDisabled]}
          onPress={handleContinue}
          disabled={!selectedUrl}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 30,
    textAlign: 'center',
  },
  pickerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  picker: {
    height: 50,
    width: '100%',
  },
  button: {
    backgroundColor: '#4A90E2',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#95A5A6',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default UrlSelectionScreen;
