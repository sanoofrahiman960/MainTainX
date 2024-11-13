import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

export default function LocationsScreen() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('Assets');
  const [activeTabs, setActiveTabs] = useState('locations');

  const Footer = ({ activeTab, onTabPress }) => (
    <View style={styles.footer}>
      <TouchableOpacity onPress={() => onTabPress('Home')} style={styles.footerTab}>
        <Icon name="home" size={24} color={activeTab === 'Home' ? '#2196F3' : '#757575'} />
        <Text style={[styles.footerTabText, activeTab === 'Home' && styles.activeFooterTabText]}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onTabPress('Assets')} style={styles.footerTab}>
        <Icon name="cube" size={24} color={activeTab === 'Assets' ? '#2196F3' : '#757575'} />
        <Text style={[styles.footerTabText, activeTab === 'Assets' && styles.activeFooterTabText]}>Assets</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onTabPress('Work Orders')} style={styles.footerTab}>
        <Icon name="clipboard-list" size={24} color={activeTab === 'Work Orders' ? '#2196F3' : '#757575'} />
        <Text style={[styles.footerTabText, activeTab === 'Work Orders' && styles.activeFooterTabText]}>Work Orders</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onTabPress('More')} style={styles.footerTab}>
        <Icon name="dots-horizontal" size={24} color={activeTab === 'More' ? '#2196F3' : '#757575'} />
        <Text style={[styles.footerTabText, activeTab === 'More' && styles.activeFooterTabText]}>More</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{activeTabs=="assets"?"Assets":"Locations"}</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={() => navigation.navigate('Filter')} style={styles.headerButton}>
            <Icon name="filter" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Icon name="qrcode-scan" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity 
          onPress={() => setActiveTabs('assets')} 
          style={[styles.tab, activeTabs === 'assets' && styles.activeTab]}
        >
          <Text style={[styles.tabText, activeTabs === 'assets' && styles.activeTabText]}>ASSETS</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => setActiveTabs('locations')} 
          style={[styles.tab, activeTabs === 'locations' && styles.activeTab]}
        >
          <Text style={[styles.tabText, activeTabs === 'locations' && styles.activeTabText]}>LOCATIONS</Text>
        </TouchableOpacity>
      </View>

      {activeTabs === 'locations' ? (
        <>
          <View style={styles.searchContainer}>
            <TextInput
              placeholder="Search"
              style={styles.searchInput}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.locationList}>
            {['General', 'Kuwait'].map((location, index) => (
              <TouchableOpacity key={index} style={styles.locationItem}>
                <View style={styles.locationIcon}>
                  <Icon name="map-marker" size={24} color="#2196F3" />
                </View>
                <Text style={styles.locationText}>{location}</Text>
                <Icon name="chevron-right" size={24} color="#757575" />
              </TouchableOpacity>
            ))}
          </View>
        </>
      ):
      <SafeAreaView style={styles.container}>
      <View style={styles.emptyStateContainer}>
        <Icon name="package-variant" size={100} color="#2196F3" style={styles.emptyStateIcon} />
        <Text style={styles.emptyStateTitle}>How can we break it if we don't know what it is?</Text>
        <Text style={styles.emptyStateSubtitle}>Start adding the Assets you're in charge of maintaining</Text>
        <TouchableOpacity onPress={() => {}} style={styles.learnMoreButton}>
          <Text style={styles.learnMoreText}>Learn More</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => navigation.navigate('NewAsset')} style={styles.floatingButton}>
        <Icon name="plus" size={24} color="#FFFFFF" style={styles.plusIcon} />
        <Text style={styles.floatingButtonText}>New Asset</Text>
      </TouchableOpacity>

    </SafeAreaView>
      }

      <TouchableOpacity onPress={() => navigation.navigate('OnBoard')} style={styles.floatingButton}>
        <Icon name="plus" size={24} color="#FFFFFF" />
        <Text style={styles.floatingButtonText}>New {activeTabs=="assets"?"Assets":"Locations"}</Text>
      </TouchableOpacity>

    
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#2196F3',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 16,
  },
  headerButton: {
    padding: 4,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#2196F3',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#757575',
  },
  activeTabText: {
    color: '#2196F3',
  },
  searchContainer: {
    padding: 16,
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  locationList: {
    padding: 16,
    gap: 16,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
  },
  locationIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F9FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  locationText: {
    fontSize: 16,
    color: '#333333',
    flex: 1,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 44,
    right: 24,
    backgroundColor: '#2196F3',
    borderRadius: 24,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  floatingButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  footerTab: {
    alignItems: 'center',
  },
  footerTabText: {
    fontSize: 12,
    color: '#757575',
    marginTop: 4,
  },
  activeFooterTabText: {
    color: '#2196F3',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: '#333333',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyStateIcon: {
    marginBottom: 24,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2196F3',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
    marginBottom: 24,
  },
  learnMoreButton: {
    padding: 8,
  },
  learnMoreText: {
    color: '#2196F3',
    fontSize: 16,
    fontWeight: '500',
  },
});