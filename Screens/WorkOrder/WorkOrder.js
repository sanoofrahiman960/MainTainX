// import React, { useState } from 'react';
// import { View, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import { format } from 'date-fns';
// import {useDispatch,useSelector} from 'react-redux'
// import {
//     Provider as PaperProvider,
//     Appbar,
//     TextInput,
//     Button,
//     List,
//     Divider,
//     Surface,
//     Portal,
//     Dialog,
//     SegmentedButtons,
//     IconButton,
//     Card,
//     Text,
//     Badge,
//     Menu
// } from 'react-native-paper';
// import { addWorkOrder } from '../../redux/actions/workOrderAction';

// export default function NewWorkOrder() {
//     const navigation = useNavigation();
//     const locations = useSelector(state => state.locations.locations);
//     const assets = useSelector(state => state.assets.assets);
//     // State variables
//     const [task, setTask] = useState('');
//     const [description, setDescription] = useState('');
//     const [priorityIndex, setPriorityIndex] = useState(0);
//     const [imageUri, setImageUri] = useState(null);
//     const [estimatedTime, setEstimatedTime] = useState(new Date());
//     const [attachments, setAttachments] = useState([]);
//     const [workType, setWorkType] = useState('');
//     const [assignedTo, setAssignedTo] = useState('');
//     const [location, setLocation] = useState('');
//     const [asset, setAsset] = useState('');
//     const [categories, setCategories] = useState([]);
//     const [vendors, setVendors] = useState([]);

//     // Menu visibility states
//     // const [showWorkTypeMenu, setShowWorkTypeMenu] = useState(false);
//     // const [showCategoriesMenu, setShowCategoriesMenu] = useState(false);
//     // const [showVendorsMenu, setShowVendorsMenu] = useState(false);
//     // const [showAddCategory, setShowAddCategory] = useState(false);
//     // const [showIconSelector, setShowIconSelector] = useState(false);
//     // const [newCategory, setNewCategory] = useState('');
//     // const [newCategoryIcon, setNewCategoryIcon] = useState('');

//     // Date and time states
//     const [startDate, setStartDate] = useState(new Date());
//     const [dueDate, setDueDate] = useState(new Date());
//     const [showStartDatePicker, setShowStartDatePicker] = useState(false);
//     const [showDueDatePicker, setShowDueDatePicker] = useState(false);
//     const [showEstimatedTimePicker, setShowEstimatedTimePicker] = useState(false);
//     const [showWorkTypeMenu, setShowWorkTypeMenu] = useState(false);

//     const [showLocationMenu, setShowLocationMenu] = useState(false);
//     const [showAssetMenu, setShowAssetMenu] = useState(false);

//     // Recurrence states
//     const [recurrenceType, setRecurrenceType] = useState(null);
//     const [recurrenceInterval, setRecurrenceInterval] = useState(1);
//     const [selectedDays, setSelectedDays] = useState([]);
//     const [monthDay, setMonthDay] = useState(1);
//     const [showRecurrenceDialog, setShowRecurrenceDialog] = useState(false);
//     const [recurrenceEndDate, setRecurrenceEndDate] = useState(new Date());
//     const [showEndDatePicker, setShowEndDatePicker] = useState(false);
//     const dispatch = useDispatch()
//     // Sample data
//     const workTypes = ['Preventive', 'Reactive', 'Others', 'Cycle Count'];
//     const [categoryOptions, setCategoryOptions] = useState([
//         { id: '1', label: 'Damage', icon: 'alert-circle' },
//         { id: '2', label: 'Electrical', icon: 'flash' },
//         { id: '3', label: 'Plumbing', icon: 'water-pump' },
//         { id: '4', label: 'Mechanical', icon: 'wrench' },
//         { id: '5', label: 'General', icon: 'tools' }
//     ]);
//     const vendorOptions = ['Vendor A', 'Vendor B', 'Vendor C', 'Vendor D'];
//     const priorities = [
//         { label: 'Low', value: 0, color: '#4CAF50' },
//         { label: 'Medium', value: 1, color: '#FFC107' },
//         { label: 'High', value: 2, color: '#F44336' },
//         { label: 'Critical', value: 3, color: '#800000' }
//     ];
//     const weekDays = [
//         { label: 'Sun', value: 'SUN' },
//         { label: 'Mon', value: 'MON' },
//         { label: 'Tue', value: 'TUE' },
//         { label: 'Wed', value: 'WED' },
//         { label: 'Thu', value: 'THU' },
//         { label: 'Fri', value: 'FRI' },
//         { label: 'Sat', value: 'SAT' },
//     ];

//     // Functions
//     const handleAttachment = (type) => {
//         const options = {
//             mediaType: type === 'photo' ? 'photo' : 'mixed',
//             quality: 0.8,
//             selectionLimit: 0,
//         };

