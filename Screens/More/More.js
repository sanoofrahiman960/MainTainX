import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function ProductFeaturesScreen() {
  const [activeTab, setActiveTab] = useState('More');

  
  const features = [
    { id: 1, title: 'Procedures', icon: 'format-list-bulleted', bgColor: '#F3F0FF', iconColor: '#7C3AED' },
    { id: 2, title: 'Requests', icon: 'download', bgColor: '#ECFDF5', iconColor: '#059669' },
    { id: 3, title: 'Parts Inventory', icon: 'cog', bgColor: '#FFF7ED', iconColor: '#EA580C' },
    { id: 4, title: 'Meters', icon: 'chart-line', bgColor: '#F0F9FF', iconColor: '#0284C7' },
    { id: 5, title: 'Vendors', icon: 'file-document', bgColor: '#FDF2F8', iconColor: '#DB2777' },
    { id: 6, title: 'Reporting', icon: 'chart-bar', bgColor: '#FEFCE8', iconColor: '#CA8A04' },
    { id: 7, title: 'Get Desktop App', icon: 'desktop-mac', bgColor: '#F1F5F9', iconColor: '#0F172A' },
  ];

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
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.callIndicator}>
          <Icon name="phone" size={20} color="#666666" />
        </View>
        <Text style={styles.headerTitle}>Organisation Name</Text>
        <TouchableOpacity style={styles.accountButton}>
          <Icon name="account" size={24} color="#2196F3" />
        </TouchableOpacity>
      </View>

      {/* Notification Banner */}
      <View style={styles.notificationBanner}>
        <Text style={styles.notificationText}>Notifications are disabled</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Product Features Section */}
        <Text style={styles.sectionTitle}>PRODUCT FEATURES</Text>
        
        <View style={styles.featuresGrid}>
          {features.map((feature) => (
            <TouchableOpacity key={feature.id} style={styles.featureCard}>
              <View style={[styles.iconContainer, { backgroundColor: feature.bgColor }]}>
                <Icon name={feature.icon} size={24} color={feature.iconColor} />
              </View>
              <Text style={styles.featureTitle}>{feature.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

     
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  callIndicator: {
    backgroundColor: '#E5E5E5',
    padding: 8,
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  accountButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBanner: {
    backgroundColor: '#F5F5F5',
    padding: 12,
    alignItems: 'center',
  },
  notificationText: {
    color: '#666666',
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 16,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    marginBottom: 16,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
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
});