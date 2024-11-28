import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  TextInput,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSelector, useDispatch } from 'react-redux';

export default function VendorsListing() {
  const navigation = useNavigation();
  const vendors = useSelector(state => state.assets.vendors);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVendors, setSelectedVendors] = useState([]);

  const handleVendorSelect = useCallback((vendor) => {
    setSelectedVendors(prev => {
      if (prev.some(v => v.id === vendor.id)) {
        return prev.filter(v => v.id !== vendor.id);
      } else {
        return [...prev, vendor];
      }
    });
  }, []);

  const handleRemoveVendor = useCallback((vendorId) => {
    setSelectedVendors(prev => prev.filter(v => v.id !== vendorId));
  }, []);

  const filteredVendors = vendors.filter(vendor =>
    vendor.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#2196F3" barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Vendors</Text>
        <TouchableOpacity 
          style={styles.doneButton}
          onPress={() => {
            navigation.navigate('WorkOrderAdd', {
              selectedVendors: selectedVendors.map(vendor => ({
                id: vendor.id,
                name: vendor.name,
                category: vendor.category
              }))
            });
          }}
        >
          <Text style={styles.doneText}>DONE</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar and Selected Vendors */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#757575" style={styles.searchIcon} />
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.selectedVendorsContainer}
        >
          {selectedVendors.map(vendor => (
            <TouchableOpacity
              key={vendor.id}
              style={styles.selectedVendorChip}
              onPress={() => handleRemoveVendor(vendor.id)}
            >
              <Text style={styles.selectedVendorText}>{vendor.name}</Text>
              <Icon name="close" size={16} color="#fff" />
            </TouchableOpacity>
          ))}
          <TextInput
            style={styles.searchInput}
            placeholder={selectedVendors.length ? "" : "Search"}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </ScrollView>
      </View>

      {/* Vendors List */}
      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>All vendors</Text>

        {filteredVendors.map((item) => (
          <TouchableOpacity 
            key={item.id} 
            style={[
              styles.vendorItem,
              selectedVendors.some(v => v.id === item.id) && styles.selectedVendorItem
            ]}
            onPress={() => handleVendorSelect(item)}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{item.name.substring(0, 2).toUpperCase()}</Text>
            </View>
            <View style={styles.vendorInfo}>
              <Text style={styles.vendorName}>{item.name}</Text>
              <Text style={styles.vendorContacts}>No contacts</Text>
            </View>
            {selectedVendors.some(v => v.id === item.id) && (
              <Icon name="check" size={24} color="#2196F3" style={styles.checkIcon} />
            )}
          </TouchableOpacity>
        ))}

        {/* Create Vendor Button */}
        <TouchableOpacity 
          style={styles.createButton}
          onPress={() => navigation.navigate('CreateVendor')}
        >
          <View style={styles.createButtonIcon}>
            <Icon name="add" size={24} color="#fff" />
          </View>
          <Text style={styles.createButtonText}>Create Vendor</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton}>
          <Icon name="stop" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Icon name="circle" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Icon name="arrow-back" size={24} color="#fff" />
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
    height: 56,
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    color: '#fff',
    fontSize: 20,
    marginLeft: 16,
    fontWeight: '500',
  },
  doneButton: {
    padding: 8,
  },
  doneText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchIcon: {
    marginRight: 8,
  },
  selectedVendorsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedVendorChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2196F3',
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
  },
  selectedVendorText: {
    color: '#fff',
    marginRight: 4,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#000',
  },
  content: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  vendorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  selectedVendorItem: {
    backgroundColor: '#E3F2FD',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4DB6AC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  vendorInfo: {
    flex: 1,
    marginLeft: 16,
  },
  vendorName: {
    fontSize: 16,
    color: '#000',
  },
  vendorContacts: {
    fontSize: 14,
    color: '#757575',
    marginTop: 2,
  },
  checkIcon: {
    marginLeft: 8,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 16,
  },
  createButtonIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  createButtonText: {
    marginLeft: 16,
    fontSize: 16,
    color: '#2196F3',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#000',
    height: 56,
    paddingHorizontal: 16,
  },
  navButton: {
    padding: 8,
  },
});

