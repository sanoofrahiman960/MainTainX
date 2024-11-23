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
} from 'react-native-paper';

const AssetDetail = ({ route, navigation }) => {
  const asset = route.params?.asset;

  if (!asset) {
    return (
      <View style={styles.container}>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="Asset Details" />
        </Appbar.Header>
        <View style={styles.centerContainer}>
          <Text>Asset not found</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={asset.name || 'Asset Details'} />
        <Appbar.Action icon="pencil" onPress={() => {
          // Navigate to edit screen
          navigation.navigate('EditAsset', { asset });
        }} />
      </Appbar.Header>

      <ScrollView style={styles.content}>
        {/* Images Section */}
        {asset.images && asset.images.length > 0 && (
          <Card style={styles.section}>
            <Card.Title title="Images" />
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
          <Card.Title title="Basic Information" />
          <Card.Content>
            <List.Item
              title="Description"
              description={asset.description || 'No description'}
            />
            <Divider />
            <List.Item
              title="Task"
              description={asset.task || 'No task assigned'}
            />
            <Divider />
            <List.Item
              title="Criticality"
              description={asset.criticality || 'Not specified'}
            />
          </Card.Content>
        </Card>

        {/* Details */}
        <Card style={styles.section}>
          <Card.Title title="Details" />
          <Card.Content>
            <List.Item
              title="Location"
              description={asset.location || 'No location set'}
            />
            <Divider />
            <List.Item
              title="Serial Number"
              description={asset.serialNumber || 'Not specified'}
            />
            <Divider />
            <List.Item
              title="Model"
              description={asset.model || 'Not specified'}
            />
            <Divider />
            <List.Item
              title="Manufacturer"
              description={asset.manufacturer || 'Not specified'}
            />
            <Divider />
            <List.Item
              title="Year"
              description={asset.year || 'Not specified'}
            />
            <Divider />
            <List.Item
              title="Asset Type"
              description={asset.assetType || 'Not specified'}
            />
          </Card.Content>
        </Card>

        {/* Files Section */}
        {asset.files && asset.files.length > 0 && (
          <Card style={styles.section}>
            <Card.Title title="Attached Files" />
            <Card.Content>
              {asset.files.map((file, index) => (
                <React.Fragment key={index}>
                  <List.Item
                    title={file.name}
                    description={`${((file.size || 0) / (1024 * 1024)).toFixed(2)} MB`}
                    left={props => <List.Icon {...props} icon="file" />}
                  />
                  {index < asset.files.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </Card.Content>
          </Card>
        )}

        {/* Teams and Vendors */}
        <Card style={styles.section}>
          <Card.Title title="Teams & Vendors" />
          <Card.Content>
            <List.Item
              title="Teams"
              description={asset.team?.length > 0 ? `${asset.team.length} teams assigned` : 'No teams assigned'}
            />
            <Divider />
            <List.Item
              title="Vendors"
              description={asset.vendors?.length > 0 ? `${asset.vendors.length} vendors assigned` : 'No vendors assigned'}
            />
          </Card.Content>
        </Card>

        {/* Parts */}
        {asset.parts && asset.parts.length > 0 && (
          <Card style={styles.section}>
            <Card.Title title="Parts" />
            <Card.Content>
              {asset.parts.map((part, index) => (
                <React.Fragment key={index}>
                  <List.Item
                    title={part.name}
                    description={`Category: ${part.category}`}
                    right={props => <Text {...props}>{`Qty: ${part.quantity || 0}`}</Text>}
                  />
                  {index < asset.parts.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </Card.Content>
          </Card>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
});

export default AssetDetail;
