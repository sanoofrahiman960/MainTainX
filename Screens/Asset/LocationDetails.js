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

const LocationDetails = ({ route, navigation }) => {
  const location = route.params?.location;

  if (!location) {
    return (
      <View style={styles.container}>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="Location Details" />
        </Appbar.Header>
        <View style={styles.centerContainer}>
          <Text>Location not found</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={location.name || 'Location Details'} />
        <Appbar.Action icon="pencil" onPress={() => {
          navigation.navigate('LocationAdd', { location, isEditing: true });
        }} />
      </Appbar.Header>

      <ScrollView style={styles.content}>
        {/* Images Section */}
        {location.images && location.images.length > 0 && (
          <Card style={styles.section}>
            <Card.Title title="Images" />
            <Card.Content>
              <ScrollView horizontal style={styles.imageContainer}>
                {location.images.map((uri, index) => (
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
              description={location.description || 'No description'}
            />
            <Divider />
            <List.Item
              title="Address"
              description={location.address || 'No address specified'}
            />
            <Divider />
            <List.Item
              title="Type"
              description={location.type || 'Not specified'}
            />
          </Card.Content>
        </Card>

        {/* QR/Barcode */}
        {(location.qrCode || location.barCode) && (
          <Card style={styles.section}>
            <Card.Title title="Identification" />
            <Card.Content>
              {location.qrCode && (
                <>
                  <List.Item
                    title="QR Code"
                    description={location.qrCode}
                  />
                  <Divider />
                </>
              )}
              {location.barCode && (
                <List.Item
                  title="Bar Code"
                  description={location.barCode}
                />
              )}
            </Card.Content>
          </Card>
        )}

        {/* Teams */}
        {location.teams && location.teams.length > 0 && (
          <Card style={styles.section}>
            <Card.Title title="Teams in Charge" />
            <Card.Content>
              {location.teams.map((team, index) => (
                <React.Fragment key={index}>
                  <List.Item
                    title={team.name}
                    description={team.role || 'No role specified'}
                  />
                  {index < location.teams.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </Card.Content>
          </Card>
        )}

        {/* Vendors */}
        {location.vendors && location.vendors.length > 0 && (
          <Card style={styles.section}>
            <Card.Title title="Vendors" />
            <Card.Content>
              {location.vendors.map((vendor, index) => (
                <React.Fragment key={index}>
                  <List.Item
                    title={vendor.name}
                    description={vendor.service || 'No service specified'}
                  />
                  {index < location.vendors.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </Card.Content>
          </Card>
        )}

        {/* Files */}
        {location.files && location.files.length > 0 && (
          <Card style={styles.section}>
            <Card.Title title="Attached Files" />
            <Card.Content>
              {location.files.map((file, index) => (
                <React.Fragment key={index}>
                  <List.Item
                    title={file.name}
                    description={`${((file.size || 0) / (1024 * 1024)).toFixed(2)} MB`}
                    left={props => <List.Icon {...props} icon="file" />}
                  />
                  {index < location.files.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </Card.Content>
          </Card>
        )}

        {/* Parent Location */}
        {location.parentLocation && (
          <Card style={styles.section}>
            <Card.Title title="Parent Location" />
            <Card.Content>
              <List.Item
                title={location.parentLocation.name}
                description={location.parentLocation.type || 'No type specified'}
              />
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

export default LocationDetails;
