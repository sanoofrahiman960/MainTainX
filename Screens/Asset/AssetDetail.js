import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Image,
} from 'react-native';
import {
  Text,
  Appbar,
  List,
  Divider,
  Card,
  IconButton,
  useTheme,
  Button,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const AssetDetail = ({ route, navigation }) => {
  const theme = useTheme();
  const asset = route.params?.asset;

  if (!asset) {
    return (
      <View style={styles.container}>
        <Appbar.Header style={styles.header}>
          <Appbar.BackAction color="#fff" onPress={() => navigation.goBack()} />
          <Appbar.Content color="#fff" title="Asset Not Found" />
        </Appbar.Header>
        <View style={styles.centerContainer}>
          <Text>Asset details not available</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction color="#fff" onPress={() => navigation.goBack()} />
        <Appbar.Content color="#fff" title={asset.name || 'Asset Details'} />
        <Appbar.Action 
          icon="pencil" 
          color="#fff"
          onPress={() => navigation.navigate('EditAsset', { asset })} 
        />
        <Appbar.Action 
          icon="plus-circle-outline" 
          color="#fff"
          onPress={() => navigation.navigate('NewWorkOrder', { 
            asset: asset,
            prefilledData: {
              asset: asset.name,
              location: asset.location
            }
          })} 
        />
      </Appbar.Header>

      <ScrollView style={styles.content}>
        {/* Status Card */}
        <Card style={styles.section}>
          <Card.Content style={styles.statusContainer}>
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Status</Text>
              <View style={[styles.statusBadge, { backgroundColor: asset.status === 'Active' ? '#4CAF50' : '#FF9800' }]}>
                <Text style={styles.statusText}>{asset.status || 'Unknown'}</Text>
              </View>
            </View>
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Criticality</Text>
              <View style={[styles.statusBadge, { 
                backgroundColor: asset.criticality?.toLowerCase() === 'high' ? '#FF4444' : 
                  asset.criticality?.toLowerCase() === 'medium' ? '#FFBB33' : '#4CAF50' 
              }]}>
                <Text style={styles.statusText}>{asset.criticality || 'Not Set'}</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Images Section */}
        {asset.images && asset.images.length > 0 && (
          <Card style={styles.section}>
            <Card.Title 
              title="Images" 
              titleStyle={styles.cardTitle}
              right={(props) => (
                <IconButton
                  {...props}
                  icon="camera-plus"
                  iconColor="#42b0f5"
                  onPress={() => {}}
                />
              )}
            />
            <Card.Content>
              <ScrollView horizontal style={styles.imageContainer}>
                {asset.images.map((uri, index) => (
                  <Image
                    key={index}
                    source={{ uri }}
                    style={styles.image}
                  />
                ))}
              </ScrollView>
            </Card.Content>
          </Card>
        )}

        {/* Basic Information */}
        <Card style={styles.section}>
          <Card.Title title="Basic Information" titleStyle={styles.cardTitle} />
          <Card.Content>
            <List.Item
              title="Description"
              description={asset.description || 'No description'}
              titleStyle={styles.listTitle}
              descriptionStyle={styles.listDescription}
              left={props => <Icon {...props} name="information" size={24} color="#42b0f5" />}
            />
            <Divider style={styles.divider} />
            <List.Item
              title="Task"
              description={asset.task || 'No task assigned'}
              titleStyle={styles.listTitle}
              descriptionStyle={styles.listDescription}
              left={props => <Icon {...props} name="clipboard-text" size={24} color="#42b0f5" />}
            />
            <Divider style={styles.divider} />
            <List.Item
              title="Criticality"
              description={asset.criticality || 'Not specified'}
              titleStyle={styles.listTitle}
              descriptionStyle={styles.listDescription}
              left={props => <Icon {...props} name="alert-circle" size={24} color="#42b0f5" />}
            />
          </Card.Content>
        </Card>

        {/* Details */}
        <Card style={styles.section}>
          <Card.Title title="Details" titleStyle={styles.cardTitle} />
          <Card.Content>
            <List.Item
              title="Location"
              description={asset.location || 'No location set'}
              titleStyle={styles.listTitle}
              descriptionStyle={styles.listDescription}
              left={props => <Icon {...props} name="map-marker" size={24} color="#42b0f5" />}
            />
            <Divider style={styles.divider} />
            <List.Item
              title="Serial Number"
              description={asset.serialNumber || 'Not specified'}
              titleStyle={styles.listTitle}
              descriptionStyle={styles.listDescription}
              left={props => <Icon {...props} name="barcode" size={24} color="#42b0f5" />}
            />
            <Divider style={styles.divider} />
            <List.Item
              title="Model"
              description={asset.model || 'Not specified'}
              titleStyle={styles.listTitle}
              descriptionStyle={styles.listDescription}
              left={props => <Icon {...props} name="codepen" size={24} color="#42b0f5" />}
            />
          </Card.Content>
        </Card>

        {/* Teams and Vendors */}
        <Card style={[styles.section, styles.lastSection]}>
          <Card.Title title="Teams & Vendors" titleStyle={styles.cardTitle} />
          <Card.Content>
            <List.Item
              title="Teams"
              description={asset.team?.length > 0 ? `${asset.team.length} teams assigned` : 'No teams assigned'}
              titleStyle={styles.listTitle}
              descriptionStyle={styles.listDescription}
              left={props => <Icon {...props} name="account-group" size={24} color="#42b0f5" />}
              onPress={() => navigation.navigate('TeamsList', { assetId: asset.id })}
            />
            <Divider style={styles.divider} />
            <List.Item
              title="Vendors"
              description={asset.vendors?.length > 0 ? `${asset.vendors.length} vendors assigned` : 'No vendors assigned'}
              titleStyle={styles.listTitle}
              descriptionStyle={styles.listDescription}
              left={props => <Icon {...props} name="domain" size={24} color="#42b0f5" />}
              onPress={() => navigation.navigate('VendorsList', { assetId: asset.id })}
            />
          </Card.Content>
        </Card>
      </ScrollView>

      <Button
        mode="contained"
        icon="plus-circle"
        onPress={() => navigation.navigate('NewWorkOrder', { 
          asset: asset,
          prefilledData: {
            asset: asset.name,
            location: asset.location
          }
        })}
        style={styles.fab}
        labelStyle={styles.fabLabel}
      >
        Create Work Order
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#42b0f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 16,
    borderRadius: 8,
    elevation: 2,
  },
  lastSection: {
    marginBottom: 80,
  },
  cardTitle: {
    color: '#42b0f5',
    fontSize: 18,
    fontWeight: '600',
  },
  listTitle: {
    fontSize: 16,
    color: '#333',
  },
  listDescription: {
    fontSize: 14,
    color: '#666',
  },
  divider: {
    backgroundColor: '#e0e0e0',
    height: 1,
  },
  imageContainer: {
    flexDirection: 'row',
    marginVertical: 8,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginRight: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 16,
  },
  statusItem: {
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 14,
    marginBottom: 8,
    color: '#666',
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    left: 16,
    backgroundColor: '#42b0f5',
    borderRadius: 8,
  },
  fabLabel: {
    fontSize: 16,
    color: '#fff',
  },
});

export default AssetDetail;
