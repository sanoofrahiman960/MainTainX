import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Provider as PaperProvider,
  Appbar,
  TextInput,
  Button,
  List,
  Divider,
  Text,
  Menu,
  Portal,
  Dialog,
  SegmentedButtons,
  IconButton,
  Surface,
  Card,
  Chip,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { addWorkOrder } from '../../redux/actions/workOrderAction';
import { EstimatedTimeModal } from '../../Modals/EstimateTime';
import { WorkTypeModal } from '../../Modals/WorkType';
import VendorListItem from '../Vendors/VendorsListItem';

export default function NewWorkOrder() {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const locations = useSelector(state => state.locations.locations);
  const assets = useSelector(state => state.assets.assets);
  const categories = useSelector(state => state.assets.category);

  // State variables
  const [task, setTask] = useState('');
  const [description, setDescription] = useState('');
  const [priorityIndex, setPriorityIndex] = useState(0);
  const [imageUri, setImageUri] = useState(null);
  const [estimatedTime, setEstimatedTime] = useState({ hours: 1, minutes: 0 });
  const [attachments, setAttachments] = useState([]);
  const [workType, setWorkType] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [selectedLocationId, setSelectedLocationId] = useState(null);
  const [selectedAssetId, setSelectedAssetId] = useState(null);
  const [categoriesState, setCategoriesState] = useState([]); //Renamed to avoid conflict
  const [vendors, setVendors] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [selectedCustomerName, setSelectedCustomerName] = useState('');
  const [selectedVendors, setSelectedVendors] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  // UI state
  const [isEstimatedTimeModalVisible, setEstimatedTimeModalVisible] = useState(false);
  const [isWorkTypeModalVisible, setWorkTypeModalVisible] = useState(false);
  const [showLocationMenu, setShowLocationMenu] = useState(false);
  const [showAssetMenu, setShowAssetMenu] = useState(false);
  const [showCategoriesMenu, setShowCategoriesMenu] = useState(false);
  const [showVendorsMenu, setShowVendorsMenu] = useState(false);

  // Date states
  const [startDate, setStartDate] = useState(new Date());
  const [dueDate, setDueDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showDueDatePicker, setShowDueDatePicker] = useState(false);

  // Recurrence states
  const [recurrenceType, setRecurrenceType] = useState(null);
  const [recurrenceInterval, setRecurrenceInterval] = useState(1);
  const [selectedDays, setSelectedDays] = useState([]);
  const [monthDay, setMonthDay] = useState(1);
  const [showRecurrenceDialog, setShowRecurrenceDialog] = useState(false);
  const [recurrenceEndDate, setRecurrenceEndDate] = useState(new Date());
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  useEffect(() => {
    const loadPersistedData = async () => {
      try {
        const storedLocationId = await AsyncStorage.getItem('selectedLocationId');
        const storedAssetId = await AsyncStorage.getItem('selectedAssetId');
        const storedCustomerId = await AsyncStorage.getItem('selectedCustomerId');
        const storedCustomerName = await AsyncStorage.getItem('selectedCustomerName');
        const storedAssignedTo = await AsyncStorage.getItem('selectedUserName');
        const storedWorkType = await AsyncStorage.getItem('workType');
        const storedPriorityIndex = await AsyncStorage.getItem('priorityIndex');
        const storedSelectedCategories = await AsyncStorage.getItem('selectedCategories');
        const storedSelectedVendors = await AsyncStorage.getItem('selectedVendors');
      
        if (storedLocationId) setSelectedLocationId(storedLocationId);
        if (storedAssetId) setSelectedAssetId(storedAssetId);
        if (storedCustomerId) setSelectedCustomerId(storedCustomerId);
        if (storedCustomerName) setSelectedCustomerName(storedCustomerName);
        if (storedAssignedTo) setAssignedTo(storedAssignedTo);
        if (storedWorkType) setWorkType(storedWorkType);
        if (storedPriorityIndex) setPriorityIndex(parseInt(storedPriorityIndex));
        if (storedSelectedCategories) setSelectedCategories(JSON.parse(storedSelectedCategories));
        if (storedSelectedVendors) setSelectedVendors(JSON.parse(storedSelectedVendors));
      } catch (error) {
        console.error('Error loading persisted data:', error);
      }
    };

    loadPersistedData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const updateStateFromParams = async () => {
        if (route.params?.selectedLocationId) {
          await handleSetSelectedLocationId(route.params.selectedLocationId);
        }
        if (route.params?.selectedAssetId) {
          await handleSetSelectedAssetId(route.params.selectedAssetId);
        }
        if (route.params?.selectedCustomer) {
          setSelectedCustomerId(route.params.selectedCustomer.id);
          setSelectedCustomerName(route.params.selectedCustomer.name);
          // Automatically select the first asset for the selected customer
          const customerAssets = assets.filter(asset => asset.customerId === route.params.selectedCustomer.id);
          if (customerAssets.length > 0) {
            await handleSetSelectedAssetId(customerAssets[0].id);
          } else {
            // Clear selected asset if no assets for the selected customer
            await handleSetSelectedAssetId(null);
          }
        }
        if (route.params?.selectedUserId) {
          await loadAssignedUser();
        }
        if (route.params?.selectedVendors) {
          setSelectedVendors(route.params.selectedVendors);
          await AsyncStorage.setItem('selectedVendors', JSON.stringify(route.params.selectedVendors));
        }
        if (route.params?.selectedCategories) {
          setSelectedCategories(route.params.selectedCategories);
          await AsyncStorage.setItem('selectedCategories', JSON.stringify(route.params.selectedCategories));
        }
      };

      updateStateFromParams();
    }, [route.params])
  );

  const loadAssignedUser = async () => {
    try {
      const storedAssignedTo = await AsyncStorage.getItem('selectedUserName');
      if (storedAssignedTo) {
        setAssignedTo(storedAssignedTo);
      }
    } catch (error) {
      console.error('Error loading assigned user:', error);
    }
  };

  const selectedLocation = locations.find(loc => loc.id === selectedLocationId);
  const selectedAsset = assets.find(asset => asset.id === selectedAssetId);

  const handleSetSelectedLocationId = async (id) => {
    setSelectedLocationId(id);
    try {
      await AsyncStorage.setItem('selectedLocationId', id);
    } catch (error) {
      console.error('Error saving location ID to AsyncStorage:', error);
    }
  };

  const handleSetSelectedAssetId = async (id) => {
    setSelectedAssetId(id);
    try {
      await AsyncStorage.setItem('selectedAssetId', id);
    } catch (error) {
      console.error('Error saving asset ID to AsyncStorage:', error);
    }
  };

  const handleSaveEstimatedTime = (hours, minutes) => {
    setEstimatedTime({ hours, minutes });
    setEstimatedTimeModalVisible(false);
  };

  const handleWorkTypeChange = async (newWorkType) => {
    setWorkType(newWorkType);
    setWorkTypeModalVisible(false);
    try {
      await AsyncStorage.setItem('workType', newWorkType);
    } catch (error) {
      console.error('Error saving work type to AsyncStorage:', error);
    }
  };

  const handleAttachment = (type) => {
    const options = {
      mediaType: type === 'photo' ? 'photo' : 'mixed',
      quality: 0.8,
      selectionLimit: 0,
    };

    const launcher = type === 'photo' ? launchCamera : launchImageLibrary;
    launcher(options, (response) => {
      if (!response.didCancel && !response.error) {
        const newAttachments = response.assets.map(asset => ({
          ...asset,
          type: type === 'photo' ? 'photo' : 'file'
        }));
        setAttachments([...attachments, ...newAttachments]);
      }
    });
  };

  const removeAttachment = (index) => {
    const newAttachments = [...attachments];
    newAttachments.splice(index, 1);
    setAttachments(newAttachments);
  };

  const handleRecurrenceTypeChange = (type) => {
    setRecurrenceType(type);
    setRecurrenceInterval(1);
    setSelectedDays([]);
    setMonthDay(1);
  };

  const handleCreateWorkOrder = () => {
    const newWorkOrder = {
      id: Date.now().toString(),
      task,
      description,
      workType,
      assignedTo,
      location: selectedLocation ? selectedLocation.name : '',
      asset: selectedAsset ? selectedAsset.task : '',
      categories: selectedCategories,
      vendors: selectedVendors,
      priority: priorities[priorityIndex].label,
      estimatedTime: `${estimatedTime.hours}h ${estimatedTime.minutes}m`,
      attachments,
      startDate: format(startDate, 'yyyy-MM-dd'),
      dueDate: format(dueDate, 'yyyy-MM-dd'),
      status: 'Open',
      imageUri,
      recurrence: recurrenceType ? {
        type: recurrenceType,
        interval: recurrenceInterval,
        selectedDays: selectedDays,
        monthDay: monthDay,
        endDate: recurrenceEndDate,
      } : undefined,
      customerId: selectedCustomerId,
      customerName: selectedCustomerName,
    };

    dispatch(addWorkOrder(newWorkOrder));
    navigation.navigate('WorkOrderDetails', { workOrder: newWorkOrder });
  };

  const priorities = [
    { label: 'None', value: 0, color: '#BDBDBD' },
    { label: 'Low', value: 1, color: '#4CAF50' },
    { label: 'Medium', value: 2, color: '#FFC107' },
    { label: 'High', value: 3, color: '#F44336' },
  ];

  const workTypes = ['Preventive', 'Reactive', 'Others', 'Cycle Count'];
  const categoryOptions = [
    { id: '1', label: 'Damage', icon: 'alert-circle' },
    { id: '2', label: 'Electrical', icon: 'flash' },
    { id: '3', label: 'Plumbing', icon: 'water-pump' },
    { id: '4', label: 'Mechanical', icon: 'wrench' },
    { id: '5', label: 'General', icon: 'tools' },
  ];
  const vendorOptions = ['Vendor A', 'Vendor B', 'Vendor C', 'Vendor D'];
  const weekDays = [
    { label: 'Sun', value: 'SUN' },
    { label: 'Mon', value: 'MON' },
    { label: 'Tue', value: 'TUE' },
    { label: 'Wed', value: 'WED' },
    { label: 'Thu', value: 'THU' },
    { label: 'Fri', value: 'FRI' },
    { label: 'Sat', value: 'SAT' },
  ];

  const handleCategories = () => {
    navigation.navigate('AddCategories', { selectedCategories });
  };

  const handleVendors = () => {
    navigation.navigate('VendorsListing', { selectedVendors });
  };

  const RecurrenceDialog = () => (
    <Portal>
      <Dialog visible={showRecurrenceDialog} onDismiss={() => setShowRecurrenceDialog(false)}>
        <Dialog.Title>Set Recurrence</Dialog.Title>
        <Dialog.Content>
          <SegmentedButtons
            value={recurrenceType}
            onValueChange={handleRecurrenceTypeChange}
            buttons={[
              { value: 'daily', label: 'Daily' },
              { value: 'weekly', label: 'Weekly' },
              { value: 'monthly', label: 'Monthly' },
              { value: 'yearly', label: 'Yearly' },
            ]}
          />

          {recurrenceType && (
            <Surface style={styles.recurrenceOptions} elevation={0}>
              <Text variant="bodyLarge">Repeat every:</Text>
              <View style={styles.intervalContainer}>
                <TextInput
                  mode="outlined"
                  keyboardType="number-pad"
                  value={recurrenceInterval.toString()}
                  onChangeText={(text) => setRecurrenceInterval(parseInt(text) || 1)}
                  style={styles.intervalInput}
                />
                <Text variant="bodyLarge" style={styles.intervalLabel}>
                  {recurrenceType === 'daily' ? 'day(s)' :
                   recurrenceType === 'weekly' ? 'week(s)' :
                   recurrenceType === 'monthly' ? 'month(s)' : 'year(s)'}
                </Text>
              </View>
              {recurrenceType === 'daily' && (
                <View style={styles.daysContainer}>
                  <Text variant="bodyLarge">Or select specific days:</Text>
                  <View style={styles.daysGrid}>
                    {weekDays.map((day) => (
                      <Button
                        key={day.value}
                        mode={selectedDays.includes(day.value) ? 'contained' : 'outlined'}
                        onPress={() => {
                          setSelectedDays(
                            selectedDays.includes(day.value)
                              ? selectedDays.filter(d => d !== day.value)
                              : [...selectedDays, day.value]
                          );
                        }}
                        style={styles.dayButton}
                      >
                        {day.label}
                      </Button>
                    ))}
                  </View>
                </View>
              )}
              {recurrenceType === 'monthly' && (
                <View style={styles.monthDayContainer}>
                  <Text variant="bodyLarge">On day:</Text>
                  <TextInput
                    mode="outlined"
                    keyboardType="number-pad"
                    value={monthDay.toString()}
                    onChangeText={(text) => {
                      const day = parseInt(text) || 1;
                      setMonthDay(Math.min(Math.max(day, 1), 31));
                    }}
                    style={styles.monthDayInput}
                  />
                </View>
              )}
              <Button
                mode="outlined"
                onPress={() => setShowEndDatePicker(true)}
                style={styles.endDateButton}
              >
                End Date: {format(recurrenceEndDate, 'MMM d, yyyy')}
              </Button>
            </Surface>
          )}
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setShowRecurrenceDialog(false)}>Cancel</Button>
          <Button onPress={() => {
            setShowRecurrenceDialog(false);
            // Additional logic to save recurrence settings
          }}>Save</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );

  const filteredAssets = selectedCustomerId
    ? assets.filter(asset => asset.customerId === selectedCustomerId)
    : assets;

  const setPriorityIndexAndPersist = async (index) => {
    setPriorityIndex(index);
    try {
      await AsyncStorage.setItem('priorityIndex', index.toString());
    } catch (error) {
      console.error('Error saving priority index to AsyncStorage:', error);
    }
  };

  const handleRemoveVendor = (vendorId) => {
    setSelectedVendors(prevVendors => prevVendors.filter(v => v.id !== vendorId));
  };

  return (
    <PaperProvider>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction color="#fff" onPress={() => navigation.goBack()} />
        <Appbar.Content title="New Work Order" titleStyle={styles.headerTitle} />
        <Appbar.Action icon="check" color="#fff" onPress={handleCreateWorkOrder} />
      </Appbar.Header>
      <ScrollView style={styles.scrollView}>
        <TextInput
          placeholder="What needs to be done?"
          value={task}
          onChangeText={setTask}
          style={styles.taskInput}
        />
        <Button
          icon="camera"
          mode="outlined"
          onPress={() => handleAttachment('photo')}
          style={styles.imageButton}
        >
          Add or take pictures
        </Button>
        <TextInput
          placeholder="Add a description"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
          style={styles.descriptionInput}
        />
         <TouchableOpacity
          style={styles.field}
          onPress={() => navigation.navigate('customerSelect')}
        >
          <Text style={styles.fieldLabel}>Customer</Text>
          <View style={styles.fieldValue}>
            <Text style={styles.blueText}>
              {selectedCustomerName || 'Select Customer'}
            </Text>
            <Icon name="chevron-right" size={24} color="#007AFF" />
          </View>
        </TouchableOpacity>
        <Divider />
        <TouchableOpacity
          style={styles.field}
          onPress={() => setEstimatedTimeModalVisible(true)}
        >
          <Text style={styles.fieldLabel}>Estimated Time</Text>
          <View style={styles.fieldValue}>
            <Text style={styles.blueText}>{estimatedTime.hours}h {estimatedTime.minutes}m</Text>
            <Icon name="chevron-right" size={24} color="#007AFF" />
          </View>
        </TouchableOpacity>
        <Divider />
        <TouchableOpacity
          style={styles.field}
          onPress={() => navigation.navigate('AssignTo')}
        >
          <Text style={styles.fieldLabel}>Assign to</Text>
          <View style={styles.fieldValue}>
            <Text style={styles.blueText}>
              {assignedTo || 'Choose'}
            </Text>
            <Icon name="chevron-right" size={24} color="#007AFF" />
          </View>
        </TouchableOpacity>
        <Divider />
        <List.Item
          title="Due Date"
          description={format(dueDate, 'MMM d, yyyy')}
          onPress={() => setShowDueDatePicker(true)}
          right={() => <List.Icon icon="chevron-right" />}
        />
        <Divider />
        <List.Item
          title="Start Date"
          description={format(startDate, 'MMM d, yyyy')}
          onPress={() => setShowStartDatePicker(true)}
          right={() => <List.Icon icon="chevron-right" />}
        />
        <Divider />
        <TouchableOpacity
          style={styles.field}
          onPress={() => navigation.navigate('recurrence')}
        >
          <Text style={styles.fieldLabel}>Recurrence</Text>
          <View style={styles.fieldValue}>
            <Text style={styles.blueText}>{"recurrence" || 'Select'}</Text>
            <Icon name="chevron-right" size={24} color="#007AFF" />
          </View>
        </TouchableOpacity>
        <Divider />
        <TouchableOpacity
          style={styles.field}
          onPress={() => setWorkTypeModalVisible(true)}
        >
          <Text style={styles.fieldLabel}>Work Type</Text>
          <View style={styles.fieldValue}>
            <Text style={styles.blueText}>{workType || 'Select'}</Text>
            <Icon name="chevron-right" size={24} color="#007AFF" />
          </View>
        </TouchableOpacity>
        <Divider />
        <Text style={styles.sectionTitle}>Priority</Text>
        <View style={styles.priorityContainer}>
          {priorities.map((priority, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.priorityButton,
                { backgroundColor: priority.color },
                priorityIndex === priority.value && styles.priorityButtonSelected,
              ]}
              onPress={() => setPriorityIndexAndPersist(priority.value)}
            >
              <Text style={styles.priorityText}>{priority.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity
          style={styles.field}
          onPress={() => navigation.navigate('Assets', {tab:"Location"},{ onSelect: handleSetSelectedLocationId })}
        >
          <Text style={styles.fieldLabel}>Location</Text>
          <View style={styles.fieldValue}>
            <Text style={styles.blueText}>
              {selectedLocation ? selectedLocation.name : 'Select Location'}
            </Text>
            <Icon name="chevron-right" size={24} color="#007AFF" />
          </View>
        </TouchableOpacity>
        <Divider />
        <TouchableOpacity
          style={styles.field}
          onPress={() => navigation.navigate('Assets', { 
            onSelect: handleSetSelectedAssetId,
            assets: filteredAssets,
            tab:"Asset"
          })}
        >
          <Text style={styles.fieldLabel}>Asset</Text>
          <View style={styles.fieldValue}>
            <Text style={styles.blueText}>
              {selectedAsset ? selectedAsset.task : 'Select Asset'}
            </Text>
            <Icon name="chevron-right" size={24} color="#007AFF" />
          </View>
        </TouchableOpacity>
        <Divider />
        <List.Item
          title="Parts Needed"
          description="Add Parts"
          onPress={() => {
            /* Handle adding parts */
          }}
          right={props => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <IconButton icon="lock" size={20} />
              <List.Icon {...props} icon="chevron-right" />
            </View>
          )}
        />
        <Divider />
        <List.Item
          title="Categories"
          description={
            selectedCategories.length > 0
              ? selectedCategories.map(id => categories.find(c => c.id === id)?.name).join(', ')
              : "Add Categories"
          }
          onPress={handleCategories}
          right={() => <List.Icon icon="chevron-right" />}
        />
        <View style={styles.categoriesContainer}>
          {selectedCategories.map(categoryId => {
            const category = categories.find(c => c.id === categoryId);
            return (
              <Chip
                key={categoryId}
                style={styles.categoryChip}
                textStyle={styles.categoryChipText}
                onClose={() => {
                  const updatedCategories = selectedCategories.filter(id => id !== categoryId);
                  setSelectedCategories(updatedCategories);
                  AsyncStorage.setItem('selectedCategories', JSON.stringify(updatedCategories));
                }}
              >
                {category?.name}
              </Chip>
            );
          })}
        </View>
        <Divider />
        <List.Item
          title="Files"
          description={`${attachments.length} attached`}
          onPress={() => handleAttachment('file')}
          right={() => <List.Icon icon="chevron-right" />}
        />
        <Divider />
        <VendorListItem
          title={selectedVendors.length > 0 ? selectedVendors[0].name : "Add Vendors"}
          count={selectedVendors.length > 1 ? selectedVendors.length - 1 : undefined}
          onPress={handleVendors}
        />
        <Divider />
      </ScrollView>
      {imageUri && (
        <Card style={styles.card}>
          <Card.Content>
            <Image
              source={{ uri: imageUri }}
              style={styles.image}
              resizeMode="cover"
            />
            <Button
              icon="delete"
              mode="contained"
              onPress={() => setImageUri(null)}
              style={{ marginTop: 8 }}
            >
              Remove Photo
            </Button>
          </Card.Content>
        </Card>
      )}
      <RecurrenceDialog />
      <EstimatedTimeModal
        visible={isEstimatedTimeModalVisible}
        onClose={() => setEstimatedTimeModalVisible(false)}
        onSave={handleSaveEstimatedTime}
        initialHours={estimatedTime.hours}
        initialMinutes={estimatedTime.minutes}
      />
      <WorkTypeModal
        visible={isWorkTypeModalVisible}
        onClose={() => setWorkTypeModalVisible(false)}
        onSelect={handleWorkTypeChange}
        currentWorkType={workType}
      />
      <Menu
        visible={showLocationMenu}
        onDismiss={() => setShowLocationMenu(false)}
        anchor={<View />}
      >
        {locations.map((loc) => (
          <Menu.Item
            key={loc.id}
            onPress={() => {
              handleSetSelectedLocationId(loc.id);
              setShowLocationMenu(false);
            }}
            title={loc.name}
          />
        ))}
      </Menu>
      <Menu
        visible={showAssetMenu}
        onDismiss={() => setShowAssetMenu(false)}
        anchor={<View />}
      >
        {filteredAssets.map((ast) => (
          <Menu.Item
            key={ast.id}
            onPress={() => {
              handleSetSelectedAssetId(ast.id);
              setShowAssetMenu(false);
            }}
            title={ast.task}
          />
        ))}
      </Menu>
      
      <Menu
        visible={showCategoriesMenu}
        onDismiss={() => setShowCategoriesMenu(false)}
        anchor={<View />}
      >
        {categoryOptions.map((category) => (
          <Menu.Item
            key={category.id}
            onPress={() => {
              setCategoriesState([...categoriesState, category.label]);
              setShowCategoriesMenu(false);
            }}
            title={category.label}
            leadingIcon={category.icon}
          />
        ))}
      </Menu>
      <Menu
        visible={showVendorsMenu}
        onDismiss={() => setShowVendorsMenu(false)}
        anchor={<View />}
      >
        {vendorOptions.map((vendor) => (
          <Menu.Item
            key={vendor}
            onPress={() => {
              setVendors([...vendors, vendor]);
              setShowVendorsMenu(false);
            }}
            title={vendor}
          />
        ))}
      </Menu>
      {showStartDatePicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowStartDatePicker(false);
            if (selectedDate) setStartDate(selectedDate);
          }}
        />
      )}
      {showDueDatePicker && (
        <DateTimePicker
          value={dueDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDueDatePicker(false);
            if (selectedDate) setDueDate(selectedDate);
          }}
        />
      )}
      {showEndDatePicker && (
        <DateTimePicker
          value={recurrenceEndDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowEndDatePicker(false);
            if (selectedDate) setRecurrenceEndDate(selectedDate);
          }}
          minimumDate={new Date()}
        />
      )}
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#2196F3',
  },
  headerTitle: {
    color: '#fff',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  taskInput: {
    backgroundColor: '#FFFFFF',
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  imageButton: {
    margin: 16,
    borderStyle: 'dashed',
  },
  descriptionInput: {
    backgroundColor: '#FFFFFF',
    fontSize: 14,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    marginLeft: 16,
    marginTop: 16,
    marginBottom: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  priorityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 4,
    marginHorizontal: 4,
  },
  priorityButtonSelected: {
    borderWidth: 2,
    borderColor: '#000',
  },
  priorityText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  field: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  fieldValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  blueText: {
    color: '#007AFF',
    marginRight: 8,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginVertical: 8,
  },
  recurrenceOptions: {
    padding: 16,
    marginTop: 16,
  },
  intervalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  intervalInput: {
    width: 60,
    marginRight: 8,
  },
  intervalLabel: {
    flex: 1,
  },
  daysContainer: {
    marginTop: 16,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  dayButton: {
    margin: 4,
  },
  monthDayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  monthDayInput: {
    width: 60,
    marginLeft: 8,
  },
  endDateButton: {
    marginTop: 16,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
  },
  categoryChip: {
    margin: 4,
  },
  categoryChipText: {
    fontSize: 12,
  },
});