//         const launcher = type === 'photo' ? launchCamera : launchImageLibrary;
//         launcher(options, (response) => {
//             if (!response.didCancel && !response.error) {
//                 const newAttachments = response.assets.map(asset => ({
//                     ...asset,
//                     type: type === 'photo' ? 'photo' : 'file'
//                 }));
//                 setAttachments([...attachments, ...newAttachments]);
//             }
//         });
//     };

//     const removeAttachment = (index) => {
//         const newAttachments = [...attachments];
//         newAttachments.splice(index, 1);
//         setAttachments(newAttachments);
//     };

//     const handleRecurrenceTypeChange = (type) => {
//         setRecurrenceType(type);
//         setRecurrenceInterval(1);
//         setSelectedDays([]);
//         setMonthDay(1);
//     };

//     const generateRecurringDates = () => {
//         if (!recurrenceType) return [];
//         const dates = [];
//         let currentDate = new Date(startDate);
//         while (currentDate <= recurrenceEndDate) {
//             switch (recurrenceType) {
//                 case 'daily':
//                     if (selectedDays.length === 0) {
//                         dates.push(new Date(currentDate));
//                         currentDate.setDate(currentDate.getDate() + recurrenceInterval);
//                     } else {
//                         if (selectedDays.includes(format(currentDate, 'EEE').toUpperCase())) {
//                             dates.push(new Date(currentDate));
//                         }
//                         currentDate.setDate(currentDate.getDate() + 1);
//                     }
//                     break;
//                 case 'weekly':
//                     dates.push(new Date(currentDate));
//                     currentDate.setDate(currentDate.getDate() + (recurrenceInterval * 7));
//                     break;
//                 case 'monthly':
//                     if (currentDate.getDate() === monthDay) {
//                         dates.push(new Date(currentDate));
//                     }
//                     currentDate.setMonth(currentDate.getMonth() + recurrenceInterval);
//                     currentDate.setDate(monthDay);
//                     break;
//                 case 'yearly':
//                     dates.push(new Date(currentDate));
//                     currentDate.setFullYear(currentDate.getFullYear() + recurrenceInterval);
//                     break;
//             }
//         }
//         return dates;
//     };

//     // Component rendering
//     const RecurrenceDialog = () => (
//         <Portal>
//             <Dialog visible={showRecurrenceDialog} onDismiss={() => setShowRecurrenceDialog(false)}>
//                 <Dialog.Title>Set Recurrence</Dialog.Title>
//                 <Dialog.Content>
//                     <SegmentedButtons
//                         value={recurrenceType}
//                         onValueChange={handleRecurrenceTypeChange}
//                         buttons={[
//                             { value: 'daily', label: 'Daily' },
//                             { value: 'weekly', label: 'Weekly' },
//                             { value: 'monthly', label: 'Monthly' },
//                             { value: 'yearly', label: 'Yearly' },
//                         ]}
//                     />

//                     {recurrenceType && (
//                         <Surface style={styles.recurrenceOptions} elevation={0}>
//                             <Text variant="bodyLarge">Repeat every:</Text>
//                             <View style={styles.intervalContainer}>
//                                 <TextInput
//                                     mode="outlined"
//                                     keyboardType="number-pad"
//                                     value={recurrenceInterval.toString()}
//                                     onChangeText={(text) => setRecurrenceInterval(parseInt(text) || 1)}
//                                     style={styles.intervalInput}
//                                 />
//                                 <Text variant="bodyLarge" style={styles.intervalLabel}>
//                                     {recurrenceType === 'daily' ? 'day(s)' :
//                                      recurrenceType === 'weekly' ? 'week(s)' :
//                                      recurrenceType === 'monthly' ? 'month(s)' : 'year(s)'}
//                                 </Text>
//                             </View>
//                             {recurrenceType === 'daily' && (
//                                 <View style={styles.daysContainer}>
//                                     <Text variant="bodyLarge">Or select specific days:</Text>
//                                     <View style={styles.daysGrid}>
//                                         {weekDays.map((day) => (
//                                             <Button
//                                                 key={day.value}
//                                                 mode={selectedDays.includes(day.value) ? 'contained' : 'outlined'}
//                                                 onPress={() => {
//                                                     setSelectedDays(
//                                                         selectedDays.includes(day.value)
//                                                             ? selectedDays.filter(d => d !== day.value)
//                                                             : [...selectedDays, day.value]
//                                                     );
//                                                 }}
//                                                 style={styles.dayButton}
//                                             >
//                                                 {day.label}
//                                             </Button>
//                                         ))}
//                                     </View>
//                                 </View>
//                             )}
//                             {recurrenceType === 'monthly' && (
//                                 <View style={styles.monthDayContainer}>
//                                     <Text variant="bodyLarge">On day:</Text>
//                                     <TextInput
//                                         mode="outlined"
//                                         keyboardType="number-pad"
//                                         value={monthDay.toString()}
//                                         onChangeText={(text) => {
//                                             const day = parseInt(text) || 1;
//                                             setMonthDay(Math.min(Math.max(day, 1), 31));
//                                         }}
//                                         style={styles.monthDayInput}
//                                     />
//                                 </View>
//                             )}
//                             <Button
//                                 mode="outlined"
//                                 onPress={() => setShowEndDatePicker(true)}
//                                 style={styles.endDateButton}
//                             >
//                                 End Date: {format(recurrenceEndDate, 'MMM d, yyyy')}
//                             </Button>
//                         </Surface>
//                     )}
//                 </Dialog.Content>
//                 <Dialog.Actions>
//                     <Button onPress={() => setShowRecurrenceDialog(false)}>Cancel</Button>
//                     <Button onPress={() => {
//                         setShowRecurrenceDialog(false);
//                         // Additional logic to save recurrence settings
//                     }}>Save</Button>
//                 </Dialog.Actions>
//             </Dialog>
//         </Portal>
//     );

