import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock data for users
const users = [
  { id: '1', name: 'Anand C', avatar: '/placeholder.svg?height=40&width=40' },
  { id: '2', name: 'Anandsathyan', avatar: '/placeholder.svg?height=40&width=40' },
  { id: '3', name: 'John Doe', avatar: '/placeholder.svg?height=40&width=40' },
  { id: '4', name: 'Jane Smith', avatar: '/placeholder.svg?height=40&width=40' },
  { id: '5', name: 'Mike Johnson', avatar: '/placeholder.svg?height=40&width=40' },
];

export default function AssignTo() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUserSelect = async (user) => {
    setSelectedUser(user);
    try {
      await AsyncStorage.setItem('selectedUserId', user.id);
      await AsyncStorage.setItem('selectedUserName', user.name);
    } catch (error) {
      console.error('Error saving selected user:', error);
    }
  };

  const handleDone = () => {
    navigation.navigate('WorkOrderAdd', { selectedUser });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Assign to</Text>
        <TouchableOpacity onPress={handleDone}>
          <Text style={styles.doneButton}>DONE</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Icon name="magnify" size={24} color="#999" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>People</Text>

        {filteredUsers.map(user => (
          <TouchableOpacity
            key={user.id}
            style={[
              styles.personItem,
              selectedUser?.id === user.id && styles.selectedPersonItem
            ]}
            onPress={() => handleUserSelect(user)}
          >
            <Image
              source={{ uri: user.avatar }}
              style={styles.avatar}
            />
            <Text style={styles.personName}>{user.name}</Text>
            {selectedUser?.id === user.id && (
              <Icon name="check" size={24} color="#2196F3" style={styles.checkIcon} />
            )}
          </TouchableOpacity>
        ))}

        <TouchableOpacity onPress={() => navigation.navigate('InviteScreen')} style={styles.inviteItem}>
          <Icon name="account-plus" size={24} color="#2196F3" />
          <Text style={styles.inviteText}>
            Invite Members
          </Text>
        </TouchableOpacity>
      </ScrollView>
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
  doneButton: {
    color: '#fff',
    fontSize: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    margin: 16,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  personItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  selectedPersonItem: {
    backgroundColor: '#e3f2fd',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: '#2196F3',
  },
  personName: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  checkIcon: {
    marginLeft: 'auto',
  },
  inviteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  inviteText: {
    fontSize: 16,
    color: '#2196F3',
    marginLeft: 12,
  },
});
