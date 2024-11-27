import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Appbar, List, Searchbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock data for customers. In a real app, this would come from an API or database
const mockCustomers = [
  { id: '1', name: 'John Doe', email: 'john@example.com' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
  { id: '3', name: 'Bob Johnson', email: 'bob@example.com' },
  { id: '4', name: 'Alice Brown', email: 'alice@example.com' },
  { id: '5', name: 'Charlie Davis', email: 'charlie@example.com' },
];

export default function CustomerSelectionPage() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState(mockCustomers);

  useEffect(() => {
    const filtered = mockCustomers.filter(customer =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCustomers(filtered);
  }, [searchQuery]);

  const handleCustomerSelect = async (customer:any) => {
    try {
      await AsyncStorage.setItem('selectedCustomerId', customer.id);
      await AsyncStorage.setItem('selectedCustomerName', customer.name);
      console.log("Selected customer:", customer.name);
      navigation.navigate('WorkOrderAdd', { selectedCustomer: customer });
    } catch (error) {
      console.error('Error saving customer data:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Select Customer" />
      </Appbar.Header>
      <Searchbar
        placeholder="Search customers"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />
      <FlatList
        data={filteredCustomers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <List.Item
            title={item.name}
            description={item.email}
            onPress={() => handleCustomerSelect(item)}
            right={(props:any) => <List.Icon {...props} icon="chevron-right" />}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchBar: {
    margin: 16,
  },
});
