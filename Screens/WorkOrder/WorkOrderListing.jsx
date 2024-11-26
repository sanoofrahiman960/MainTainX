import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  SafeAreaView,
} from 'react-native';
import {Appbar} from 'react-native-paper'
import Icon from 'react-native-vector-icons/Feather';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { setWorkOrders } from '../../redux/actions/workOrderAction';

const WorkOrderListing = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const workOrders = useSelector((state) => state.workOrders.workOrders);
  const [filteredWorkOrders, setFilteredWorkOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('dueDate');

  useEffect(() => {
    // Simulating API call to fetch work orders
    const fetchWorkOrders = async () => {
      try {
        // Replace this with your actual API call
        const response = await fetch('https://api.example.com/work-orders');
        const data = await response.json();
        dispatch(setWorkOrders(data));
      } catch (error) {
        console.error('Error fetching work orders:', error);
        // Handle error (e.g., show an error message to the user)
      }
    };

    fetchWorkOrders();
  }, [dispatch]);

  useEffect(() => {
    // Apply initial sorting and filtering
    const sorted = sortWorkOrders(workOrders, sortBy);
    setFilteredWorkOrders(sorted);
  }, [workOrders, sortBy]);

  const filterWorkOrders = (query) => {
    const filtered = workOrders.filter(order => 
      order.task.toLowerCase().includes(query.toLowerCase()) ||
      order.status.toLowerCase().includes(query.toLowerCase()) ||
      order.priority.toLowerCase().includes(query.toLowerCase())
    );
    const sorted = sortWorkOrders(filtered, sortBy);
    setFilteredWorkOrders(sorted);
  };

  const sortWorkOrders = (orders, key) => {
    return [...orders].sort((a, b) => {
      if (key === 'dueDate') {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      } else {
        const priorityOrder = { 'Critical': 0, 'High': 1, 'Medium': 2, 'Low': 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
    });
  };

  const handleSort = (key) => {
    setSortBy(key);
    const sorted = sortWorkOrders(filteredWorkOrders, key);
    setFilteredWorkOrders(sorted);
  };

  const renderWorkOrderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.workOrderItem} 
      onPress={() => navigation.navigate('WorkOrderDetail', { workOrder: item })}
    >
      <View style={styles.workOrderHeader}>
        <Text style={styles.workOrderTitle}>{item.task}</Text>
        <Text style={[styles.workOrderStatus, { color: getStatusColor(item.status) }]}>{item.status}</Text>
      </View>
      <View style={styles.workOrderDetails}>
        <Text style={styles.workOrderPriority}>Priority: {item.priority}</Text>
        <Text style={styles.workOrderDueDate}>Due: {new Date(item.dueDate).toLocaleDateString()}</Text>
      </View>
    </TouchableOpacity>
  );

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'open':
        return '#4CAF50';
      case 'in progress':
        return '#FFC107';
      case 'closed':
        return '#F44336';
      default:
        return '#000000';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
      <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Work Orders</Text>
        <TouchableOpacity onPress={() => navigation.navigate('WorkOrderAdd')}>
          <Icon name="plus" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styles.searchContainer}>
        <Icon name="search" size={24} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search work orders..."
          value={searchQuery}
          onChangeText={(text) => {
            setSearchQuery(text);
            filterWorkOrders(text);
          }}
        />
      </View>
      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Sort by:</Text>
        <TouchableOpacity
          style={[styles.sortButton, sortBy === 'dueDate' && styles.sortButtonActive]}
          onPress={() => handleSort('dueDate')}
        >
          <Text style={[styles.sortButtonText, sortBy === 'dueDate' && styles.sortButtonTextActive]}>Due Date</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sortButton, sortBy === 'priority' && styles.sortButtonActive]}
          onPress={() => handleSort('priority')}
        >
          <Text style={[styles.sortButtonText, sortBy === 'priority' && styles.sortButtonTextActive]}>Priority</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={filteredWorkOrders}
        renderItem={renderWorkOrderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyListText}>No work orders found</Text>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#2196F3',
    padding: 16,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  sortLabel: {
    fontSize: 16,
    marginRight: 8,
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#e0e0e0',
    marginRight: 8,
  },
  sortButtonActive: {
    backgroundColor: '#2196F3',
  },
  sortButtonText: {
    fontSize: 14,
    color: '#333',
  },
  sortButtonTextActive: {
    color: '#fff',
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  workOrderItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  workOrderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  workOrderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  workOrderStatus: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  workOrderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  workOrderPriority: {
    fontSize: 14,
    color: '#666',
  },
  workOrderDueDate: {
    fontSize: 14,
    color: '#666',
  },
  emptyListText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
});

export default WorkOrderListing;

