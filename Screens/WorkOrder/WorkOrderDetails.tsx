import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Alert, Image, Text } from 'react-native';
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
  Menu,
  SegmentedButtons,
} from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RootState } from '../../redux/store';
import { updateWorkOrder } from '../../redux/slices/workOrderSlice';
import { WorkOrder } from '../../redux/types/workorder';
import * as ImagePicker from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const WorkOrderDetails = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const { workOrderId } = route.params;

  // Updated selector to match our new store structure
  const workOrder = useSelector((state: RootState) =>
    state.workOrder.workOrders.find((wo) => wo.id === workOrderId)
  );

  const [commentText, setCommentText] = useState('');
  const [showCommentDialog, setShowCommentDialog] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(workOrder?.status || 'Open');
  const [showImageOptions, setShowImageOptions] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState(null);

  if (!workOrder) {
    return (
      <View style={styles.container}>
        <Title>Work Order not found</Title>
      </View>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return theme.colors.primary; // Blue
      case 'in progress':
        return '#FFA000'; // Yellow/Orange
      case 'on hold':
        return theme.colors.error; // Red
      case 'completed':
        return '#4CAF50'; // Specific green color
      default:
        return theme.colors.disabled;
    }
  };

  const getPriorityText = (priorityIndex: number) => {
    switch (priorityIndex) {
      case 0:
        return 'None';
      case 1:
        return 'Low';
      case 2:
        return 'Medium';
      case 3:
        return 'High';
      default:
        return 'None';
    }
  };

  const getPriorityColor = (priorityIndex: number) => {
    switch (priorityIndex) {
      case 0:
        return '#757575'; // Grey
      case 1:
        return '#42A5F5'; // Light Blue
      case 2:
        return '#FFA000'; // Orange
      case 3:
        return '#F44336'; // Red
      default:
        return '#757575';
    }
  };

  const handleStatusChange = (newStatus: string) => {
    setSelectedStatus(newStatus);
    const updatedWorkOrder = {
      ...workOrder,
      status: newStatus,
      updatedAt: new Date().toISOString(),
    };
    dispatch(updateWorkOrder(updatedWorkOrder));
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
      },
      timestamp: new Date().toISOString(),
    };

    const updatedWorkOrder = {
      ...workOrder,
      comments: [...(workOrder.comments || []), newComment],
      updatedAt: new Date().toISOString(),
    };

    dispatch(updateWorkOrder(updatedWorkOrder));
    setCommentText('');
    setShowCommentDialog(false);
  };

  const handleEditPress = () => {
    navigation.navigate('EditWorkOrder', { workOrderId: workOrder.id });
  };

  const handleAddAttachment = async () => {
    try {
      const result = await ImagePicker.launchImageLibrary({
        mediaType: 'photo',
        quality: 1,
        selectionLimit: 1,
      });

      if (result.didCancel) return;

      if (result.assets && result.assets[0]) {
        const asset = result.assets[0];
        const newAttachment = {
          name: asset.fileName || 'image.jpg',
          uri: asset.uri,
          type: asset.type || 'image/jpeg',
          size: asset.fileSize || 0,
          width: asset.width,
          height: asset.height,
        };

        const updatedWorkOrder = {
          ...workOrder,
          attachments: [...(workOrder.attachments || []), newAttachment],
          updatedAt: new Date().toISOString(),
        };

        dispatch(updateWorkOrder(updatedWorkOrder));
      }
    } catch (err) {
      console.error('Error picking image:', err);
      Alert.alert('Error', 'Failed to add image');
    }
  };

  const handleEditImage = async (attachment) => {
    try {
      const result = await ImagePicker.launchImageLibrary({
        mediaType: 'photo',
        quality: 1,
        selectionLimit: 1,
      });

      if (result.didCancel) return;

      if (result.assets && result.assets[0]) {
        const asset = result.assets[0];
        const updatedAttachment = {
          ...attachment,
          uri: asset.uri,
          type: asset.type || 'image/jpeg',
          size: asset.fileSize || 0,
          width: asset.width,
          height: asset.height,
        };

        const updatedWorkOrder = {
          ...workOrder,
          attachments: workOrder.attachments.map(att => 
            att.uri === attachment.uri ? updatedAttachment : att
          ),
          updatedAt: new Date().toISOString(),
        };

        dispatch(updateWorkOrder(updatedWorkOrder));
      }
    } catch (err) {
      console.error('Error editing image:', err);
      Alert.alert('Error', 'Failed to edit image');
    }
  };

  const handleDeleteAttachment = (attachment) => {
    Alert.alert(
      'Delete Attachment',
      'Are you sure you want to delete this attachment?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedWorkOrder = {
              ...workOrder,
              attachments: workOrder.attachments.filter(att => att.uri !== attachment.uri),
              updatedAt: new Date().toISOString(),
            };
            dispatch(updateWorkOrder(updatedWorkOrder));
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.header}>
              <IconButton icon="arrow-left" onPress={() => navigation.goBack()} />
              <View style={styles.headerActions}>
                <IconButton icon="pencil" onPress={handleEditPress} />
                <IconButton icon="delete" onPress={() => console.log('Delete button pressed')} />
              </View>
              <View style={styles.titleContainer}>
                <Title>{workOrder.task}</Title>
              </View>
            </View>
            
            <View style={styles.statusContainer}>
              <Title style={styles.sectionTitle}>Status</Title>
              <SegmentedButtons
                value={selectedStatus}
                onValueChange={handleStatusChange}
                style={styles.segmentedButtons}
                buttons={[
                  {
                    value: 'Open',
                    label: 'Open',
                    style: [
                      styles.statusButton,
                      selectedStatus === 'Open' && { backgroundColor: theme.colors.primary }
                    ],
                    labelStyle: [
                      styles.statusLabel,
                      selectedStatus === 'Open' && { color: 'white', fontWeight: 'bold' }
                    ],
                    showSelectedCheck: false
                  },
                  {
                    value: 'In Progress',
                    label: 'In Progress',
                    style: [
                      styles.statusButton,
                      selectedStatus === 'In Progress' && { backgroundColor: '#FFA000' }
                    ],
                    labelStyle: [
                      styles.statusLabel,
                      selectedStatus === 'In Progress' && { color: 'white', fontWeight: 'bold' }
                    ],
                    showSelectedCheck: false
                  },
                  {
                    value: 'On Hold',
                    label: 'On Hold',
                    style: [
                      styles.statusButton,
                      selectedStatus === 'On Hold' && { backgroundColor: theme.colors.error }
                    ],
                    labelStyle: [
                      styles.statusLabel,
                      selectedStatus === 'On Hold' && { color: 'white', fontWeight: 'bold' }
                    ],
                    showSelectedCheck: false
                  },
                  {
                    value: 'Completed',
                    label: 'Completed',
                    style: [
                      styles.statusButton,
                      selectedStatus === 'Completed' && { backgroundColor: '#4CAF50' }
                    ],
                    labelStyle: [
                      styles.statusLabel,
                      selectedStatus === 'Completed' && { color: 'white', fontWeight: 'bold' }
                    ],
                    showSelectedCheck: false
                  }
                ]}
              />
            </View>
            
            <Paragraph style={styles.description}>{workOrder.description}</Paragraph>

            <List.Section>
              <List.Item
                title="Priority"
                right={() => (
                  <Badge 
                    style={[
                      styles.priorityBadge, 
                      { backgroundColor: getPriorityColor(workOrder.priorityIndex) }
                    ]}
                  >
                    {getPriorityText(workOrder.priorityIndex)}
                  </Badge>
                )}
              />
              <List.Item
                title="Due Date"
                right={() => <Paragraph>{new Date(workOrder.dueDate).toLocaleDateString()}</Paragraph>}
              />
              <List.Item
                title="Estimated Time"
                right={() => <Paragraph>{workOrder.estimatedTime}</Paragraph>}
              />
              {workOrder.location && (
                <List.Item
                  title="Location"
                  right={() => <Paragraph>{workOrder.location}</Paragraph>}
                />
              )}
              {workOrder.asset && (
                <List.Item
                  title="Asset"
                  right={() => <Paragraph>{workOrder.asset}</Paragraph>}
                />
              )}
            </List.Section>

            {workOrder.categories && workOrder.categories.length > 0 && (
              <View style={styles.categoriesContainer}>
                <Title style={styles.sectionTitle}>Categories</Title>
                <View style={styles.categoryTags}>
                  {workOrder.categories.map((category, index) => (
                    <Badge key={index} style={styles.categoryBadge}>
                      {category}
                    </Badge>
                  ))}
                </View>
              </View>
            )}

            {workOrder.attachments && workOrder.attachments.length > 0 && (
              <List.Section>
                <Title style={styles.sectionTitle}>Attachments</Title>
                {workOrder.attachments.map((attachment, index) => (
                  <View key={index} style={styles.attachmentContainer}>
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedAttachment(attachment);
                        setShowImageOptions(true);
                      }}
                    >
                      {attachment.type?.startsWith('image/') ? (
                        <View style={styles.imageContainer}>
                          <Image
                            source={{ uri: attachment.uri }}
                            style={styles.attachmentImage}
                            resizeMode="cover"
                          />
                          <View style={styles.imageOverlay}>
                            <Text style={styles.imageName}>{attachment.name}</Text>
                            <Text style={styles.imageSize}>
                              {`${(attachment.size / 1024).toFixed(1)} KB`}
                            </Text>
                          </View>
                        </View>
                      ) : (
                        <List.Item
                          title={attachment.name || 'Unnamed attachment'}
                          description={`${(attachment.size / 1024).toFixed(1)} KB`}
                          left={props => <List.Icon {...props} icon="file" />}
                        />
                      )}
                    </TouchableOpacity>
                  </View>
                ))}
              </List.Section>
            )}

            {workOrder.comments && (
              <List.Section>
                <Title style={styles.sectionTitle}>Comments</Title>
                {workOrder.comments.map((comment) => (
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
              </List.Section>
            )}
          </Card.Content>
        </Card>
      </ScrollView>

      <View style={styles.actionButtons}>
        <Button
          mode="contained"
          onPress={() => setShowCommentDialog(true)}
          style={styles.actionButton}
          icon="comment"
        >
          Add Comment
        </Button>
        <Button
          mode="contained"
          onPress={handleAddAttachment}
          style={styles.actionButton}
          icon="paperclip"
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
              placeholder="Type your comment here..."
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowCommentDialog(false)}>Cancel</Button>
            <Button onPress={handleAddComment} mode="contained">Add</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Portal>
        <Dialog visible={showImageOptions} onDismiss={() => setShowImageOptions(false)}>
          <Dialog.Title>Image Options</Dialog.Title>
          <Dialog.Content>
            <Button
              mode="outlined"
              onPress={() => {
                setShowImageOptions(false);
                handleEditImage(selectedAttachment);
              }}
              style={styles.dialogButton}
            >
              Edit Image
            </Button>
            <Button
              mode="outlined"
              onPress={() => {
                setShowImageOptions(false);
                handleDeleteAttachment(selectedAttachment);
              }}
              style={[styles.dialogButton, styles.deleteButton]}
            >
              Delete Image
            </Button>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowImageOptions(false)}>Cancel</Button>
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
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flex: 1,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusContainer: {
    marginVertical: 16,
  },
  segmentedButtons: {
    marginTop: 8,
  },
  statusButton: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    minWidth: 80,
    paddingVertical: 8,
  },
  statusLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  description: {
    marginBottom: 16,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 18,
    marginTop: 16,
    marginBottom: 8,
  },
  categoriesContainer: {
    marginVertical: 16,
  },
  categoryTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryBadge: {
    backgroundColor: '#e0e0e0',
  },
  priorityBadge: {
    alignSelf: 'center',
    paddingHorizontal: 12,
    // paddingVertical: 4,
  },
  commentCard: {
    marginVertical: 8,
    backgroundColor: '#f9f9f9',
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  commentInfo: {
    marginLeft: 8,
    flex: 1,
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
  attachmentContainer: {
    marginVertical: 8,
  },
  imageContainer: {
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
    marginHorizontal: 16,
  },
  attachmentImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 8,
  },
  imageName: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  imageSize: {
    color: 'white',
    fontSize: 12,
  },
  dialogButton: {
    marginVertical: 4,
  },
  deleteButton: {
    borderColor: '#FF0000',
    color: '#FF0000',
  },
});

export default WorkOrderDetails;
