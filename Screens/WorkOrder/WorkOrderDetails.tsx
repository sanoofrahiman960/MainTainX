import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import {
  Card,
  Title,
  Paragraph,
  Badge,
  Button,
  Avatar,
  List,
  Divider,
  Portal,
  Dialog,
  TextInput,
  useTheme,
  IconButton,
} from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RootState } from '../../redux/store';
import { updateWorkOrder } from '../../redux/actions/workorderActions';
import { WorkOrder, Worker } from '../../redux/types/workorder';
import * as ImagePicker from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';

const WorkOrderDetails = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const { workOrderId } = route.params;

  const workOrder = useSelector((state: RootState) =>
    state.workorder.workOrders.find((wo) => wo.id === workOrderId)
  );

  const [commentText, setCommentText] = useState('');
  const [showCommentDialog, setShowCommentDialog] = useState(false);

  if (!workOrder) {
    return (
      <View style={styles.container}>
        <Title>Work Order not found</Title>
      </View>
    );
  }

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

  const handleAddComment = () => {
    if (!commentText.trim()) return;

    const newComment = {
      id: Date.now().toString(),
      text: commentText,
      worker: {
        id: '1', // Replace with actual logged-in worker ID
        name: 'John Doe', // Replace with actual logged-in worker name
        role: 'Technician',
        email: 'john@example.com',
      },
      timestamp: new Date().toISOString(),
    };

    const updatedWorkOrder = {
      ...workOrder,
      comments: [...(workOrder.comments || []), newComment],
    };

    dispatch(updateWorkOrder(updatedWorkOrder));
    setCommentText('');
    setShowCommentDialog(false);
  };

  const handleAddAttachment = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });

      const newAttachment = {
        name: result[0].name,
        uri: result[0].uri,
        type: result[0].type || 'application/octet-stream',
        size: result[0].size || 0,
      };

      const updatedWorkOrder = {
        ...workOrder,
        attachments: [...(workOrder.attachments || []), newAttachment],
      };

      dispatch(updateWorkOrder(updatedWorkOrder));
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        console.error('Error picking document:', err);
      }
    }
  };

  const renderWorkerAvatar = (worker: Worker) => (
    <TouchableOpacity
      key={worker.id}
      style={styles.workerContainer}
      onPress={() => {/* Navigate to worker profile */}}
    >
      <Avatar.Text
        size={40}
        label={worker.name.substring(0, 2).toUpperCase()}
        style={styles.avatar}
      />
      <Paragraph style={styles.workerName}>{worker.name}</Paragraph>
      <Paragraph style={styles.workerRole}>{worker.role}</Paragraph>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView>
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.header}>
              <Title>{workOrder.title}</Title>
              <Badge style={[styles.badge, { backgroundColor: getStatusColor(workOrder.status) }]}>
                {workOrder.status}
              </Badge>
            </View>
            <Paragraph style={styles.description}>{workOrder.description}</Paragraph>

            <Title style={styles.sectionTitle}>Assigned Workers</Title>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.workersContainer}>
                {workOrder.assignedWorkers.map(renderWorkerAvatar)}
              </View>
            </ScrollView>

            <Title style={styles.sectionTitle}>Details</Title>
            <List.Item
              title="Priority"
              right={() => <Badge style={styles.priorityBadge}>{workOrder.priority}</Badge>}
            />
            <List.Item
              title="Due Date"
              right={() => <Paragraph>{new Date(workOrder.dueDate).toLocaleDateString()}</Paragraph>}
            />
            {workOrder.estimatedHours && (
              <List.Item
                title="Estimated Hours"
                right={() => <Paragraph>{workOrder.estimatedHours} hours</Paragraph>}
              />
            )}
            {workOrder.actualHours && (
              <List.Item
                title="Actual Hours"
                right={() => <Paragraph>{workOrder.actualHours} hours</Paragraph>}
              />
            )}

            {workOrder.materials && workOrder.materials.length > 0 && (
              <>
                <Title style={styles.sectionTitle}>Materials</Title>
                {workOrder.materials.map((material) => (
                  <List.Item
                    key={material.id}
                    title={material.name}
                    description={`${material.quantity} ${material.unit}`}
                    right={() => material.cost && <Paragraph>${material.cost}</Paragraph>}
                  />
                ))}
              </>
            )}

            {workOrder.attachments && workOrder.attachments.length > 0 && (
              <>
                <Title style={styles.sectionTitle}>Attachments</Title>
                {workOrder.attachments.map((attachment, index) => (
                  <List.Item
                    key={index}
                    title={attachment.name}
                    description={`${(attachment.size / 1024 / 1024).toFixed(2)} MB`}
                    left={(props) => <List.Icon {...props} icon="file" />}
                    onPress={() => {/* Open attachment */}}
                  />
                ))}
              </>
            )}

            <Title style={styles.sectionTitle}>Comments</Title>
            {workOrder.comments && workOrder.comments.map((comment) => (
              <Card key={comment.id} style={styles.commentCard}>
                <Card.Content>
                  <View style={styles.commentHeader}>
                    <Avatar.Text
                      size={24}
                      label={comment.worker.name.substring(0, 2).toUpperCase()}
                    />
                    <View style={styles.commentInfo}>
                      <Paragraph style={styles.commentUser}>{comment.worker.name}</Paragraph>
                      <Paragraph style={styles.commentTime}>
                        {new Date(comment.timestamp).toLocaleString()}
                      </Paragraph>
                    </View>
                  </View>
                  <Paragraph style={styles.commentText}>{comment.text}</Paragraph>
                </Card.Content>
              </Card>
            ))}
          </Card.Content>
        </Card>
      </ScrollView>

      <View style={styles.actionButtons}>
        <Button
          mode="contained"
          onPress={() => setShowCommentDialog(true)}
          style={styles.actionButton}
        >
          Add Comment
        </Button>
        <Button
          mode="contained"
          onPress={handleAddAttachment}
          style={styles.actionButton}
        >
          Add Attachment
        </Button>
      </View>

      <Portal>
        <Dialog visible={showCommentDialog} onDismiss={() => setShowCommentDialog(false)}>
          <Dialog.Title>Add Comment</Dialog.Title>
          <Dialog.Content>
            <TextInput
              value={commentText}
              onChangeText={setCommentText}
              multiline
              numberOfLines={4}
              mode="outlined"
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowCommentDialog(false)}>Cancel</Button>
            <Button onPress={handleAddComment}>Add</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    margin: 16,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  badge: {
    alignSelf: 'center',
  },
  description: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    marginTop: 16,
    marginBottom: 8,
  },
  workersContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  workerContainer: {
    alignItems: 'center',
    marginRight: 16,
  },
  avatar: {
    marginBottom: 4,
  },
  workerName: {
    fontSize: 12,
    textAlign: 'center',
  },
  workerRole: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
  },
  priorityBadge: {
    alignSelf: 'center',
  },
  commentCard: {
    marginVertical: 8,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  commentInfo: {
    marginLeft: 8,
  },
  commentUser: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  commentTime: {
    fontSize: 12,
    color: '#666',
  },
  commentText: {
    marginLeft: 32,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: 'white',
    elevation: 4,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 8,
  },
});

export default WorkOrderDetails;
