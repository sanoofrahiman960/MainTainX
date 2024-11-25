import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import {
    Provider as PaperProvider,
    Appbar,
    TextInput,
    Button,
    List,
    Divider,
    Surface,
    Portal,
    Dialog,
    SegmentedButtons,
    IconButton,
    Card,
    Text,
    Badge
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector, useDispatch } from 'react-redux';
import { selectVendor, unselectVendor, clearSelectedVendors } from '../../redux/slices/vendorSlice';

export default function NewWorkOrder() {
    const navigation = useNavigation();
    
    // State variables
    const [task, setTask] = useState('');
    const [description, setDescription] = useState('');
    const [priorityIndex, setPriorityIndex] = useState(0);
    const [imageUri, setImageUri] = useState(null);
    const [estimatedTime, setEstimatedTime] = useState(new Date());
    const [attachments, setAttachments] = useState([]);
    const [workType, setWorkType] = useState('');
    const [assignedTo, setAssignedTo] = useState('');
    const [location, setLocation] = useState('');
    const [asset, setAsset] = useState('');
    const [categories, setCategories] = useState([]);
    const vendors = useSelector(state => state.vendor.vendors);
    const selectedVendors = useSelector(state => state.vendor.selectedVendors);
    
    // Location states
    const [locations, setLocations] = useState(['Building A', 'Building B', 'Workshop', 'Warehouse']);
    const [showLocationDialog, setShowLocationDialog] = useState(false);
    const [showAddLocationDialog, setShowAddLocationDialog] = useState(false);
    const [newLocation, setNewLocation] = useState('');

    // Menu visibility states
    const [showWorkTypeMenu, setShowWorkTypeMenu] = useState(false);
    const [showCategoriesMenu, setShowCategoriesMenu] = useState(false);
    const [showVendorsMenu, setShowVendorsMenu] = useState(false);
    const [showAddCategoryDialog, setShowAddCategoryDialog] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [selectedIcon, setSelectedIcon] = useState('');
    const [showIconSelector, setShowIconSelector] = useState(false);
    const [newCategoryIcon, setNewCategoryIcon] = useState('');
    
    // Date and time states
    const [startDate, setStartDate] = useState(new Date());
    const [dueDate, setDueDate] = useState(new Date());
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showDueDatePicker, setShowDueDatePicker] = useState(false);
    const [showEstimatedTimePicker, setShowEstimatedTimePicker] = useState(false);

    // Recurrence states
    const [recurrenceType, setRecurrenceType] = useState(null);
    const [recurrenceInterval, setRecurrenceInterval] = useState(1);
    const [selectedDays, setSelectedDays] = useState([]);
    const [monthDay, setMonthDay] = useState(1);
    const [showRecurrenceDialog, setShowRecurrenceDialog] = useState(false);
    const [recurrenceEndDate, setRecurrenceEndDate] = useState(new Date());
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);

    // Sample data
    const workTypes = ['Preventive', 'Reactive', 'Others', 'Cycle Count'];
    const [categoryOptions, setCategoryOptions] = useState([
        { id: '1', label: 'Damage', icon: 'alert-circle' },
        { id: '2', label: 'Electrical', icon: 'flash' },
        { id: '3', label: 'Plumbing', icon: 'water-pump' },
        { id: '4', label: 'Mechanical', icon: 'wrench' },
        { id: '5', label: 'General', icon: 'tools' }
    ]);
    const priorities = [
        { label: 'Low', value: 0, color: '#4CAF50' },
        { label: 'Medium', value: 1, color: '#FFC107' },
        { label: 'High', value: 2, color: '#F44336' },
        { label: 'Critical', value: 3, color: '#800000' }
    ];
    const weekDays = [
        { label: 'Sun', value: 'SUN' },
        { label: 'Mon', value: 'MON' },
        { label: 'Tue', value: 'TUE' },
        { label: 'Wed', value: 'WED' },
        { label: 'Thu', value: 'THU' },
        { label: 'Fri', value: 'FRI' },
        { label: 'Sat', value: 'SAT' },
    ];

    // Available icons for categories
    const availableIcons = [
        'wrench', 'tools', 'flash', 'water-pump', 'alert-circle', 
        'cog', 'hammer', 'screwdriver', 'battery', 'pipe', 
        'fan', 'engine', 'robot', 'crane', 'forklift'
    ];

    // Functions
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

    const generateRecurringDates = () => {
        if (!recurrenceType) return [];
        const dates = [];
        let currentDate = new Date(startDate);
        while (currentDate <= recurrenceEndDate) {
            switch (recurrenceType) {
                case 'daily':
                    if (selectedDays.length === 0) {
                        dates.push(new Date(currentDate));
                        currentDate.setDate(currentDate.getDate() + recurrenceInterval);
                    } else {
                        if (selectedDays.includes(format(currentDate, 'EEE').toUpperCase())) {
                            dates.push(new Date(currentDate));
                        }
                        currentDate.setDate(currentDate.getDate() + 1);
                    }
                    break;
                case 'weekly':
                    dates.push(new Date(currentDate));
                    currentDate.setDate(currentDate.getDate() + (recurrenceInterval * 7));
                    break;
                case 'monthly':
                    if (currentDate.getDate() === monthDay) {
                        dates.push(new Date(currentDate));
                    }
                    currentDate.setMonth(currentDate.getMonth() + recurrenceInterval);
                    currentDate.setDate(monthDay);
                    break;
                case 'yearly':
                    dates.push(new Date(currentDate));
                    currentDate.setFullYear(currentDate.getFullYear() + recurrenceInterval);
                    break;
            }
        }
        return dates;
    };

    // Component rendering
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

    return (
        <PaperProvider>
            <ScrollView style={styles.scrollView}>
                <Appbar.Header>
                    <Appbar.BackAction onPress={() => navigation.goBack()} />
                    <Appbar.Content title="New Work Order" />
                    <Appbar.Action icon="check" onPress={() => {
                        // Handle work order creation
                        const dates = generateRecurringDates();
                        console.log('Generated dates:', dates);
                        navigation.goBack();
                    }} />
                </Appbar.Header>
                <Card style={styles.card}>
                    <Card.Content>
                        <TextInput
                            label="Task"
                            value={task}
                            onChangeText={setTask}
                            mode="outlined"
                            style={styles.input}
                        />
                        <TextInput
                            label="Description"
                            value={description}
                            onChangeText={setDescription}
                            mode="outlined"
                            multiline
                            numberOfLines={3}
                            style={styles.input}
                        />
                        <List.Item
                            title="Work Type"
                            description={workType || "Select work type"}
                            onPress={() => setShowWorkTypeMenu(true)}
                            right={props => <List.Icon {...props} icon="chevron-right" />}
                        />
                        <Divider style={styles.divider} />
                        <TextInput
                            label="Assign To"
                            value={assignedTo}
                            onChangeText={setAssignedTo}
                            mode="outlined"
                            style={styles.input}
                        />
                        <List.Item
                            title="Location"
                            description={location || "Select location"}
                            onPress={() => setShowLocationDialog(true)}
                            right={props => <List.Icon {...props} icon="chevron-right" />}
                        />
                        <TextInput
                            label="Asset"
                            value={asset}
                            onChangeText={setAsset}
                            mode="outlined"
                            style={styles.input}
                        />
                        <List.Item
                            title="Categories"
                            description={categories.length > 0 ? 
                                categoryOptions
                                    .filter(cat => categories.includes(cat.id))
                                    .map(cat => cat.label)
                                    .join(', ') 
                                : "Select categories"
                            }
                            onPress={() => setShowCategoriesMenu(true)}
                            right={props => (
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    {categories.length > 0 && (
                                        <View style={styles.categoryIconsContainer}>
                                            {categoryOptions
                                                .filter(cat => categories.includes(cat.id))
                                                .slice(0, 3)
                                                .map((cat, index) => (
                                                    <List.Icon 
                                                        key={cat.id} 
                                                        icon={cat.icon} 
                                                        style={styles.categoryIcon}
                                                    />
                                                ))
                                            }
                                            {categories.length > 3 && (
                                                <Text style={styles.moreCategories}>
                                                    +{categories.length - 3}
                                                </Text>
                                            )}
                                        </View>
                                    )}
                                    <List.Icon {...props} icon="chevron-right" />
                                </View>
                            )}
                        />
                        <Divider style={styles.divider} />
                        <List.Item
                            title="Vendors"
                            description={selectedVendors.length > 0 ? 
                                vendors.filter(v => selectedVendors.includes(v.id))
                                    .map(v => v.name)
                                    .join(', ') 
                                : "Select vendors"
                            }
                            onPress={() => navigation.navigate('Vendors')}
                            right={props => <List.Icon {...props} icon="chevron-right" />}
                        />
                        <Divider style={styles.divider} />
                        <Text variant="titleMedium" style={styles.sectionTitle}>Priority</Text>
                        <View style={styles.priorityContainer}>
                            {priorities.map((priority, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.priorityButton,
                                        { backgroundColor: priority.color },
                                        priorityIndex === priority.value && styles.priorityButtonSelected
                                    ]}
                                    onPress={() => setPriorityIndex(priority.value)}
                                >
                                    <Text style={[
                                        styles.priorityText,
                                        priorityIndex === priority.value && styles.priorityTextSelected
                                    ]}>
                                        {priority.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <List.Item
                            title="Estimated Time"
                            description={format(estimatedTime, 'hh:mm a')}
                            onPress={() => setShowEstimatedTimePicker(true)}
                            right={props => <List.Icon {...props} icon="clock-outline" />}
                        />
                        <Divider style={styles.divider} />
                        <List.Item
                            title="Attachments"
                            description={`${attachments.length} items attached`}
                            right={props => (
                                <View style={{ flexDirection: 'row' }}>
                                    <IconButton
                                        icon="camera"
                                        onPress={() => handleAttachment('photo')}
                                    />
                                    <IconButton
                                        icon="file-plus"
                                        onPress={() => handleAttachment('file')}
                                    />
                                </View>
                            )}
                        />
                        {attachments.length > 0 && (
                            <Card style={styles.card}>
                                <Card.Content>
                                    {attachments.map((attachment, index) => (
                                        <View key={index}>
                                            {attachment.type === 'photo' ? (
                                                <View style={styles.attachmentItem}>
                                                    <Image
                                                        source={{ uri: attachment.uri }}
                                                        style={styles.attachmentImage}
                                                    />
                                                    <IconButton
                                                        icon="delete"
                                                        onPress={() => removeAttachment(index)}
                                                    />
                                                </View>
                                            ) : (
                                                <List.Item
                                                    title={attachment.fileName || `File ${index + 1}`}
                                                    description={`${Math.round(attachment.fileSize / 1024)} KB`}
                                                    left={props => <List.Icon {...props} icon="file" />}
                                                    right={props => (
                                                        <IconButton
                                                            icon="delete"
                                                            onPress={() => removeAttachment(index)}
                                                        />
                                                    )}
                                                />
                                            )}
                                            {index < attachments.length - 1 && <Divider />}
                                        </View>
                                    ))}
                                </Card.Content>
                            </Card>
                        )}
                        <List.Item
                            title="Recurrence"
                            description={recurrenceType ? `${recurrenceInterval} ${recurrenceType}(s)` : 'Not set'}
                            onPress={() => setShowRecurrenceDialog(true)}
                            right={props => (
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    {recurrenceType && (
                                        <IconButton
                                            {...props}
                                            icon="close"
                                            onPress={(e) => {
                                                e.stopPropagation();
                                                setRecurrenceType(null);
                                                setRecurrenceInterval(1);
                                                setSelectedDays([]);
                                                setMonthDay(1);
                                                setRecurrenceEndDate(new Date());
                                            }}
                                        />
                                    )}
                                    <List.Icon {...props} icon="calendar-range" />
                                </View>
                            )}
                        />
                        <Divider style={styles.divider} />
                        <List.Item
                            title="Start Date"
                            description={format(startDate, 'MMM d, yyyy')}
                            onPress={() => setShowStartDatePicker(true)}
                            right={props => <List.Icon {...props} icon="calendar-range" />}
                        />
                        <Divider style={styles.divider} />
                        <List.Item
                            title="Due Date"
                            description={format(dueDate, 'MMM d, yyyy')}
                            onPress={() => setShowDueDatePicker(true)}
                            right={props => <List.Icon {...props} icon="calendar-range" />}
                        />
                        <Divider style={styles.divider} />
                        <List.Item
                            title="Add Photo"
                            description={imageUri ? "Photo added" : "Take or choose a photo"}
                            onPress={() => handleAttachment('photo')}
                            right={props => <List.Icon {...props} icon="camera" />}
                        />
                    </Card.Content>
                </Card>
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
                <Portal>
                    <Dialog visible={showWorkTypeMenu} onDismiss={() => setShowWorkTypeMenu(false)}>
                        <Dialog.Title>Select Work Type</Dialog.Title>
                        <Dialog.Content>
                            {workTypes.map((type, index) => (
                                <List.Item
                                    key={index}
                                    title={type}
                                    onPress={() => {
                                        setWorkType(type);
                                        setShowWorkTypeMenu(false);
                                    }}
                                />
                            ))}
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={() => setShowWorkTypeMenu(false)}>Cancel</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
                <Portal>
                    <Dialog visible={showCategoriesMenu} onDismiss={() => setShowCategoriesMenu(false)}>
                        <Dialog.Title>Select Categories</Dialog.Title>
                        <Dialog.Content>
                            <ScrollView>
                                {categoryOptions.map((category, index) => (
                                    <List.Item
                                        key={index}
                                        title={category.label}
                                        left={props => <List.Icon {...props} icon={category.icon} />}
                                        onPress={() => {
                                            const isSelected = categories.includes(category.id);
                                            if (isSelected) {
                                                setCategories(categories.filter(id => id !== category.id));
                                            } else {
                                                setCategories([...categories, category.id]);
                                            }
                                        }}
                                        right={props => 
                                            categories.includes(category.id) ? 
                                            <List.Icon {...props} icon="check" /> : null
                                        }
                                    />
                                ))}
                            </ScrollView>
                            <Button 
                                mode="contained" 
                                onPress={() => {
                                    setShowCategoriesMenu(false);
                                    setShowAddCategoryDialog(true);
                                }}
                                style={{ marginTop: 10 }}
                            >
                                Add New Category
                            </Button>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={() => setShowCategoriesMenu(false)}>Done</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
                <Portal>
                    <Dialog visible={showAddCategoryDialog} onDismiss={() => setShowAddCategoryDialog(false)}>
                        <Dialog.Title>Add New Category</Dialog.Title>
                        <Dialog.Content>
                            <TextInput
                                label="Category Name"
                                value={newCategoryName}
                                onChangeText={setNewCategoryName}
                                mode="outlined"
                                style={{ marginBottom: 10 }}
                            />
                            <List.Item
                                title="Select Icon"
                                description={selectedIcon || "Choose an icon"}
                                left={props => selectedIcon ? 
                                    <List.Icon {...props} icon={selectedIcon} /> :
                                    <List.Icon {...props} icon="shape-outline" />
                                }
                                onPress={() => setShowIconSelector(true)}
                            />
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={() => {
                                setShowAddCategoryDialog(false);
                                setNewCategoryName('');
                                setSelectedIcon('');
                            }}>Cancel</Button>
                            <Button 
                                mode="contained"
                                disabled={!newCategoryName || !selectedIcon}
                                onPress={() => {
                                    const newCategory = {
                                        id: (categoryOptions.length + 1).toString(),
                                        label: newCategoryName,
                                        icon: selectedIcon
                                    };
                                    setCategoryOptions([...categoryOptions, newCategory]);
                                    setCategories([...categories, newCategory.id]);
                                    setNewCategoryName('');
                                    setSelectedIcon('');
                                    setShowAddCategoryDialog(false);
                                }}
                            >
                                Add
                            </Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
                <Portal>
                    <Dialog visible={showIconSelector} onDismiss={() => setShowIconSelector(false)}>
                        <Dialog.Title>Select Icon</Dialog.Title>
                        <Dialog.Content>
                            <ScrollView>
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around' }}>
                                    {availableIcons.map((icon, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            onPress={() => {
                                                setSelectedIcon(icon);
                                                setShowIconSelector(false);
                                            }}
                                            style={styles.iconButton}
                                        >
                                            <Icon name={icon} size={30} color="#666666" />
                                            <Text style={styles.iconText}>{icon}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </ScrollView>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={() => setShowIconSelector(false)}>Cancel</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
                <Portal>
                    <Dialog visible={showLocationDialog} onDismiss={() => setShowLocationDialog(false)}>
                        <Dialog.Title>Select Location</Dialog.Title>
                        <Dialog.Content>
                            <ScrollView>
                                {locations.map((loc, index) => (
                                    <List.Item
                                        key={index}
                                        title={loc}
                                        onPress={() => {
                                            setLocation(loc);
                                            setShowLocationDialog(false);
                                        }}
                                    />
                                ))}
                            </ScrollView>
                            <Button 
                                mode="contained" 
                                onPress={() => {
                                    setShowLocationDialog(false);
                                    setShowAddLocationDialog(true);
                                }}
                                style={{ marginTop: 10 }}
                            >
                                Add New Location
                            </Button>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={() => setShowLocationDialog(false)}>Cancel</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
                <Portal>
                    <Dialog visible={showAddLocationDialog} onDismiss={() => setShowAddLocationDialog(false)}>
                        <Dialog.Title>Add New Location</Dialog.Title>
                        <Dialog.Content>
                            <TextInput
                                label="Location Name"
                                value={newLocation}
                                onChangeText={setNewLocation}
                                mode="outlined"
                            />
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={() => setShowAddLocationDialog(false)}>Cancel</Button>
                            <Button 
                                mode="contained"
                                onPress={() => {
                                    if (newLocation.trim()) {
                                        setLocations([...locations, newLocation.trim()]);
                                        setLocation(newLocation.trim());
                                        setNewLocation('');
                                        setShowAddLocationDialog(false);
                                    }
                                }}
                            >
                                Add
                            </Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
                <RecurrenceDialog />
                {showEstimatedTimePicker && (
                    <DateTimePicker
                        value={estimatedTime}
                        mode="time"
                        is24Hour={false}
                        display="default"
                        onChange={(event, selectedTime) => {
                            setShowEstimatedTimePicker(false);
                            if (selectedTime) {
                                setEstimatedTime(selectedTime);
                            }
                        }}
                    />
                )}
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
            </ScrollView>
        </PaperProvider>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    card: {
        marginBottom: 16,
        elevation: 2,
    },
    input: {
        marginBottom: 16,
        backgroundColor: 'white',
    },
    sectionTitle: {
        marginTop: 8,
        marginBottom: 8,
        fontWeight: '500',
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginVertical: 8,
    },
    divider: {
        marginVertical: 8,
    },
    priorityContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    priorityButton: {
        width: 80,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
    },
    priorityButtonSelected: {
        borderWidth: 2,
        borderColor: 'white',
    },
    priorityText: {
        fontSize: 14,
        color: 'white',
    },
    priorityTextSelected: {
        fontWeight: 'bold',
    },
    attachmentItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
    },
    attachmentImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 8,
    },
    categoryIconsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 8,
    },
    categoryIcon: {
        marginRight: 4,
    },
    moreCategories: {
        fontSize: 12,
        color: '#333',
        marginLeft: 4,
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
    iconButton: {
        padding: 10,
        margin: 5,
        borderRadius: 5,
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
        width: 80,
        height: 80,
        justifyContent: 'center',
    },
    iconText: {
        fontSize: 10,
        marginTop: 5,
        textAlign: 'center',
    },
});