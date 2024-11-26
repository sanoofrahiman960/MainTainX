import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Platform, Linking, Alert } from 'react-native';
import { Provider as PaperProvider, Appbar, Searchbar, List, Avatar, Button, Text } from 'react-native-paper';
import { Share } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
interface Contact {
  recordID: string;
  displayName: string;
  phoneNumbers: Array<{
    label: string;
    number: string;
  }>;
  thumbnailPath?: string;
}

const sampleContacts: Contact[] = [
  {
    recordID: '1',
    displayName: 'John Doe',
    phoneNumbers: [{ label: 'mobile', number: '+1234567890' }],
  },
  {
    recordID: '2',
    displayName: 'Jane Smith',
    phoneNumbers: [{ label: 'mobile', number: '+9876543210' }],
  },
  {
    recordID: '3',
    displayName: 'Alice Johnson',
    phoneNumbers: [{ label: 'mobile', number: '+1122334455' }],
  },
  {
    recordID: '4',
    displayName: 'Bob Williams',
    phoneNumbers: [{ label: 'mobile', number: '+5544332211' }],
  },
  {
    recordID: '5',
    displayName: 'Charlie Brown',
    phoneNumbers: [{ label: 'mobile', number: '+6677889900' }],
  },
];

export default function InviteScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>(sampleContacts);
const navigation = useNavigation()
  useEffect(() => {
    if (searchQuery) {
      const filtered = sampleContacts.filter(contact => 
        contact.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.phoneNumbers.some(phone => 
          phone.number.includes(searchQuery)
        )
      );
      setFilteredContacts(filtered);
    } else {
      setFilteredContacts(sampleContacts);
    }
  }, [searchQuery]);

  const handleInviteViaLink = async () => {
    try {
      await Share.share({
        message: 'Join me on our app! Download here: https://example.com/app',
      });
    } catch (error) {
      console.error('Failed to share invitation link', error);
      Alert.alert('Error', 'Failed to share invitation link');
    }
  };

  const handleInviteWithEmailOrPhone = () => {
    navigation.navigate('ManualInvite');
  };

  const handleContactPress = async (contact: Contact) => {
    const phoneNumber = contact.phoneNumbers[0]?.number;
    if (phoneNumber) {
      try {
        const message = 'Join me on our app! Download here: https://example.com/app';
        await Linking.openURL(`sms:${phoneNumber}?body=${encodeURIComponent(message)}`);
      } catch (error) {
        console.error('Could not open messaging app', error);
        Alert.alert('Error', 'Could not open messaging app');
      }
    }
  };

  const renderContact = ({ item }: { item: Contact }) => (
    <List.Item
      title={item.displayName || item.phoneNumbers[0]?.number}
      description={item.phoneNumbers[0]?.number}
      left={(props: any) => (
        <Avatar.Icon
          {...props}
          size={40}
          icon="account"
          style={styles.contactAvatar}
        />
      )}
      onPress={() => handleContactPress(item)}
      style={styles.contactItem}
    />
  );

  return (
    <PaperProvider>
      <Appbar.Header style={styles.header}>
        <Appbar.Action icon="close" color="white" onPress={() => navigation.goBack()} />
        <Appbar.Content title="Invite" titleStyle={styles.headerTitle} />
        <Appbar.Action 
          icon="check" 
          color="white" 
          onPress={() => navigation.goBack()} 
        />
      </Appbar.Header>

      <View style={styles.container}>
        <Searchbar
          placeholder="Search"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />

        <List.Item
          title="Invite via Link"
          left={(props: any) => <List.Icon {...props} icon={() => <Icon name="link-variant" color="#2196F3" size={24} />} />}
          onPress={handleInviteViaLink}
          style={styles.listItem}
        />

        <List.Item
          title="Invite with Email or Phone"
          left={(props: any) => <List.Icon {...props} icon="plus" color="#2196F3" />}
          onPress={handleInviteWithEmailOrPhone}
          style={styles.listItem}
        />

        <Text style={styles.sectionTitle}>CONTACTS</Text>

        <FlatList
          data={filteredContacts}
          renderItem={renderContact}
          keyExtractor={item => item.recordID}
          style={styles.contactsList}
        />
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#2196F3',
  },
  headerTitle: {
    color: 'white',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchBar: {
    margin: 16,
    backgroundColor: '#f5f5f5',
  },
  listItem: {
    paddingVertical: 8,
  },
  sectionTitle: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    color: '#666',
    backgroundColor: '#f5f5f5',
  },
  contactsList: {
    flex: 1,
  },
  contactItem: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
  contactAvatar: {
    backgroundColor: '#e0e0e0',
  },
});





