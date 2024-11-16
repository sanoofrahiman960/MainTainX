import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function LocationAdd() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Location</Text>
        <TouchableOpacity>
          <Text style={styles.createButton}>CREATE</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <TextInput
          style={styles.nameInput}
          placeholder="Enter Location Name"
          placeholderTextColor="#999"
        />

        <TouchableOpacity style={styles.imageButton}>
          <Icon name="camera" size={24} color="#2196F3" />
          <Text style={styles.imageButtonText}>Add or take pictures</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.descriptionInput}
          placeholder="Add a description"
          placeholderTextColor="#999"
          multiline
          numberOfLines={4}
        />

        <Text style={styles.label}>Address</Text>
        <TextInput
          style={styles.addressInput}
          placeholder="Address"
          placeholderTextColor="#999"
        />

        <TouchableOpacity style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>QR Code/Barcode</Text>
          <View style={styles.fieldValue}>
            <Text style={styles.assignText}>Assign</Text>
            <Icon name="chevron-right" size={24} color="#999" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Teams in Charge</Text>
          <View style={styles.fieldValue}>
            <Text style={styles.chooseText}>Choose</Text>
            <Icon name="chevron-right" size={24} color="#999" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Vendors</Text>
          <View style={styles.fieldValue}>
            <Text style={styles.assignText}>Assign</Text>
            <Icon name="chevron-right" size={24} color="#999" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Files</Text>
          <View style={styles.fieldValue}>
            <Text style={styles.attachText}>Attach</Text>
            <Icon name="chevron-right" size={24} color="#999" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.fieldContainer}>
          <View style={styles.fieldLabelWithIcon}>
            <Text style={styles.fieldLabel}>Parent Location</Text>
            <Icon name="lock" size={16} color="#999" />
          </View>
          <View style={styles.fieldValue}>
            <Text style={styles.parentLocationText}>Parent Location</Text>
            <Icon name="chevron-right" size={24} color="#999" />
          </View>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="chart-box" size={24} color="#2196F3" />
          <Text style={styles.navText}>Overview</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="clipboard-text" size={24} color="#999" />
          <Text style={styles.navText}>Work Orders</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="view-grid" size={24} color="#999" />
          <Text style={styles.navText}>Assets</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="message" size={24} color="#999" />
          <Text style={styles.navText}>Messages</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="menu" size={24} color="#999" />
          <Text style={styles.navText}>More</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2196F3',
    padding: 16,
  },
  headerTitle: {
    flex: 1,
    color: '#fff',
    fontSize: 20,
    marginLeft: 16,
  },
  createButton: {
    color: '#fff',
    fontSize: 16,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  nameInput: {
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 8,
    marginBottom: 16,
  },
  imageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F9FF',
    padding: 16,
    borderRadius: 4,
    marginBottom: 24,
  },
  imageButtonText: {
    color: '#2196F3',
    marginLeft: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 4,
    padding: 12,
    height: 100,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  addressInput: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 4,
    padding: 12,
    marginBottom: 16,
  },
  fieldContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  fieldLabel: {
    fontSize: 16,
    color: '#333',
  },
  fieldLabelWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  fieldValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  assignText: {
    color: '#2196F3',
    marginRight: 8,
  },
  chooseText: {
    color: '#2196F3',
    marginRight: 8,
  },
  attachText: {
    color: '#2196F3',
    marginRight: 8,
  },
  parentLocationText: {
    color: '#2196F3',
    marginRight: 8,
  },
  bottomNav: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingVertical: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
});