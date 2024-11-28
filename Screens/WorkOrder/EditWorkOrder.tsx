import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
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
} from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RootState } from '../../redux/store';
import { updateWorkOrder } from '../../redux/slices/workOrderSlice';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';

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
  });

  const [showDueDatePicker, setShowDueDatePicker] = useState(false);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [newCategory, setNewCategory] = useState('');

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
});

export default EditWorkOrder;
