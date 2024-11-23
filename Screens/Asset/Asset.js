import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {
  Text,
  Appbar,
  Card,
  FAB,
  Searchbar,
  IconButton,
  Menu,
  Divider,
  Portal,
  Dialog,
  Button,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { deleteAssets } from '../../redux/actions/locationAction';

const Asset = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const assets = useSelector(state => state.location.assets);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const filteredAssets = assets.filter(asset =>
    asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <Card
      style={styles.card}
      onPress={() => navigation.navigate('AssetDetails', { asset: item })}
    >
      {item.images && item.images.length > 0 && (
        <Card.Cover source={{ uri: item.images[0] }} style={styles.cardImage} />
      )}
      <Card.Content>
        <Text variant="titleMedium">{item.name}</Text>
        {item.description && (
          <Text variant="bodyMedium" numberOfLines={2}>
            {item.description}
          </Text>
        )}
        <View style={styles.cardFooter}>
          {item.qrCode && (
            <View style={styles.tagContainer}>
              <Icon name="qrcode" size={16} color="#666" />
              <Text variant="bodySmall">QR Code</Text>
            </View>
          )}
          {item.files && item.files.length > 0 && (
            <View style={styles.tagContainer}>
              <Icon name="file-multiple" size={16} color="#666" />
              <Text variant="bodySmall">{item.files.length} Files</Text>
            </View>
          )}
        </View>
      </Card.Content>
    </Card>
  );

  const handleDelete = () => {
    if (selectedAsset) {
      dispatch(deleteAssets(selectedAsset.id));
      setDeleteDialogVisible(false);
      setMenuVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Assets" />
        <Appbar.Action icon="sort" onPress={() => {}} />
        <Appbar.Action icon="dots-vertical" onPress={() => {}} />
      </Appbar.Header>

      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search assets"
          onChangeText={handleSearch}
          value={searchQuery}
          style={styles.searchBar}
        />
      </View>

      <FlatList
        data={filteredAssets}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />

      <Portal>
        <Dialog
          visible={deleteDialogVisible}
          onDismiss={() => setDeleteDialogVisible(false)}
        >
          <Dialog.Title>Delete Asset</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Are you sure you want to delete this asset? This action cannot be undone.
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
        onPress={() => navigation.navigate('AddAsset')}
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
    elevation: 2,
  },
  cardImage: {
    height: 150,
  },
  cardFooter: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 16,
  },
  tagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default Asset;
