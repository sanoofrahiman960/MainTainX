import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { Card, Title, Paragraph, Badge, FAB, useTheme, Avatar } from 'react-native-paper';
import { RootState } from '../../redux/store';
import { WorkOrder } from '../../redux/types/workorder';
import { useNavigation } from '@react-navigation/native';

const Home = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const workOrders = useSelector((state: RootState) => state.workorder.workOrders);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return theme.colors.error;
      case 'In Progress':
        return theme.colors.primary;
      case 'Completed':
        return theme.colors.success;
      case 'On Hold':
        return theme.colors.warning;
      default:
        return theme.colors.disabled;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return theme.colors.error;
      case 'Medium':
        return theme.colors.warning;
      case 'Low':
        return theme.colors.success;
      default:
        return theme.colors.disabled;
    }
  };

  const renderWorkOrderCard = ({ item }: { item: WorkOrder }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('WorkOrderDetails', { workOrderId: item.id })}
    >
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.headerRow}>
            <Title>{item.title}</Title>
            <Badge style={[styles.badge, { backgroundColor: getStatusColor(item.status) }]}>
              {item.status}
            </Badge>
          </View>
          <Paragraph numberOfLines={2}>{item.description}</Paragraph>
          <View style={styles.detailsRow}>
            <View style={styles.priorityContainer}>
              <Badge style={[styles.badge, { backgroundColor: getPriorityColor(item.priority) }]}>
                {item.priority}
              </Badge>
            </View>
            <View style={styles.assigneeContainer}>
              {item.assignedTo.map((user, index) => (
                <Avatar.Text
                  key={index}
                  size={24}
                  label={user.substring(0, 2).toUpperCase()}
                  style={styles.avatar}
                />
              ))}
            </View>
            <Paragraph>Due: {new Date(item.dueDate).toLocaleDateString()}</Paragraph>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={workOrders}
        renderItem={renderWorkOrderCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
      <FAB
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        icon="plus"
        onPress={() => navigation.navigate('NewWorkOrder')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  badge: {
    alignSelf: 'center',
  },
  priorityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  assigneeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    marginHorizontal: 2,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default Home;
