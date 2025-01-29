import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Searchbar } from 'react-native-paper';
import { BASE_URL } from '../../Util/Const';
import { format } from 'date-fns';
import { useSelector } from 'react-redux';
import Toast from 'react-native-simple-toast';
import { getData, getObjectData, storeData } from '../../Util/Storage';
import { useNavigation } from '@react-navigation/native';

const Tab = createMaterialTopTabNavigator();

const TodoWorkOrders = ({ selectedDate, workOrders, searchQuery }) => {
const navigation = useNavigation();

  const filteredOrders = workOrders.filter(order => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      order.name.toLowerCase().includes(searchLower) ||
      (order.partner_id && order.partner_id[1].toLowerCase().includes(searchLower));
    
    return order.stage_id[1] !== 'Done' && (!searchQuery || matchesSearch);
  });

  return (
    <FlatList
      data={filteredOrders}
      keyExtractor={item => item.id.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity   onPress={() => navigation.navigate('WorkOrderDetails', { workOrderId: item.id })} style={styles.orderCard}>
          <Text style={styles.orderTitle}>{item.name}</Text>
          {item.partner_id && <Text style={styles.orderDetail}>Customer: {item.partner_id[1]}</Text>}
          {/* {item.contact_location_id && <Text style={styles.orderDetail}>Location: {item.contact_location_id[1]}</Text>} */}
          <Text style={styles.orderDetail}>Due: {format(new Date(item.due_date), 'dd/MM/yyyy')}</Text>
          {/* {item.description && (
            <Text style={styles.orderDetail} numberOfLines={2}>
              Description: {item.description}
            </Text>
          )} */}
          <View style={styles.priorityContainer}>
            <Icon 
              name="flag" 
              size={20} 
              color={item.priority === '3' ? 'red' : item.priority === '2' ? 'orange' : 'green'} 
            />
            <Text style={styles.priorityText}>
              {item.priority === '3' ? 'High' : item.priority === '2' ? 'Medium' : 'Low'}
            </Text>
          </View>
      </TouchableOpacity>
      )}
      ListEmptyComponent={() => (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {searchQuery ? 'No matching work orders found' : 'No todo work orders for this date'}
          </Text>
        </View>
      )}
    />
  );
};

const DoneWorkOrders = ({ selectedDate, workOrders, searchQuery }) => {
  const navigation = useNavigation();
  const filteredOrders = workOrders.filter(order => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      order.name.toLowerCase().includes(searchLower) ||
      (order.partner_id && order.partner_id[1].toLowerCase().includes(searchLower));
    
    return order.stage_id[1] === 'Done' && (!searchQuery || matchesSearch);
  });

  return (
    <FlatList
      data={filteredOrders}
      keyExtractor={item => item.id.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity   onPress={() => navigation.navigate('WorkOrderDetails', { workOrderId: item.id })} style={styles.orderCard}>
          <Text style={styles.orderTitle}>{item.name}</Text>
          {item.partner_id && <Text style={styles.orderDetail}>Customer: {item.partner_id[1]}</Text>}
          {item.contact_location_id && <Text style={styles.orderDetail}>Location: {item.contact_location_id[1]}</Text>}
          <Text style={styles.orderDetail}>Completed: {format(new Date(item.write_date), 'dd/MM/yyyy')}</Text>
          {item.description && (
            <Text style={styles.orderDetail} numberOfLines={2}>
              Description: {item.description}
            </Text>
          )}
          <View style={styles.statusContainer}>
            <Icon name="check-circle" size={20} color="green" />
            <Text style={styles.statusText}>Completed</Text>
          </View>
        </TouchableOpacity>
      )}
      ListEmptyComponent={() => (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {searchQuery ? 'No matching completed work orders found' : 'No completed work orders for this date'}
          </Text>
        </View>
      )}
    />
  );
};

const WorkOrderCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [workOrders, setWorkOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [markedDates, setMarkedDates] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  const fetchWorkOrders = async (date) => {
    try {
      const Data = await getObjectData("EMPLOYEE_DATA");
      if (!Data?.id) {
        Toast.show('Employee data not found');
        return;
      }
      console.log("EMPLOYEE_DATA", Data?.id);
      
      setLoading(true);
      const Token = await getData("ACCESS_TOKEN");
      if (!Token) {
        Toast.show('No access token found');
        return;
      }

      const response = await fetch(`${BASE_URL}/web/dataset/call_kw`, {
        method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': `X-OpenERP=${Token}`,
                },
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    params: {
                        "model": "maintenance.request",
                        "method": "search_read",
                        "args": [],
                        "kwargs": {
                            "fields": ["name", "priority", "stage_id", "due_date", "employee_ids", "contact_location_id", "partner_id", "description", "write_date"],
                            "domain": [["employee_ids", "in", [Data?.id]]]
                        }
                    },
                }),
      });

      const data = await response.json();
      console.log("Work orders response:", data);
      
      if (data.result) {
        setWorkOrders(data.result);
        // Mark dates with work orders
        const marks = {};
        data.result.forEach(order => {
          if (order.due_date) {
            const date = format(new Date(order.due_date), 'yyyy-MM-dd');
            marks[date] = {
              marked: true,
              dotColor: order.stage_id[1] === 'Done' ? 'green' : '#3e85f7'
            };
          }
        });
        setMarkedDates(marks);
      }
    } catch (error) {
      console.error('Error fetching work orders:', error);
      Toast.show('Error fetching work orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkOrders(selectedDate);
  }, [selectedDate]);

  return (
    <View style={styles.container}>

      <Searchbar
        placeholder="Search work orders..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
        iconColor="#3e85f7"
      />
      
      <View style={styles.tabContainer}>
        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: '#3e85f7',
            tabBarInactiveTintColor: '#666',
            tabBarIndicatorStyle: { backgroundColor: '#3e85f7' },
            tabBarLabelStyle: { fontSize: 14, fontWeight: '600' },
          }}
        >
          <Tab.Screen 
            name="Todo" 
            children={() => <TodoWorkOrders selectedDate={selectedDate} workOrders={workOrders} searchQuery={searchQuery} />}
          />
          <Tab.Screen 
            name="Done" 
            children={() => <DoneWorkOrders selectedDate={selectedDate} workOrders={workOrders} searchQuery={searchQuery} />}
          />
        </Tab.Navigator>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchBar: {
    margin: 8,
    elevation: 2,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  calendar: {
    height: 350,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tabContainer: {
    flex: 1,
  },
  orderCard: {
    backgroundColor: '#fff',
    padding: 16,
    margin: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    elevation: 2,
  },
  doneCard: {
    opacity: 0.8,
  },
  orderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  orderDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  priorityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  priorityText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  statusText: {
    marginLeft: 8,
    fontSize: 14,
    color: 'green',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default WorkOrderCalendar;
