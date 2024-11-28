import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface VendorListItemProps {
  title: string;
  count?: number;
  onPress?: () => void;
}

export default function VendorListItem({ title, count, onPress }: VendorListItemProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text style={styles.title}>Vendors</Text>
      <View style={styles.rightContent}>
        <Text style={styles.vendorText}>
          {title}
          {count ? <Text style={styles.countText}>{`, +${count}`}</Text> : null}
        </Text>
        <Icon name="chevron-right" size={24} color="#007AFF" style={styles.icon} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vendorText: {
    fontSize: 16,
    color: '#000',
    marginRight: 4,
  },
  countText: {
    color: '#007AFF',
  },
  icon: {
    marginLeft: 4,
  },
});