//     return (
//         <PaperProvider>
//             <ScrollView style={styles.scrollView}>
//                 <Appbar.Header>
//                     <Appbar.BackAction onPress={() => navigation.goBack()} />
//                     <Appbar.Content onPress={() => alert(assets.id)} title="New Work Order" />
//                     <Appbar.Action icon="check" onPress={() => {
//                         // Handle work order creation
//                         // const dates = generateRecurringDates();
//                         // alert(task)
//                         const newWorkOrder = {
//                                 id: Date.now().toString(),
//                                 task,
//                                 description,
//                                 workType,
//                                 assignedTo,
//                                 location,
//                                 asset,
//                                 categories,
//                                 vendors,
//                                 priority: priorities[priorityIndex].label,
//                                 // estimatedTime,
//                                 attachments,
//                                 // startDate,
//                                 // dueDate,
//                                 status: 'Open',
//                                 imageUri,
//                                 recurrence: recurrenceType ? {
//                                     type: recurrenceType,
//                                     interval: recurrenceInterval,
//                                     selectedDays: selectedDays,
//                                     monthDay: monthDay,
//                                     endDate: recurrenceEndDate,
//                                 } : undefined,
//                             };

//                             dispatch(addWorkOrder(newWorkOrder));
//                             navigation.navigate('WorkOrderDetails');

//                         // navigation.goBack();
//                     }} />
//                 </Appbar.Header>
//                 <Card style={styles.card}>
//                     <Card.Content>
//                         <TextInput
//                             label="Task"
//                             value={task}
//                             onChangeText={setTask}
//                             mode="outlined"
//                             style={styles.input}
//                         />
//                         <TextInput
//                             label="Description"
//                             value={description}
//                             onChangeText={setDescription}
//                             mode="outlined"
//                             multiline
//                             numberOfLines={3}
//                             style={styles.input}
//                         />
//                         <List.Item
//                             title="Work Type"
//                             description={workType || "Select work type"}
//                             onPress={() => setShowWorkTypeMenu(true)}
//                             right={props => <List.Icon {...props} icon="chevron-right" />}
//                         />
//                         <Divider style={styles.divider} />
//                         <TextInput
//                             label="Assign To"
//                             value={assignedTo}
//                             onChangeText={setAssignedTo}
//                             mode="outlined"
//                             style={styles.input}
//                         />
//                          <Menu
//                             visible={showLocationMenu}
//                             onDismiss={() => setShowLocationMenu(false)}
//                             anchor={
//                                 <List.Item
//                                     title="Location"
//                                     description={location || "Select location"}
//                                     onPress={() => setShowLocationMenu(true)}
//                                     right={props => <List.Icon {...props} icon="chevron-down" />}
//                                 />
//                             }
//                         >
//                             {locations.map((loc) => (
//                                 <Menu.Item
//                                     key={loc.id}
//                                     onPress={() => {
//                                         setLocation(loc.name);
//                                         setShowLocationMenu(false);
//                                     }}
//                                     title={loc.name}
//                                 />
//                             ))}
//                         </Menu>

//                         <Divider style={styles.divider} />

