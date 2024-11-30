import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert, Image, TouchableOpacity, Text } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import {
  TextInput,
  Button,
  Title,
  SegmentedButtons,
  List,
  useTheme,
  Portal,
  Dialog,
  Divider,
  IconButton,
} from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RootState } from '../../redux/store';
import { updateWorkOrder } from '../../redux/slices/workOrderSlice';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import * as ImagePicker from 'react-native-image-picker';

const EditWorkOrder = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const { workOrderId } = route.params;

  const workOrder = useSelector((state: RootState) =>
    state.workOrder.workOrders.find((wo) => wo.id === workOrderId)
  );

  const [formData, setFormData] = useState({
    task: '',
    description: '',
    priorityIndex: 0,
    estimatedTime: '',
    location: '',
    asset: '',
    categories: [] as string[],
    dueDate: new Date(),
    attachments: [] as any[],
  });

  useEffect(() => {
    if (workOrder) {
      setFormData({
        task: workOrder.task,
        description: workOrder.description || '',
        priorityIndex: workOrder.priorityIndex,
        estimatedTime: workOrder.estimatedTime,
        location: workOrder.location || '',
        asset: workOrder.asset || '',
        categories: workOrder.categories || [],
        dueDate: new Date(workOrder.dueDate),
        attachments: workOrder.attachments || [],
      });
    }
  }, [workOrder]);

  const handleSave = () => {
    if (!formData.task.trim()) {
      Alert.alert('Error', 'Task name is required');
      return;
    }

    const updatedWorkOrder = {
      ...workOrder,
      ...formData,
      dueDate: formData.dueDate.toISOString(),
      updatedAt: new Date().toISOString(),
    };

    dispatch(updateWorkOrder(updatedWorkOrder));
    navigation.goBack();
  };

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      setFormData(prev => ({
        ...prev,
        categories: [...prev.categories, newCategory.trim()]
      }));
      setNewCategory('');
      setShowCategoryDialog(false);
    }
  };

  const handleRemoveCategory = (index: number) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.filter((_, i) => i !== index)
    }));
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

  const handleAddImage = async () => {
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

        setFormData(prev => ({
          ...prev,
          attachments: [...prev.attachments, newAttachment],
        }));
      }
    } catch (err) {
      console.error('Error picking image:', err);
      Alert.alert('Error', 'Failed to add image');
    }
  };

  const handleEditImage = async (index: number) => {
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
          name: asset.fileName || 'image.jpg',
          uri: asset.uri,
          type: asset.type || 'image/jpeg',
          size: asset.fileSize || 0,
          width: asset.width,
          height: asset.height,
        };

        setFormData(prev => ({
          ...prev,
          attachments: prev.attachments.map((att, i) => 
            i === index ? updatedAttachment : att
          ),
        }));
      }
    } catch (err) {
      console.error('Error editing image:', err);
      Alert.alert('Error', 'Failed to edit image');
    }
  };

  const handleDeleteImage = (index: number) => {
    Alert.alert(
      'Delete Image',
      'Are you sure you want to delete this image?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setFormData(prev => ({
              ...prev,
              attachments: prev.attachments.filter((_, i) => i !== index),
            }));
          },
        },
      ]
    );
  };

  const [showDueDatePicker, setShowDueDatePicker] = useState(false);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [newCategory, setNewCategory] = useState('');

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.content}>
          <Title>Edit Work Order</Title>

          <TextInput
            label="Task"
            value={formData.task}
            onChangeText={(text) => setFormData(prev => ({ ...prev, task: text }))}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Description"
            value={formData.description}
            onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
            mode="outlined"
            multiline
            numberOfLines={4}
            style={styles.input}
          />

          <Title style={styles.sectionTitle}>Priority</Title>
          <SegmentedButtons
            value={formData.priorityIndex.toString()}
            onValueChange={(value) => 
              setFormData(prev => ({ ...prev, priorityIndex: parseInt(value) }))
            }
            buttons={[
              { value: '0', label: 'None' },
              { value: '1', label: 'Low' },
              { value: '2', label: 'Medium' },
              { value: '3', label: 'High' },
            ]}
            style={styles.segmentedButtons}
          />

          <TextInput
            label="Estimated Time"
            value={formData.estimatedTime}
            onChangeText={(text) => setFormData(prev => ({ ...prev, estimatedTime: text }))}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Location"
            value={formData.location}
            onChangeText={(text) => setFormData(prev => ({ ...prev, location: text }))}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Asset"
            value={formData.asset}
            onChangeText={(text) => setFormData(prev => ({ ...prev, asset: text }))}
            mode="outlined"
            style={styles.input}
          />

          <List.Item
            title="Due Date"
            description={format(formData.dueDate, 'PPP')}
            onPress={() => setShowDueDatePicker(true)}
            right={() => <List.Icon icon="calendar" />}
          />

          <Title style={styles.sectionTitle}>Categories</Title>
          <View style={styles.categoriesContainer}>
            {formData.categories.map((category, index) => (
              <View key={index} style={styles.categoryItem}>
                <List.Item
                  title={category}
                  right={() => (
                    <Button
                      onPress={() => handleRemoveCategory(index)}
                      icon="close"
                    />
                  )}
                />
                <Divider />
              </View>
            ))}
            <Button
              mode="outlined"
              onPress={() => setShowCategoryDialog(true)}
              style={styles.addButton}
            >
              Add Category
            </Button>
          </View>

          <Title style={styles.sectionTitle}>Attachments</Title>
          <Button
            mode="outlined"
            onPress={handleAddImage}
            icon="camera"
            style={styles.addButton}
          >
            Add Image
          </Button>

          {formData.attachments.map((attachment, index) => (
            <View key={index} style={styles.attachmentContainer}>
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
                  <View style={styles.imageActions}>
                    <IconButton
                      icon="pencil"
                      size={20}
                      onPress={() => handleEditImage(index)}
                    />
                    <IconButton
                      icon="delete"
                      size={20}
                      onPress={() => handleDeleteImage(index)}
                    />
                  </View>
                </View>
              ) : (
                <List.Item
                  title={attachment.name}
                  description={`${(attachment.size / 1024).toFixed(1)} KB`}
                  left={props => <List.Icon {...props} icon="file" />}
                  right={props => (
                    <IconButton
                      {...props}
                      icon="delete"
                      onPress={() => handleDeleteImage(index)}
                    />
                  )}
                />
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button mode="outlined" onPress={() => navigation.goBack()} style={styles.footerButton}>
          Cancel
        </Button>
        <Button mode="contained" onPress={handleSave} style={styles.footerButton}>
          Save
        </Button>
      </View>

      {showDueDatePicker && (
        <DateTimePicker
          value={formData.dueDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDueDatePicker(false);
            if (selectedDate) {
              setFormData(prev => ({ ...prev, dueDate: selectedDate }));
            }
          }}
        />
      )}

      <Portal>
        <Dialog visible={showCategoryDialog} onDismiss={() => setShowCategoryDialog(false)}>
          <Dialog.Title>Add Category</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Category Name"
              value={newCategory}
              onChangeText={setNewCategory}
              mode="outlined"
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowCategoryDialog(false)}>Cancel</Button>
            <Button onPress={handleAddCategory}>Add</Button>
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
  content: {
    padding: 16,
  },
  input: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  segmentedButtons: {
    marginBottom: 16,
  },
  categoriesContainer: {
    marginTop: 8,
  },
  categoryItem: {
    backgroundColor: 'white',
    marginBottom: 4,
  },
  addButton: {
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: 'white',
    elevation: 4,
  },
  footerButton: {
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
  imageActions: {
    position: 'absolute',
    top: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderBottomLeftRadius: 8,
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
});

export default EditWorkOrder;
