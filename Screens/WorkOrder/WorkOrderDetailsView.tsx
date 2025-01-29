import React from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Surface, Title, List, Text, Divider, IconButton } from 'react-native-paper';
import { getData } from '../../Util/Storage';
import { BASE_URL } from '../../Util/Const';

const WorkOrderDetailsView = ({ route, navigation }) => {
  const { type, data, total } = route.params;

  const handleDelete = async (id) => {
    let model = '';
    let successMessage = '';
    let refreshFunction = '';

    switch (type) {
      case 'parts':
        model = 'leap.maintenance.part';
        successMessage = 'Part deleted successfully';
        refreshFunction = 'MainTainancePart';
        break;
      case 'timesheet':
        model = 'account.analytic.line';
        successMessage = 'Time entry deleted successfully';
        refreshFunction = 'TimeSheet';
        break;
      case 'expenses':
        model = 'hr.expense';
        successMessage = 'Expense deleted successfully';
        refreshFunction = 'Expense';
        break;
    }

    Alert.alert(
      `Delete ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      'Are you sure you want to delete this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const Token = await getData('ACCESS_TOKEN');
              const response = await fetch(`${BASE_URL}/web/dataset/call_kw`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Cookie': `X-OpenERP=${Token}`,
                },
                body: JSON.stringify({
                  jsonrpc: '2.0',
                  params: {
                    model: model,
                    method: 'unlink',
                    args: [[id]],
                    kwargs: {}
                  }
                })
              });
              const result = await response.json();
              if (result.result) {
                Alert.alert('Success', successMessage);
                navigation.goBack();
              }
            } catch (error) {
              console.error('Error deleting item:', error);
              Alert.alert('Error', 'Failed to delete item');
            }
          }
        }
      ]
    );
  };

  const renderItem = (item) => {
    switch (type) {
      case 'parts':
        return (
          <List.Item
            key={item.id}
            title={item.product_id[1]}
            description={`Estimated: ${item.qty_estimated}, Used: ${item.qty_used}`}
            left={(props) => <List.Icon {...props} icon="cog" />}
            right={(props) => (
              <IconButton
                {...props}
                icon="delete"
                iconColor="#FF0000"
                onPress={() => handleDelete(item.id)}
              />
            )}
          />
        );
      case 'timesheet':
        return (
          <List.Item
            key={item.id}
            title={item.employee_id[1]}
            description={`${item.unit_amount.toFixed(2)} hrs - ${new Date(item.date).toLocaleDateString()}`}
            left={(props) => <List.Icon {...props} icon="clock" />}
            right={(props) => (
              <IconButton
                {...props}
                icon="delete"
                iconColor="#FF0000"
                onPress={() => handleDelete(item.id)}
              />
            )}
          />
        );
      case 'expenses':
        return (
          <List.Item
            key={item.id}
            title={item.name}
            description={`$${item.total_amount_currency}`}
            left={(props) => <List.Icon {...props} icon="currency-usd" />}
            right={(props) => (
              <IconButton
                {...props}
                icon="delete"
                iconColor="#FF0000"
                onPress={() => handleDelete(item.id)}
              />
            )}
          />
        );
      default:
        return null;
    }
  };

  const renderContent = () => {
    switch (type) {
      case 'timesheet':
        return (
          <>
            {data.map((entry: any, index: number) => (
              renderItem(entry)
            ))}
            <Divider style={{ marginVertical: 8 }} />
            <List.Item
              title="Total Work Hours"
              titleStyle={{ fontWeight: 'bold', color: '#000' }}
              right={(props) => (
                <Text {...props} style={{ fontWeight: 'bold', color: '#007AFF', fontSize: 16 }}>
                  {total.toFixed(2)} hours
                </Text>
              )}
            />
          </>
        );

      case 'parts':
        return (
          <>
            {data.map((part: any, index: number) => (
              renderItem(part)
            ))}
            <Divider style={{ marginVertical: 8 }} />
            <List.Item
              title="Total Quantity"
              titleStyle={{ fontWeight: 'bold', color: '#000' }}
              right={(props) => (
                <Text {...props} style={{ fontWeight: 'bold', color: '#007AFF', fontSize: 16 }}>
                  {total}
                </Text>
              )}
            />
          </>
        );

      case 'expenses':
        return (
          <>
            {data.map((expense: any, index: number) => (
              renderItem(expense)
            ))}
            <Divider style={{ marginVertical: 8 }} />
            <List.Item
              title="Total Cost"
              titleStyle={{ fontWeight: 'bold', color: '#000' }}
              right={(props) => (
                <Text {...props} style={{ fontWeight: 'bold', color: '#007AFF', fontSize: 16 }}>
                  {total.toFixed(2)} $
                </Text>
              )}
            />
          </>
        );

      default:
        return null;
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'parts':
        return `Parts (${data.length})`;
      case 'timesheet':
        return `Time Entries (${total.toFixed(2)} hrs)`;
      case 'expenses':
        return `Expenses ($${total.toFixed(2)})`;
      default:
        return '';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.surface}>
        <Title style={styles.title}>
          {getTitle()}
        </Title>
        {renderContent()}
      </Surface>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  surface: {
    padding: 16,
    margin: 16,
    elevation: 4,
    borderRadius: 8,
  },
  title: {
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
});

export default WorkOrderDetailsView;
