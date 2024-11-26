import React from 'react';
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

export default function AssignTo() {
  const navigation = useNavigation()
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={()=>navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Assign to</Text>
        <TouchableOpacity onPress={()=>navigation.navigate('WorkOrderAdd')}>
          <Text style={styles.doneButton}>DONE</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Icon name="magnify" size={24} color="#999" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor="#999"
        />
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>People</Text>

        <TouchableOpacity style={styles.personItem}>
          <Image
            source={{ uri: '/placeholder.svg?height=40&width=40' }}
            style={styles.avatar}
          />
          <Text style={styles.personName}>Anand C</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.personItem}>
          <Image
            source={{ uri: '/placeholder.svg?height=40&width=40' }}
            style={styles.avatar}
          />
          <Text style={styles.personName}>Anandsathyan</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={()=>navigation.navigate('InviteScreen')} style={styles.inviteItem}>
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