//                         <Menu
//                             visible={showAssetMenu}
//                             onDismiss={() => setShowAssetMenu(false)}
//                             anchor={
//                                 <List.Item
//                                     title="Asset"
//                                     description={asset || "Select asset"}
//                                     onPress={() => setShowAssetMenu(true)}
//                                     right={props => <List.Icon {...props} icon="chevron-down" />}
//                                 />
//                             }
//                         >
//                             {assets.map((ast) => (
//                                 <Menu.Item
//                                     key={ast.id}
//                                     onPress={() => {
//                                         setAsset(ast.task);
//                                         setShowAssetMenu(false);
//                                     }}
//                                     title={ast.task}
//                                 />
//                             ))}
//                         </Menu>
//                         <List.Item
//                             title="Categories"
//                             description={categories.length > 0 ?
//                                 categoryOptions
//                                     .filter(cat => categories.includes(cat.label))
//                                     .map(cat => cat.label)
//                                     .join(', ')
//                                 : "Select categories"
//                             }
//                             onPress={() => setShowCategoriesMenu(true)}
//                             right={props => (
//                                 <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//                                     {categories.length > 0 && (
//                                         <View style={styles.categoryIconsContainer}>
//                                             {categoryOptions
//                                                 .filter(cat => categories.includes(cat.label))
//                                                 .slice(0, 3)
//                                                 .map((cat, index) => (
//                                                     <List.Icon
//                                                         key={cat.id}
//                                                         icon={cat.icon}
//                                                         style={styles.categoryIcon}
//                                                     />
//                                                 ))
//                                             }
//                                             {categories.length > 3 && (
//                                                 <Text style={styles.moreCategories}>
//                                                     +{categories.length - 3}
//                                                 </Text>
//                                             )}
//                                         </View>
//                                     )}
//                                     <List.Icon {...props} icon="chevron-right" />
//                                 </View>
//                             )}
//                         />
//                         <Divider style={styles.divider} />
//                         <List.Item
//                             title="Vendors"
//                             description={vendors.length > 0 ? vendors.join(', ') : "Add vendors"}
//                             onPress={() => setShowVendorsMenu(true)}
//                             right={props => <List.Icon {...props} icon="chevron-right" />}
//                         />
//                         <Divider style={styles.divider} />
//                         <Text variant="titleMedium" style={styles.sectionTitle}>Priority</Text>
//                         <View style={styles.priorityContainer}>
//                             {priorities.map((priority, index) => (
//                                 <TouchableOpacity
//                                     key={index}
//                                     style={[
//                                         styles.priorityButton,
//                                         { backgroundColor: priority.color },
//                                         priorityIndex === priority.value && styles.priorityButtonSelected
//                                     ]}
//                                     onPress={() => setPriorityIndex(priority.value)}
//                                 >
//                                     <Text style={[
//                                         styles.priorityText,
//                                         priorityIndex === priority.value && styles.priorityTextSelected
//                                     ]}>
//                                         {priority.label}
//                                     </Text>
//                                 </TouchableOpacity>
//                             ))}
//                         </View>
//                         <List.Item
//                             title="Estimated Time"
//                             description={format(estimatedTime, 'hh:mm a')}
//                             onPress={() => setShowEstimatedTimePicker(true)}
//                             right={props => <List.Icon {...props} icon="clock-outline" />}
//                         />
//                         <Divider style={styles.divider} />
//                         <List.Item
//                             title="Attachments"
//                             description={`${attachments.length} items attached`}
//                             right={props => (
//                                 <View style={{ flexDirection: 'row' }}>
//                                     <IconButton
//                                         icon="camera"
//                                         onPress={() => handleAttachment('photo')}
//                                     />
//                                     <IconButton
//                                         icon="file-plus"
//                                         onPress={() => handleAttachment('file')}
//                                     />
//                                 </View>
//                             )}
//                         />
//                         {attachments.length > 0 && (
//                             <Card style={styles.card}>
//                                 <Card.Content>
//                                     {attachments.map((attachment, index) => (
//                                         <View key={index}>
//                                             {attachment.type === 'photo' ? (
//                                                 <View style={styles.attachmentItem}>
//                                                     <Image
//                                                         source={{ uri: attachment.uri }}
//                                                         style={styles.attachmentImage}
//                                                     />
//                                                     <IconButton
//                                                         icon="delete"
//                                                         onPress={() => removeAttachment(index)}
//                                                     />
//                                                 </View>
//                                             ) : (
//                                                 <List.Item
//                                                     title={attachment.fileName || `File ${index + 1}`}
//                                                     description={`${Math.round(attachment.fileSize / 1024)} KB`}
//                                                     left={props => <List.Icon {...props} icon="file" />}
//                                                     right={props => (
//                                                         <IconButton
//                                                             icon="delete"
//                                                             onPress={() => removeAttachment(index)}
//                                                         />
//                                                     )}
//                                                 />
//                                             )}
//                                             {index < attachments.length - 1 && <Divider />}
//                                         </View>
//                                     ))}
//                                 </Card.Content>
//                             </Card>
//                         )}
//                         <List.Item
//                             title="Recurrence"
//                             description={recurrenceType ? `${recurrenceInterval} ${recurrenceType}(s)` : 'Not set'}
//                             onPress={() => setShowRecurrenceDialog(true)}
//                             right={props => (
//                                 <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//                                     {recurrenceType && (
//                                         <IconButton
//                                             {...props}
//                                             icon="close"
//                                             onPress={(e) => {
//                                                 e.stopPropagation();
//                                                 setRecurrenceType(null);
//                                                 setRecurrenceInterval(1);
//                                                 setSelectedDays([]);
//                                                 setMonthDay(1);
//                                                 setRecurrenceEndDate(new Date());
//                                             }}
//                                         />
//                                     )}
//                                     <List.Icon {...props} icon="calendar-range" />
//                                 </View>
//                             )}
//                         />
//                         <Divider style={styles.divider} />
//                         <List.Item
//                             title="Start Date"
//                             description={format(startDate, 'MMM d, yyyy')}
//                             onPress={() => setShowStartDatePicker(true)}
//                             right={props => <List.Icon {...props} icon="calendar-range" />}
//                         />
//                         <Divider style={styles.divider} />
//                         <List.Item
//                             title="Due Date"
//                             description={format(dueDate, 'MMM d, yyyy')}
//                             onPress={() => setShowDueDatePicker(true)}
//                             right={props => <List.Icon {...props} icon="calendar-range" />}
//                         />
//                         <Divider style={styles.divider} />
//                         <List.Item
//                             title="Add Photo"
//                             description={imageUri ? "Photo added" : "Take or choose a photo"}
//                             onPress={() => handleAttachment('photo')}
//                             right={props => <List.Icon {...props} icon="camera" />}
//                         />
//                     </Card.Content>
//                 </Card>
//                 {imageUri && (
//                     <Card style={styles.card}>
//                         <Card.Content>
//                             <Image
//                                 source={{ uri: imageUri }}
//                                 style={styles.image}
//                                 resizeMode="cover"
//                             />
//                             <Button
//                                 icon="delete"
//                                 mode="contained"
//                                 onPress={() => setImageUri(null)}
//                                 style={{ marginTop: 8 }}
//                             >
//                                 Remove Photo
//                             </Button>
//                         </Card.Content>
//                     </Card>
//                 )}
//                 <RecurrenceDialog />
//                 {showEstimatedTimePicker && (
//                     <DateTimePicker
//                         value={estimatedTime}
//                         mode="time"
//                         is24Hour={false}
//                         display="default"
//                         onChange={(event, selectedTime) => {
//                             setShowEstimatedTimePicker(false);
//                             if (selectedTime) {
//                                 setEstimatedTime(selectedTime);
//                             }
//                         }}
//                     />
//                 )}
//                 {showStartDatePicker && (
//                     <DateTimePicker
//                         value={startDate}
//                         mode="date"
//                         display="default"
//                         onChange={(event, selectedDate) => {
//                             setShowStartDatePicker(false);
//                             if (selectedDate) setStartDate(selectedDate);
//                         }}
//                     />
//                 )}
//                 {showDueDatePicker && (
//                     <DateTimePicker
//                         value={dueDate}
//                         mode="date"
//                         display="default"
//                         onChange={(event, selectedDate) => {
//                             setShowDueDatePicker(false);
//                             if (selectedDate) setDueDate(selectedDate);
//                         }}
//                     />
//                 )}
//                 {showEndDatePicker && (
//                     <DateTimePicker
//                         value={recurrenceEndDate}
//                         mode="date"
//                         display="default"
//                         onChange={(event, selectedDate) => {
//                             setShowEndDatePicker(false);
//                             if (selectedDate) setRecurrenceEndDate(selectedDate);
//                         }}
//                         minimumDate={new Date()}
//                     />
//                 )}
//             </ScrollView>
//         </PaperProvider>
//     );
// }

