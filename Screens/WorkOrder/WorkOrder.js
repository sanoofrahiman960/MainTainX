import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image, Modal, TouchableOpacity } from 'react-native';
import { Header, Input, Button, Text, Icon, ListItem, ButtonGroup } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { BottomSheet } from '@rneui/themed';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';
import Navigation from '../../Navigation/Navigation';

export default function NewWorkOrder() {
    const navigation = useNavigation();

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
        { label: 'Daily', value: 'daily' },
        { label: 'Weekly', value: 'weekly' },
        { label: 'Monthly', value: 'monthly' },
        { label: 'Yearly', value: 'yearly' },
    ]);
    // Define state variables for each input field with initial values
    const [task, setTask] = useState('Fix broken equipment');
    const [description, setDescription] = useState('Replace worn-out parts and check for alignment issues.');
    const [priorityIndex, setPriorityIndex] = useState(0); // Index for selected priority
    const [imageUri, setImageUri] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [estimatedTime, setEstimatedTime] = useState("1h 0m");
    const [isPickerVisible, setPickerVisible] = useState(false);
    const [time, setTime] = useState(new Date(0));

    const [WorkTypeModal, SetWorkTypeModal] = useState(false)
    const [WorktypeValue, SetWorktypeValue] = useState('Reactive')

    const [timePickerVisible, setTimePickerVisible] = useState(false);
    const [selectedTime, setSelectedTime] = useState(new Date());
    const [timePickerVisibleStart, settimePickerVisibleStart] = useState(false);
    const [timePickerVisibleDue, settimePickerVisibleDue] = useState(false);

    const [startDate, setStartDate] = useState(new Date());
    const [startTime, setStartTime] = useState(new Date());
    const [dueDate, setDueDate] = useState(new Date());
    const [dueTime, setDueTime] = useState(new Date());

    // Control visibility of DateTimePicker modals
    const [isStartDatePickerVisible, setStartDatePickerVisible] = useState(false);
    const [isStartTimePickerVisible, setStartTimePickerVisible] = useState(false);
    const [isDueDatePickerVisible, setDueDatePickerVisible] = useState(false);
    const [isDueTimePickerVisible, setDueTimePickerVisible] = useState(false);

    // Handler to open picker modal
    const [recurrenceOpen, setRecurrenceOpen] = useState(false);
    const [recurrenceValue, setRecurrenceValue] = useState(null);
    const [recurrenceItems, setRecurrenceItems] = useState([
        { label: 'Daily', value: 'daily' },
        { label: 'Weekly', value: 'weekly' },
        { label: 'Monthly', value: 'monthly' },
        { label: 'Yearly', value: 'yearly' },
    ]);

    const [dayOpen, setDayOpen] = useState(false);
    const [dayValue, setDayValue] = useState([]);
    const days = [
        { label: 'Sunday', value: 'sunday' },
        { label: 'Monday', value: 'monday' },
        { label: 'Tuesday', value: 'tuesday' },
        { label: 'Wednesday', value: 'wednesday' },
        { label: 'Thursday', value: 'thursday' },
        { label: 'Friday', value: 'friday' },
        { label: 'Saturday', value: 'saturday' },
    ];

    const [weekOpen, setWeekOpen] = useState(false);
    const [weekValue, setWeekValue] = useState([]);
    const weeks = [
        { label: '1st Week', value: '1' },
        { label: '2nd Week', value: '2' },
        { label: '3rd Week', value: '3' },
        { label: '4th Week', value: '4' },
    ];

    const [monthOpen, setMonthOpen] = useState(false);
    const [monthValue, setMonthValue] = useState([]);
    const months = [
        { label: 'January', value: 'january' },
        { label: 'February', value: 'february' },
        { label: 'March', value: 'march' },
        { label: 'April', value: 'april' },
        { label: 'May', value: 'may' },
        { label: 'June', value: 'june' },
        { label: 'July', value: 'july' },
        { label: 'August', value: 'august' },
        { label: 'September', value: 'september' },
        { label: 'October', value: 'october' },
        { label: 'November', value: 'november' },
        { label: 'December', value: 'december' },
    ];

    const [yearOpen, setYearOpen] = useState(false);
    const [yearValue, setYearValue] = useState([]);
    const years = Array.from({ length: 10 }, (_, i) => ({
        label: `${new Date().getFullYear() + i}`,
        value: `${new Date().getFullYear() + i}`
    }));




    // Handler to update time and close picker
    const handleConfirm = (event, selectedTime) => {
        setPickerVisible(false);
        if (selectedTime) {
            setTime(selectedTime);
            let hours = selectedTime.getHours();
            let minutes = selectedTime.getMinutes();

            // Pad hours to 3 digits if necessary
            const formattedHours = hours.toString().padStart(3, '0'); // Ensures 3 digits (e.g., 005, 123, 1000)
            const formattedMinutes = minutes.toString().padStart(2, '0');
            setEstimatedTime(`${formattedHours}h ${formattedMinutes}m`);
        }
    };

    const handleTimeChange = (event, selectedDate) => {
        const currentDate = selectedDate || selectedTime;
        setTimePickerVisible(false);
        setSelectedTime(currentDate);
        const hours = currentDate.getHours();
        const minutes = currentDate.getMinutes();
        setEstimatedTime(`${hours}h ${minutes}m`);
    };


    const handleStartDateChange = (event, selectedDate) => {
        setStartDatePickerVisible(false);
        if (selectedDate) {
            setStartDate(selectedDate);
            setStartTimePickerVisible(true);  // Show time picker after date is selected
        }
    };

    const handleStartTimeChange = (event, selectedTime) => {
        setStartTimePickerVisible(false);
        if (selectedTime) setStartTime(selectedTime);
    };

    const handleDueDateChange = (event, selectedDate) => {
        setDueDatePickerVisible(false);
        if (selectedDate) {
            setDueDate(selectedDate);
            setDueTimePickerVisible(true);  // Show time picker after date is selected
        }
    };

    const handleDueTimeChange = (event, selectedTime) => {
        setDueTimePickerVisible(false);
        if (selectedTime) setDueTime(selectedTime);
    };




    // Priority options with colors and values
    const priorities = [
        { label: 'None', color: '#1E90FF', value: 0 },
        { label: 'Low', color: '#89e089', value: 1 },
        { label: 'Medium', color: '#e0cc60', value: 2 },
        { label: 'High', color: '#cc420e', value: 3 }
    ];

    WorkType = [
        { label: "Cycle Count", value: "1" },
        { label: "Others", value: "2" },
        { label: "Preventive", value: "3" },
        { label: "Reactive", value: "4" },
    ]


    const list = [
        {
            title: 'My Photos',
            onPress: () => {
                // Handle opening photo gallery
                handleImagePicker()
                // modalVisible(false);
            },
            icon: 'photo-library'
        },
        {
            title: 'Camera',
            onPress: () => {
                handleTakePhoto()

                // modalVisible(false);
            },
            icon: 'camera-alt'
        },
        {
            title: 'Cancel',
            onPress: () => modalVisible(false),
            containerStyle: { backgroundColor: '#f5f5f5', },
            titleStyle: { color: 'red' },
            icon: 'close'
        },
    ];


    const handleImagePicker = () => {
        const options = {
            mediaType: 'photo',
            quality: 1,
        };

        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.errorMessage) {
                console.error('ImagePicker Error: ', response.errorMessage);
            } else {
                const uri = response.assets[0].uri;
                setImageUri(uri);
                setModalVisible(false); // Close modal after selection
            }
        });
    };

    // Function to handle taking a new photo
    const handleTakePhoto = () => {
        const options = {
            mediaType: 'photo',
            quality: 1,
        };

        launchCamera(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled camera');
            } else if (response.errorMessage) {
                console.error('Camera Error: ', response.errorMessage);
            } else {
                const uri = response.assets[0].uri;
                setImageUri(uri);
                setModalVisible(false); // Close modal after taking a photo
            }
        });
    };







    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <Header
                leftComponent={{ text: 'Cancel', style: { color: '#1E90FF' }, onPress: () => navigation.goBack() }}
                centerComponent={{ text: 'New Work Order', style: { color: '#000', fontSize: 18, fontWeight: 'bold' } }}
                rightComponent={{ text: 'Create', style: { color: '#1E90FF' }, onPress: () => { } }}
                backgroundColor="transparent"
            />

            {/* Input Fields */}
            <Input
                placeholder="What needs to be done?"
                placeholderTextColor="#B0B0B0"
                inputContainerStyle={styles.inputContainer}
                value={task}
                onChangeText={setTask}
            />

            {/* Add Pictures Button */}
            <Button
                title="Add or take pictures"
                icon={<Icon name="camera" type="font-awesome" color="#1E90FF" />}
                buttonStyle={styles.addButton}
                titleStyle={styles.buttonText}
                type="outline"
                onPress={() => setModalVisible(true)} // Open modal
            />

            {imageUri && (
                <View style={styles.imageContainer}>
                    <Image source={{ uri: imageUri }} style={styles.image} />
                </View>
            )}

            {/* Description Field */}
            <Text style={styles.label}>Description</Text>
            <Input
                placeholder="Add a description"
                placeholderTextColor="#B0B0B0"
                multiline
                inputContainerStyle={styles.descriptionContainer}
                value={description}
                onChangeText={setDescription}
            />
            <Text style={styles.label}>Procedure</Text>
            <Button
                title="Add Procedure"
                icon={<Icon name="list" type="font-awesome" color="#1E90FF" />}
                buttonStyle={styles.addButton}
                titleStyle={styles.buttonText}
                type="outline"


                onPress={() => { navigation.navigate('Procedure') }}
            />

            {/* Priority Selector */}
            <Text style={styles.label}>Priority</Text>
            <ButtonGroup
                buttons={priorities.map(p => p.label)}
                selectedIndex={priorityIndex}
                onPress={(index) => setPriorityIndex(index)}
                containerStyle={styles.buttonGroup}
                selectedButtonStyle={{ backgroundColor: priorities[priorityIndex].color }}
                selectedTextStyle={styles.selectedText}
            />

            {/* List of other fields */}


            {/* <ListItem bottomDivider onPress={handleEstimatedTimePress}>
                <ListItem.Content>
                    <ListItem.Title>Estimated Time</ListItem.Title>
                </ListItem.Content>
                <ListItem.Subtitle>{estimatedTime}</ListItem.Subtitle>
            </ListItem> */}
            <ListItem bottomDivider onPress={() => setTimePickerVisible(true)}>
                <ListItem.Content>
                    <ListItem.Title>Estimated Time</ListItem.Title>
                </ListItem.Content>
                <ListItem.Subtitle>{estimatedTime}</ListItem.Subtitle>
            </ListItem>

            <ListItem bottomDivider>
                <ListItem.Content>
                    <ListItem.Title>Assign to</ListItem.Title>
                </ListItem.Content>
                <ListItem.Subtitle>Choose</ListItem.Subtitle>
            </ListItem>



            <ListItem bottomDivider onPress={() => setStartDatePickerVisible(true)}>
                <ListItem.Content>
                    <ListItem.Title>Start Date & Time</ListItem.Title>
                </ListItem.Content>
                <ListItem.Subtitle>
                    {`${startDate.toLocaleDateString()} ${startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}`}
                </ListItem.Subtitle>
            </ListItem>

            <ListItem bottomDivider onPress={() => setDueDatePickerVisible(true)}>
                <ListItem.Content>
                    <ListItem.Title>Due Date & Time</ListItem.Title>
                </ListItem.Content>
                <ListItem.Subtitle>
                    {`${dueDate.toLocaleDateString()} ${dueTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}`}
                </ListItem.Subtitle>
            </ListItem>

            {/* Render DateTimePicker modals */}
            {isStartDatePickerVisible && (
                <DateTimePicker
                    value={startDate}
                    mode="date"
                    display="default"
                    onChange={handleStartDateChange}
                />
            )}
            {isStartTimePickerVisible && (
                <DateTimePicker
                    value={startTime}
                    mode="time"
                    display="default"
                    onChange={handleStartTimeChange}
                />
            )}
            {isDueDatePickerVisible && (
                <DateTimePicker
                    value={dueDate}
                    mode="date"
                    display="default"
                    onChange={handleDueDateChange}
                />
            )}
            {isDueTimePickerVisible && (
                <DateTimePicker
                    value={dueTime}
                    mode="time"
                    display="default"
                    onChange={handleDueTimeChange}
                />
            )}


            <ListItem bottomDivider>
                <ListItem.Content>
                    <ListItem.Title>Recurrence</ListItem.Title>
                </ListItem.Content>
                <ListItem.Subtitle>Set</ListItem.Subtitle>
            </ListItem>
            <DropDownPicker
                open={recurrenceOpen}
                value={recurrenceValue}
                items={recurrenceItems}
                setOpen={setRecurrenceOpen}
                setValue={setRecurrenceValue}
                setItems={setRecurrenceItems}
                placeholder="Select recurrence"
                containerStyle={styles.dropdownContainer}
                onChangeValue={(value) => {
                    setDayOpen(false);
                    setWeekOpen(false);
                    setMonthOpen(false);
                    setYearOpen(false);
                }}
            />

            {recurrenceValue === 'daily' && (
                <DropDownPicker
                    open={dayOpen}
                    value={dayValue}
                    items={days}
                    multiple={true}
                    min={1}
                    max={7}
                    setOpen={setDayOpen}
                    setValue={setDayValue}
                    placeholder="Select days of the week"
                    containerStyle={styles.dropdownContainer}
                />
            )}

            {recurrenceValue === 'weekly' && (
                <DropDownPicker
                    open={weekOpen}
                    value={weekValue}
                    items={weeks}
                    multiple={true}
                    min={1}
                    max={4}
                    setOpen={setWeekOpen}
                    setValue={setWeekValue}
                    placeholder="Select weeks"
                    containerStyle={styles.dropdownContainer}
                />
            )}

            {recurrenceValue === 'monthly' && (
                <DropDownPicker
                    open={monthOpen}
                    value={monthValue}
                    items={months}
                    multiple={true}
                    min={1}
                    max={12}
                    setOpen={setMonthOpen}
                    setValue={setMonthValue}
                    placeholder="Select months"
                    containerStyle={styles.dropdownContainer}
                />
            )}

            {recurrenceValue === 'yearly' && (
                <DropDownPicker
                    open={yearOpen}
                    value={yearValue}
                    items={years}
                    multiple={true}
                    min={1}
                    max={10}
                    setOpen={setYearOpen}
                    setValue={setYearValue}
                    placeholder="Select years"
                    containerStyle={styles.dropdownContainer}
                />
            )}


            <ListItem bottomDivider onPress={() => { SetWorkTypeModal(true) }}>
                <ListItem.Content>
                    <ListItem.Title>Work Type</ListItem.Title>
                </ListItem.Content>
                <ListItem.Subtitle>{WorktypeValue}</ListItem.Subtitle>
            </ListItem>

            <ListItem bottomDivider>
                <ListItem.Content>
                    <ListItem.Title>Location</ListItem.Title>
                </ListItem.Content>
                <TouchableOpacity onPress={()=>navigation.navigate('Assets',{tab:"Location"})}>
                <ListItem.Subtitle>Assign Location</ListItem.Subtitle>
                </TouchableOpacity>
            </ListItem>

            <ListItem bottomDivider>
                <ListItem.Content>
                    <ListItem.Title>Asset</ListItem.Title>
                </ListItem.Content>
                <TouchableOpacity onPress={()=>navigation.navigate('Assets',{tab:"Asset"})}>
                <ListItem.Subtitle>Assign Asset</ListItem.Subtitle>
                </TouchableOpacity>
            </ListItem>

            <ListItem bottomDivider>
                <ListItem.Content>
                    <ListItem.Title>Parts Needed</ListItem.Title>
                </ListItem.Content>
                <ListItem.Subtitle>Add Parts</ListItem.Subtitle>
            </ListItem>

            <ListItem bottomDivider>
                <ListItem.Content>
                    <ListItem.Title>Categories</ListItem.Title>
                </ListItem.Content>
                <ListItem.Subtitle>Add Categories</ListItem.Subtitle>
            </ListItem>

            <ListItem bottomDivider>
                <ListItem.Content>
                    <ListItem.Title>Files</ListItem.Title>
                </ListItem.Content>
                <ListItem.Subtitle>Attach</ListItem.Subtitle>
            </ListItem>

            <ListItem bottomDivider>
                <ListItem.Content>
                    <ListItem.Title>Vendors</ListItem.Title>
                </ListItem.Content>
                <ListItem.Subtitle>Add Vendors</ListItem.Subtitle>
            </ListItem>
            {timePickerVisible && (
                <DateTimePicker
                    value={selectedTime}
                    mode="time"
                    is24Hour={true}
                    display="default"
                    onChange={handleTimeChange}
                />
            )}
            {timePickerVisibleStart && (
                <DateTimePicker
                    value={startTime}
                    mode="time"
                    is24Hour={true}
                    display="default"
                    onChange={handleStartTimeChange}
                />
            )}

            {/* Due Time DateTime Picker */}
            {timePickerVisibleDue && (
                <DateTimePicker
                    value={dueTime}
                    mode="time"
                    is24Hour={true}
                    display="default"
                    onChange={handleDueTimeChange}
                />
            )}

            {isPickerVisible && (
                <DateTimePicker
                    value={time}
                    mode="time"
                    is24Hour={true}
                    display="spinner"
                    onChange={handleConfirm}
                />
            )}
            <BottomSheet isVisible={modalVisible} onBackdropPress={() => setModalVisible(false)} >
                {list.map((item, index) => (
                    <View style={{ backgroundColor: "red", }}>
                        <ListItem key={index} onPress={item.onPress} containerStyle={item.containerStyle}>
                            <Icon name={item.icon} type="material" color="#1E90FF" />
                            <ListItem.Content>
                                <ListItem.Title style={item.titleStyle}>{item.title}</ListItem.Title>
                            </ListItem.Content>
                        </ListItem>
                    </View>
                ))}
            </BottomSheet>
            <BottomSheet isVisible={WorkTypeModal} onBackdropPress={() => setModalVisible(false)} >
                {WorkType.map((item, index) => (
                    <View style={{ backgroundColor: "red", }}>
                        <ListItem key={index} onPress={() => {
                            SetWorktypeValue(item.label)
                            SetWorkTypeModal(false)
                        }} containerStyle={item.containerStyle}>
                            <Icon name={item.icon} type="material" color="#1E90FF" />
                            <ListItem.Content>
                                <ListItem.Title style={item.titleStyle}>{item.label}</ListItem.Title>
                            </ListItem.Content>
                        </ListItem>
                    </View>
                ))}
            </BottomSheet>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        backgroundColor: '#FFFFFF',
    },
    inputContainer: {
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        marginBottom: 10,
    },
    addButton: {
        borderColor: '#1E90FF',
        backgroundColor: '#E6F5FF',
        borderRadius: 5,
        marginVertical: 10,
    },
    buttonText: {
        color: '#1E90FF',
        marginLeft: 8,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
        color: '#333',
    },
    descriptionContainer: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 5,
        padding: 8,
    },
    buttonGroup: {
        marginVertical: 10,
        borderRadius: 5,
    },
    selectedText: {
        color: '#fff',
    },
    imageContainer: {
        alignItems: 'center',
        marginVertical: 10,
    },
    image: {
        width: 200,
        height: 200,
        borderRadius: 10,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: 300,
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    modalButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        width: '100%',
    },
    modalIcon: {
        marginRight: 10,
    },
    modalButtonText: {
        fontSize: 16,
        color: '#1E90FF',
    },
    cancelButton: {
        marginTop: 15,
        borderColor: '#1E90FF',
        borderWidth: 1,
        backgroundColor: 'transparent',
    },
    buttonGroup: {
        marginVertical: 10,
        borderRadius: 5,
    },
});
