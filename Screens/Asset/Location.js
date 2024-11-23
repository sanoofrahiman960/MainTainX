import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
} from 'react-native';
import {
  Appbar,
  Card,
  Text,
  Searchbar,
  FAB,
  Portal,
  Dialog,
  Button,
  IconButton,
} from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { deleteLocation } from '../../redux/actions/locationAction';

const Location = ({ navigation }) => {
  const dispatch = useDispatch();
  const locations = useSelector(state => state.location.locations);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);

  const filteredLocations = locations.filter(location =>
    location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    location.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = () => {
    if (selectedLocation) {
      dispatch(deleteLocation(selectedLocation.id));
      setDeleteDialogVisible(false);
    }
  };

  const renderItem = ({ item }) => (
    <Card style={styles.card} onPress={() => navigation.navigate('LocationDetails', { location: item })}>
      <Card.Content>
        <View style={styles.headerRow}>
          <Text variant="titleMedium">{item.name}</Text>
          <IconButton
            icon="delete"
            size={20}
            onPress={() => {
              setSelectedLocation(item);
              setDeleteDialogVisible(true);
            }}
          />
        </View>
        
        {item.description && (
          <Text variant="bodyMedium" style={styles.description}>
            {item.description}
          </Text>
        )}

        <View style={styles.detailsContainer}>
          {item.address && (
            <View style={styles.detailRow}>
              <Text variant="bodySmall" style={styles.label}>Address:</Text>
              <Text variant="bodySmall">{item.address}</Text>
            </View>
          )}

          {item.type && (
            <View style={styles.detailRow}>
              <Text variant="bodySmall" style={styles.label}>Type:</Text>
              <Text variant="bodySmall">{item.type}</Text>
            </View>
          )}

          {item.teams && item.teams.length > 0 && (
            <View style={styles.detailRow}>
              <Text variant="bodySmall" style={styles.label}>Teams:</Text>
              <Text variant="bodySmall">{item.teams.length} teams assigned</Text>
            </View>
          )}

          {item.vendors && item.vendors.length > 0 && (
            <View style={styles.detailRow}>
              <Text variant="bodySmall" style={styles.label}>Vendors:</Text>
              <Text variant="bodySmall">{item.vendors.length} vendors assigned</Text>
            </View>
          )}
        </View>

        {item.images && item.images.length > 0 && (
          <Text variant="bodySmall" style={styles.imagesText}>
            {item.images.length} image{item.images.length !== 1 ? 's' : ''} attached
          </Text>
        )}
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Locations" />
        <Appbar.Action icon="sort" onPress={() => {}} />
      </Appbar.Header>

      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search locations..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
      </View>

      <FlatList
        data={filteredLocations}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />

      <Portal>
        <Dialog
          visible={deleteDialogVisible}
          onDismiss={() => setDeleteDialogVisible(false)}
        >
          <Dialog.Title>Delete Location</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Are you sure you want to delete this location?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteDialogVisible(false)}>Cancel</Button>
            <Button onPress={handleDelete}>Delete</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('LocationAdd')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#fff',
  },
  searchBar: {
    elevation: 0,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: -8,
  },
  description: {
    marginTop: 4,
    marginBottom: 8,
  },
  detailsContainer: {
    marginTop: 8,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  label: {
    fontWeight: 'bold',
    marginRight: 8,
    color: '#666',
  },
  imagesText: {
    marginTop: 8,
    color: '#666',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default Location;