// const styles = StyleSheet.create({
//     scrollView: {
//         flex: 1,
//         backgroundColor: '#FFFFFF',
//     },
//     card: {
//         marginBottom: 16,
//         elevation: 2,
//     },
//     input: {
//         marginBottom: 16,
//         backgroundColor: 'white',
//     },
//     sectionTitle: {
//         marginTop: 8,
//         marginBottom: 8,
//         fontWeight: '500',
//     },
//     image: {
//         width: '100%',
//         height: 200,
//         borderRadius: 8,
//         marginVertical: 8,
//     },
//     divider: {
//         marginVertical: 8,
//     },
//     priorityContainer: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         marginBottom: 16,
//     },
//     priorityButton: {
//         width: 80,
//         height: 40,
//         justifyContent: 'center',
//         alignItems: 'center',
//         borderRadius: 8,
//     },
//     priorityButtonSelected: {
//         borderWidth: 2,
//         borderColor: 'white',
//     },
//     priorityText: {
//         fontSize: 14,
//         color: 'white',
//     },
//     priorityTextSelected: {
//         fontWeight: 'bold',
//     },
//     attachmentItem: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         paddingVertical: 10,
//     },
//     attachmentImage: {
//         width: 80,
//         height: 80,
//         borderRadius: 8,
//         marginRight: 8,
//     },
//     categoryIconsContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginRight: 8,
//     },
//     categoryIcon: {
//         marginRight: 4,
//     },
//     moreCategories: {
//         fontSize: 12,
//         color: '#333',
//         marginLeft: 4,
//     },
//     recurrenceOptions: {
//         padding: 16,
//         marginTop: 16,
//     },
//     intervalContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginTop: 8,
//     },
//     intervalInput: {
//         width: 60,
//         marginRight: 8,
//     },
//     intervalLabel: {
//         flex: 1,
//     },
//     daysContainer: {
//         marginTop: 16,
//     },
//     daysGrid: {
//         flexDirection: 'row',
//         flexWrap: 'wrap',
//         marginTop: 8,
//     },
//     dayButton: {
//         margin: 4,
//     },
//     monthDayContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginTop: 16,
//     },
//     monthDayInput: {
//         width: 60,
//         marginLeft: 8,
//     },
//     endDateButton: {
//         marginTop: 16,
//     },
// });

