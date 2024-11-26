import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Provider as PaperProvider, Appbar, TextInput, Button, List, Checkbox } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { addContact } from '../../../redux/contactSlice';
// import { RootState } from '../redux/store';

export default function ManualInviteScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const dispatch = useDispatch();
  const contacts = useSelector((state: any) => state.contacts.contacts);

  const handleAddContact = () => {
    if (!name || !contact) {
      Alert.alert('Error', 'Please enter both name and email/phone number');
      return;
    }

    const newContact = {
      id: Date.now().toString(),
      name,
      email: contact.includes('@') ? contact : '',
      phone: !contact.includes('@') ? contact : '',
    };

    dispatch(addContact(newContact));
    setName('');
    setContact('');
  };

  const handleDone = () => {
    dispatch(setSelectedContacts(selectedContacts));
    navigation.navigate('InviteScreen');
  };

  const toggleContactSelection = (contactId: string) => {
    setSelectedContacts(prev => 
      prev.includes(contactId)
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };

  const renderContact = ({ item }: { item: Contact }) => (
    <List.Item
      title={item.name}
      description={item.email || item.phone}
      left={() => (
        <Checkbox
          status={selectedContacts.includes(item.id) ? 'checked' : 'unchecked'}
          onPress={() => toggleContactSelection(item.id)}
        />
      )}
    />
  );

  return (
    <PaperProvider>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction color="white" onPress={() => navigation.goBack()} />
        <Appbar.Content title="Add Contacts" titleStyle={styles.headerTitle} />
        <Appbar.Action icon="check" color="white" onPress={handleDone} />
      </Appbar.Header>

      <View style={styles.container}>
        <TextInput
          label="Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
        <TextInput
          label="Email or Phone Number"
          value={contact}
          onChangeText={setContact}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Button
          mode="outlined"
          onPress={handleAddContact}
          style={styles.addButton}
        >
          Add Contact
        </Button>

        <FlatList
          data={contacts}
          renderItem={renderContact}
          keyExtractor={item => item.id}
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
    padding: 16,
    backgroundColor: '#fff',
  },
  input: {
    marginBottom: 16,
  },
  addButton: {
    marginBottom: 16,
  },
  contactsList: {
    flex: 1,
    marginBottom: 16,
  },
  inviteButton: {
    backgroundColor: '#2196F3',
  },
});