import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import {format} from 'date-fns';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useDispatch, useSelector} from 'react-redux';
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
  Menu,
} from 'react-native-paper';
import {addWorkOrder} from '../../redux/actions/workOrderAction';
import {EstimatedTimeModal} from '../../Modals/EstimateTime';
import { WorkTypeModal } from '../../Modals/WorkType';

export default function NewWorkOrder() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const locations = useSelector(state => state.locations.locations);
  const assets = useSelector(state => state.assets.assets);

  const [isModalVisible, setIsModalVisible] = useState(false);
  // const [estimatedTime, setEstimatedTime] = useState({ hours: 1, minutes: 0 });

  const handleSave = (hours, minutes) => {
    setEstimatedTime({hours, minutes});
  };
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
  const [vendors, setVendors] = useState([]);

  // Date and time states
  const [startDate, setStartDate] = useState(new Date());
  const [dueDate, setDueDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showDueDatePicker, setShowDueDatePicker] = useState(false);
  const [showEstimatedTimePicker, setShowEstimatedTimePicker] = useState(false);

  // Menu visibility states
  const [showWorkTypeMenu, setShowWorkTypeMenu] = useState(false);
  const [showLocationMenu, setShowLocationMenu] = useState(false);
  const [showAssetMenu, setShowAssetMenu] = useState(false);
  const [showCategoriesMenu, setShowCategoriesMenu] = useState(false);
  const [showVendorsMenu, setShowVendorsMenu] = useState(false);

  // Recurrence states
  const [recurrenceType, setRecurrenceType] = useState(null);
  const [recurrenceInterval, setRecurrenceInterval] = useState(1);
  const [selectedDays, setSelectedDays] = useState([]);
  const [monthDay, setMonthDay] = useState(1);
  const [showRecurrenceDialog, setShowRecurrenceDialog] = useState(false);
  const [recurrenceEndDate, setRecurrenceEndDate] = useState(new Date());
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [isWorkTypeModalVisible, setWorkTypeModalVisible] = useState(false);
  // Sample data
  const workTypes = ['Preventive', 'Reactive', 'Others', 'Cycle Count'];
  const [categoryOptions, setCategoryOptions] = useState([
    {id: '1', label: 'Damage', icon: 'alert-circle'},
    {id: '2', label: 'Electrical', icon: 'flash'},
    {id: '3', label: 'Plumbing', icon: 'water-pump'},
    {id: '4', label: 'Mechanical', icon: 'wrench'},
    {id: '5', label: 'General', icon: 'tools'},
  ]);
  const vendorOptions = ['Vendor A', 'Vendor B', 'Vendor C', 'Vendor D'];
  const priorities = [
    {label: 'None', value: 0, color: '#BDBDBD'},
    {label: 'Low', value: 1, color: '#4CAF50'},
    {label: 'Medium', value: 2, color: '#FFC107'},
    {label: 'High', value: 3, color: '#F44336'},
  ];
  const weekDays = [
    {label: 'Sun', value: 'SUN'},
    {label: 'Mon', value: 'MON'},
    {label: 'Tue', value: 'TUE'},
    {label: 'Wed', value: 'WED'},
    {label: 'Thu', value: 'THU'},
    {label: 'Fri', value: 'FRI'},
    {label: 'Sat', value: 'SAT'},
  ];

  // Functions
  const handleAttachment = type => {
    const options = {
      mediaType: type === 'photo' ? 'photo' : 'mixed',
      quality: 0.8,
      selectionLimit: 0,
    };

    const launcher = type === 'photo' ? launchCamera : launchImageLibrary;
    launcher(options, response => {
      if (!response.didCancel && !response.error) {
        const newAttachments = response.assets.map(asset => ({
          ...asset,
          type: type === 'photo' ? 'photo' : 'file',
        }));
        setAttachments([...attachments, ...newAttachments]);
      }
    });
  };
  const handleWorkTypeChange = newWorkType => {
    setWorkType(newWorkType);
    setWorkTypeModalVisible(false);
  };
  const removeAttachment = index => {
    const newAttachments = [...attachments];
    newAttachments.splice(index, 1);
    setAttachments(newAttachments);
  };

  const handleRecurrenceTypeChange = type => {
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
            if (
              selectedDays.includes(format(currentDate, 'EEE').toUpperCase())
            ) {
              dates.push(new Date(currentDate));
            }
            currentDate.setDate(currentDate.getDate() + 1);
          }
          break;
        case 'weekly':
          dates.push(new Date(currentDate));
          currentDate.setDate(currentDate.getDate() + recurrenceInterval * 7);
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
          currentDate.setFullYear(
            currentDate.getFullYear() + recurrenceInterval,
          );
          break;
      }
    }
    return dates;
  };

  const handleCreateWorkOrder = () => {
    const newWorkOrder = {
      id: Date.now().toString(),
      task,
      description,
      workType,
      assignedTo,
      location,
      asset,
      categories,
      vendors,
      priority: priorities[priorityIndex].label,
      attachments,
      status: 'Open',
      imageUri,
      recurrence: recurrenceType
        ? {
            type: recurrenceType,
            interval: recurrenceInterval,
            selectedDays: selectedDays,
            monthDay: monthDay,
            endDate: recurrenceEndDate,
          }
        : undefined,
      estimatedTime: format(estimatedTime, 'HH:mm'),
      startDate: format(startDate, 'yyyy-MM-dd'),
      dueDate: format(dueDate, 'yyyy-MM-dd'),
    };

    dispatch(addWorkOrder(newWorkOrder));
    navigation.navigate('WorkOrderDetails', {workOrder: newWorkOrder});
  };

  // Component rendering
  const RecurrenceDialog = () => (
    <Portal>
      <Dialog
        visible={showRecurrenceDialog}
        onDismiss={() => setShowRecurrenceDialog(false)}>
        <Dialog.Title>Set Recurrence</Dialog.Title>
        <Dialog.Content>
          <SegmentedButtons
            value={recurrenceType}
            onValueChange={handleRecurrenceTypeChange}
            buttons={[
              {value: 'daily', label: 'Daily'},
              {value: 'weekly', label: 'Weekly'},
              {value: 'monthly', label: 'Monthly'},
              {value: 'yearly', label: 'Yearly'},
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
                  onChangeText={text =>
                    setRecurrenceInterval(parseInt(text) || 1)
                  }
                  style={styles.intervalInput}
                />
                <Text variant="bodyLarge" style={styles.intervalLabel}>
                  {recurrenceType === 'daily'
                    ? 'day(s)'
                    : recurrenceType === 'weekly'
                    ? 'week(s)'
                    : recurrenceType === 'monthly'
                    ? 'month(s)'
                    : 'year(s)'}
                </Text>
              </View>
              {recurrenceType === 'daily' && (
                <View style={styles.daysContainer}>
                  <Text variant="bodyLarge">Or select specific days:</Text>
                  <View style={styles.daysGrid}>
                    {weekDays.map(day => (
                      <Button
                        key={day.value}
                        mode={
                          selectedDays.includes(day.value)
                            ? 'contained'
                            : 'outlined'
                        }
                        onPress={() => {
                          setSelectedDays(
                            selectedDays.includes(day.value)
                              ? selectedDays.filter(d => d !== day.value)
                              : [...selectedDays, day.value],
                          );
                        }}
                        style={styles.dayButton}>
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
                    onChangeText={text => {
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
                style={styles.endDateButton}>
                End Date: {format(recurrenceEndDate, 'MMM d, yyyy')}
              </Button>
            </Surface>
          )}
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setShowRecurrenceDialog(false)}>Cancel</Button>
          <Button
            onPress={() => {
              setShowRecurrenceDialog(false);
              // Additional logic to save recurrence settings
            }}>
            Save
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );

  return (
    <PaperProvider>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction color="#fff" onPress={() => navigation.goBack()} />
        <Appbar.Content
          title="New Work Order"
          titleStyle={styles.headerTitle}
        />
        <Appbar.Action
          icon="check"
          color="#fff"
          onPress={handleCreateWorkOrder}
        />
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
          style={styles.imageButton}>
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
        <Button
          icon="format-list-bulleted"
          mode="outlined"
          onPress={() => {
            /* Handle adding procedure */
          }}
          style={styles.procedureButton}>
          Add Procedure
        </Button>
        {/* <TouchableOpacity
          style={styles.button}
          onPress={() => setIsModalVisible(true)}>
          <View style={styles.estimatedTimeContainer}>
            <Text style={styles.buttonText}>Estimated Time</Text>
            <Text style={styles.timeText}>
              {estimatedTime.hours}h {estimatedTime.minutes}m
            </Text>
          </View>
        </TouchableOpacity> */}
        <TouchableOpacity
          style={styles.field}
          onPress={() => setIsModalVisible(true)}>
          <Text style={styles.fieldLabel}>Estimated Time</Text>
          <View style={styles.fieldValue}>
            {estimatedTime?.hours?<Text style={styles.blueText}>{estimatedTime.hours}h {estimatedTime.minutes}m</Text>:<Text>set</Text>}
            <Icon name="chevron-right" size={24} color="#007AFF" />
          </View>
        </TouchableOpacity>

        <EstimatedTimeModal
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          onSave={handleSave}
          initialHours={estimatedTime.hours}
          initialMinutes={estimatedTime.minutes}
        />
        <Divider />
        <List.Item
          title="Assign to"
          description={assignedTo || 'Choose'}
          onPress={() => navigation.navigate('AssignTo')}
          right={() => <List.Icon icon="chevron-right" />}
        />
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
        <List.Item
          title="Recurrence"
          description={
            recurrenceType
              ? `${recurrenceInterval} ${recurrenceType}(s)`
              : 'Set'
          }
          onPress={() => setShowRecurrenceDialog(true)}
          right={() => <List.Icon icon="chevron-right" />}
        />
        <Divider />
        <TouchableOpacity
          style={styles.field}
          onPress={() => setWorkTypeModalVisible(true)}>
          <Text style={styles.fieldLabel}>Work Type</Text>
          <View style={styles.fieldValue}>
            <Text style={styles.blueText}>{workType}</Text>
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
                {backgroundColor: priority.color},
                priorityIndex === priority.value &&
                  styles.priorityButtonSelected,
              ]}
              onPress={() => setPriorityIndex(priority.value)}>
              <Text style={styles.priorityText}>{priority.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <List.Item
          title="Location"
          description={location || 'Assign Location'}
          onPress={() => setShowLocationMenu(true)}
          right={() => <List.Icon icon="chevron-right" />}
        />
        <Divider />
        <List.Item
          title="Asset"
          description={asset || 'Assign Asset'}
          onPress={() => setShowAssetMenu(true)}
          right={() => <List.Icon icon="chevron-right" />}
        />
        <Divider />
        <List.Item
          title="Parts Needed"
          description="Add Parts"
          onPress={() => {
            /* Handle adding parts */
          }}
          right={props => (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <IconButton icon="lock" size={20} />
              <List.Icon {...props} icon="chevron-right" />
            </View>
          )}
        />
        <Divider />
        <List.Item
          title="Categories"
          description={
            categories.length > 0 ? categories.join(', ') : 'Add Categories'
          }
          onPress={() => setShowCategoriesMenu(true)}
          right={() => <List.Icon icon="chevron-right" />}
        />
        <Divider />
        <List.Item
          title="Files"
          description={`${attachments.length} attached`}
          onPress={() => handleAttachment('file')}
          right={() => <List.Icon icon="chevron-right" />}
        />
        <Divider />
        <List.Item
          title="Vendors"
          description={vendors.length > 0 ? vendors.join(', ') : 'Add Vendors'}
          onPress={() => setShowVendorsMenu(true)}
          right={() => <List.Icon icon="chevron-right" />}
        />
      </ScrollView>
      <RecurrenceDialog />
      <Menu
        visible={showWorkTypeMenu}
        onDismiss={() => setShowWorkTypeMenu(false)}
        anchor={<View />}>
        {workTypes.map(type => (
          <Menu.Item
            key={type}
            onPress={() => {
              setWorkType(type);
              setShowWorkTypeMenu(false);
            }}
            title={type}
          />
        ))}
      </Menu>
      <Menu
        visible={showLocationMenu}
        onDismiss={() => setShowLocationMenu(false)}
        anchor={<View />}>
        {locations.map(loc => (
          <Menu.Item
            key={loc.id}
            onPress={() => {
              setLocation(loc.name);
              setShowLocationMenu(false);
            }}
            title={loc.name}
          />
        ))}
      </Menu>
      <Menu
        visible={showAssetMenu}
        onDismiss={() => setShowAssetMenu(false)}
        anchor={<View />}>
        {assets.map(ast => (
          <Menu.Item
            key={ast.id}
            onPress={() => {
              setAsset(ast.name);
              setShowAssetMenu(false);
            }}
            title={ast.name}
          />
        ))}
      </Menu>
      <Menu
        visible={showCategoriesMenu}
        onDismiss={() => setShowCategoriesMenu(false)}
        anchor={<View />}>
        {categoryOptions.map(category => (
          <Menu.Item
            key={category.id}
            onPress={() => {
              setCategories([...categories, category.label]);
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
        anchor={<View />}>
        {vendorOptions.map(vendor => (
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
      {/* {showEstimatedTimePicker && (
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
            )} */}
      {/* {showStartDatePicker && (
                <DateTimePicker
                    value={startDate}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                        setShowStartDatePicker(false);
                        if (selectedDate) setStartDate(selectedDate);
                    }}
                />
            )} */}
      {/* {showDueDatePicker && (
                <DateTimePicker
                    value={dueDate}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                        setShowDueDatePicker(false);
                        if (selectedDate) setDueDate(selectedDate);
                    }}
                />
            )} */}
      {/* {showEndDatePicker && (
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
            )} */}
            <WorkTypeModal
        visible={isWorkTypeModalVisible}
        onClose={() => setWorkTypeModalVisible(false)}
        onSelect={handleWorkTypeChange}
        currentWorkType={workType}
      />
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
  procedureButton: {
    marginHorizontal: 16,
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
  timeText: {
    fontSize: 16,
    color: '#666666',
  },
  estimatedTimeContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  createButton: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
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
  redCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'red',
    marginLeft: 8,
  },
});
