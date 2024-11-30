import React, { useState, useMemo } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, Text, ScrollView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Card, Searchbar, IconButton, Menu, Divider, Badge, FAB } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format, startOfWeek, endOfWeek, isSameDay, isWithinInterval } from 'date-fns';

export default function WorkOrderView() {
    const navigation = useNavigation();
    const workOrders = useSelector(state => state.workOrder?.workOrders || []);
    console.log('Work Orders:', workOrders);
    const locations = useSelector(state => state.location?.locations || []);
    const assets = useSelector(state => state.asset?.assets || []);

    const [searchQuery, setSearchQuery] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const [filters, setFilters] = useState({
        dueDate: new Date(),
        weekStart: null,
        weekEnd: null,
        location: null,
        priority: null,
        category: null,
        status: null,
        workType: null,
        asset: null,
        assetType: null,
        vendor: null,
        part: null,
        procedure: null
    });
    const [viewMode, setViewMode] = useState('month'); // 'month' or 'week'
    const [showCustomWeekPicker, setShowCustomWeekPicker] = useState(false);
    const [showCustomMonthPicker, setShowCustomMonthPicker] = useState(false);

    const handleDateChange = (event, date) => {
        setShowDatePicker(false);
        if (date) {
            if (viewMode === 'week') {
                // If in week view, set to start of the week
                const weekStart = startOfWeek(date);
                setSelectedDate(weekStart);
                setFilters(prev => ({ ...prev, dueDate: weekStart }));
            } else {
                setSelectedDate(date);
                setFilters(prev => ({ ...prev, dueDate: date }));
            }
        }
    };

    const handleDatePress = () => {
        if (viewMode === 'week') {
            setShowCustomWeekPicker(true);
        } else {
            setShowCustomMonthPicker(true);
        }
    };

    const handleWeekDateSelect = (date) => {
        setShowCustomWeekPicker(false);
        const weekStart = startOfWeek(date);
        const weekEnd = endOfWeek(date);
        
        setSelectedDate(date);
        setFilters(prev => ({
            ...prev,
            dueDate: null,
            weekStart: weekStart,
            weekEnd: weekEnd
        }));
    };

    const handleMonthDateSelect = (date) => {
        setShowCustomMonthPicker(false);
        setSelectedDate(date);
        setFilters(prev => ({
            ...prev,
            weekStart: null,
            weekEnd: null,
            dueDate: date
        }));
    };

    const handleViewModeChange = (mode) => {
        const today = new Date();
        if (mode === 'week') {
            const weekStart = startOfWeek(today);
            setSelectedDate(weekStart);
            setFilters(prev => ({
                ...prev,
                dueDate: null,
                weekStart: weekStart,
                weekEnd: endOfWeek(today)
            }));
        } else {
            setSelectedDate(today);
            setFilters(prev => ({
                ...prev,
                weekStart: null,
                weekEnd: null,
                dueDate: today
            }));
        }
        setViewMode(mode);
    };

    const getDateRangeText = () => {
        if (viewMode === 'week') {
            const weekStart = startOfWeek(selectedDate);
            const weekEnd = endOfWeek(selectedDate);
            return `${format(weekStart, 'MMM dd')} - ${format(weekEnd, 'MMM dd, yyyy')}`;
        }
        return format(selectedDate, 'MMM dd, yyyy');
    };

    const getLocationName = (locationId) => {
        const location = locations.find(loc => loc.id === locationId);
        return location ? location.name : 'Unknown Location';
    };

    const getAssetName = (assetId) => {
        const asset = assets.find(ast => ast.id === assetId);
        return asset ? asset.name : 'Unknown Asset';
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 0:
                return '#4CAF50'; // Low
            case 1:
                return '#FFA000'; // Medium
            case 2:
                return '#FF4444'; // High
            default:
                return '#757575';
        }
    };

    const getPriorityText = (priority) => {
        switch (priority) {
            case 0:
                return 'Low';
            case 1:
                return 'Medium';
            case 2:
                return 'High';
            default:
                return 'Unknown';
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'open':
                return '#2196F3'; // Blue
            case 'in progress':
                return '#FFA000'; // Yellow/Orange
            case 'on hold':
                return '#F44336'; // Red
            case 'completed':
                return '#4CAF50'; // Green
            default:
                return '#757575'; // Grey
        }
    };

    const clearFilters = () => {
        setFilters({
            dueDate: new Date(),
            weekStart: null,
            weekEnd: null,
            location: null,
            priority: null,
            category: null,
            status: null,
            workType: null,
            asset: null,
            assetType: null,
            vendor: null,
            part: null,
            procedure: null
        });
        setSelectedDate(new Date());
    };

    const filteredWorkOrders = useMemo(() => {
        return workOrders.filter(order => {
            // Ensure we have a valid date to compare
            if (!order.dueDate) return false;
            
            // Convert order due date to Date object for comparison
            const orderDueDate = new Date(order.dueDate);
            
            // Check date filter based on view mode
            let dateMatches = true;
            
            if (viewMode === 'month' && filters.dueDate) {
                // For month view, compare the day, month, and year
                dateMatches = (
                    orderDueDate.getDate() === filters.dueDate.getDate() &&
                    orderDueDate.getMonth() === filters.dueDate.getMonth() &&
                    orderDueDate.getFullYear() === filters.dueDate.getFullYear()
                );
            } else if (viewMode === 'week' && filters.weekStart && filters.weekEnd) {
                // For week view, check if the date falls within the week range
                const orderTime = orderDueDate.getTime();
                const startTime = filters.weekStart.getTime();
                const endTime = filters.weekEnd.getTime();
                dateMatches = orderTime >= startTime && orderTime <= endTime;
            }

            // Check search query
            const searchMatches = !searchQuery || 
                (order.title && order.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (order.description && order.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (order.location && order.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (order.asset && order.asset.toLowerCase().includes(searchQuery.toLowerCase()));

            // Check other filters
            const statusMatches = !filters.status || order.status === filters.status;
            const priorityMatches = !filters.priority || order.priority === filters.priority;
            const locationMatches = !filters.location || order.location === filters.location;
            const categoryMatches = !filters.category || (order.categories && order.categories.includes(filters.category));
            const workTypeMatches = !filters.workType || order.workType === filters.workType;
            const assetMatches = !filters.asset || order.asset === filters.asset;
            const assetTypeMatches = !filters.assetType || order.assetType === filters.assetType;
            const vendorMatches = !filters.vendor || order.vendor === filters.vendor;
            const partMatches = !filters.part || (order.parts && order.parts.includes(filters.part));
            const procedureMatches = !filters.procedure || order.procedure === filters.procedure;

            // Return true only if all conditions match
            return dateMatches && searchMatches && statusMatches && priorityMatches &&
                   locationMatches && categoryMatches && workTypeMatches && assetMatches &&
                   assetTypeMatches && vendorMatches && partMatches && procedureMatches;
        });
    }, [workOrders, filters, searchQuery, viewMode]);

    const renderWorkOrder = ({ item }) => (
        <TouchableOpacity onPress={() => navigation.navigate('WorkOrderDetails', { workOrderId: item.id })}>
            <Card style={styles.card} elevation={2}>
                <Card.Content>
                    <View style={styles.cardHeader}>
                        <View style={styles.titleContainer}>
                            <Text style={styles.title}>{item.task || 'Untitled Task'}</Text>
                            <View style={styles.badgeContainer}>
                                <Badge 
                                    style={[styles.badge, { backgroundColor: getPriorityColor(item.priorityIndex) }]}
                                >
                                    {getPriorityText(item.priorityIndex)}
                                </Badge>
                                <Badge 
                                    style={[styles.badge, { backgroundColor: getStatusColor(item.status) }]}
                                >
                                    {item.status || 'Open'}
                                </Badge>
                            </View>
                        </View>
                        {item.dueDate && (
                            <Text style={styles.dueDate}>
                                Due: {format(new Date(item.dueDate), 'MMM dd, yyyy')}
                            </Text>
                        )}
                    </View>
                    {item.description && (
                        <Text style={styles.description} numberOfLines={2}>
                            {item.description}
                        </Text>
                    )}
                    <View style={styles.detailsContainer}>
                        {item.location && (
                            <View style={styles.detail}>
                                <Icon name="map-marker" size={16} color="#666" />
                                <Text style={styles.detailText}>{item.location}</Text>
                            </View>
                        )}
                        {item.asset && (
                            <View style={styles.detail}>
                                <Icon name="cube-outline" size={16} color="#666" />
                                <Text style={styles.detailText}>{item.asset}</Text>
                            </View>
                        )}
                        {item.assignedTo && (
                            <View style={styles.detail}>
                                <Icon name="account" size={16} color="#666" />
                                <Text style={styles.detailText}>{item.assignedTo}</Text>
                            </View>
                        )}
                        {item.workType && (
                            <View style={styles.detail}>
                                <Icon name="wrench" size={16} color="#666" />
                                <Text style={styles.detailText}>{item.workType}</Text>
                            </View>
                        )}
                    </View>
                </Card.Content>
            </Card>
        </TouchableOpacity>
    );

    const WeekPicker = () => {
        if (!showCustomWeekPicker) return null;

        const start = startOfWeek(selectedDate);
        const dates = Array.from({ length: 7 }, (_, i) => {
            const date = new Date(start);
            date.setDate(start.getDate() + i);
            return date;
        });

        // Add week navigation
        const goToPreviousWeek = () => {
            const newDate = new Date(selectedDate);
            newDate.setDate(newDate.getDate() - 7);
            handleWeekDateSelect(newDate);
        };

        const goToNextWeek = () => {
            const newDate = new Date(selectedDate);
            newDate.setDate(newDate.getDate() + 7);
            handleWeekDateSelect(newDate);
        };

        const today = new Date();

        return (
            <View style={styles.weekPickerContainer}>
                <View style={styles.monthHeader}>
                    <TouchableOpacity onPress={goToPreviousWeek} style={styles.monthNavButton}>
                        <Icon name="chevron-left" size={24} color="#666" />
                    </TouchableOpacity>
                    <Text style={styles.monthYearText}>
                        {format(start, 'MMMM d')} - {format(dates[6], 'MMMM d, yyyy')}
                    </Text>
                    <TouchableOpacity onPress={goToNextWeek} style={styles.monthNavButton}>
                        <Icon name="chevron-right" size={24} color="#666" />
                    </TouchableOpacity>
                </View>

                <View style={styles.weekDayHeader}>
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                        <Text key={index} style={styles.weekDayText}>{day}</Text>
                    ))}
                </View>

                <View style={styles.weekRow}>
                    {dates.map((date, index) => {
                        const isSelected = format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
                        const isToday = format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');

                        return (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.weekDateCell,
                                    isSelected && styles.selectedDate,
                                    isToday && styles.todayDate
                                ]}
                                onPress={() => handleWeekDateSelect(date)}
                            >
                                <Text style={[
                                    styles.weekDateNumber,
                                    isSelected && styles.selectedDateText,
                                    isToday && styles.todayDateText
                                ]}>
                                    {format(date, 'd')}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                <TouchableOpacity 
                    style={styles.closeButton}
                    onPress={() => setShowCustomWeekPicker(false)}
                >
                    <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
            </View>
        );
    };

    const MonthPicker = () => {
        if (!showCustomMonthPicker) return null;

        const today = new Date();
        const currentMonth = selectedDate.getMonth();
        const currentYear = selectedDate.getFullYear();
        
        // Get the first day of the month
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
        const startingDayOfWeek = firstDayOfMonth.getDay();
        
        // Get the last day of the month
        const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        
        // Calculate previous month's days that need to be shown
        const previousMonth = new Date(currentYear, currentMonth - 1);
        const previousMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
        
        const weeks = [];
        let days = [];
        let day = 1;
        let previousMonthDay = previousMonthLastDay - startingDayOfWeek + 1;
        
        // Add previous month's days
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push({
                date: new Date(currentYear, currentMonth - 1, previousMonthDay),
                dayOfMonth: previousMonthDay,
                isCurrentMonth: false
            });
            previousMonthDay++;
        }
        
        // Add current month's days
        while (day <= lastDayOfMonth) {
            days.push({
                date: new Date(currentYear, currentMonth, day),
                dayOfMonth: day,
                isCurrentMonth: true
            });
            
            if (days.length === 7) {
                weeks.push([...days]);
                days = [];
            }
            day++;
        }
        
        // Add next month's days
        let nextMonthDay = 1;
        while (days.length < 7) {
            days.push({
                date: new Date(currentYear, currentMonth + 1, nextMonthDay),
                dayOfMonth: nextMonthDay,
                isCurrentMonth: false
            });
            nextMonthDay++;
        }
        if (days.length > 0) {
            weeks.push(days);
        }

        // Add month navigation
        const goToPreviousMonth = () => {
            const newDate = new Date(selectedDate);
            newDate.setMonth(newDate.getMonth() - 1);
            handleMonthDateSelect(newDate);
        };

        const goToNextMonth = () => {
            const newDate = new Date(selectedDate);
            newDate.setMonth(newDate.getMonth() + 1);
            handleMonthDateSelect(newDate);

        };

        return (
            <View style={styles.monthPickerContainer}>
                <View style={styles.monthHeader}>
                    <TouchableOpacity onPress={goToPreviousMonth} style={styles.monthNavButton}>
                        <Icon name="chevron-left" size={24} color="#666" />
                    </TouchableOpacity>
                    <Text style={styles.monthYearText}>
                        {format(selectedDate, 'MMMM yyyy')}
                    </Text>
                    <TouchableOpacity onPress={goToNextMonth} style={styles.monthNavButton}>
                        <Icon name="chevron-right" size={24} color="#666" />
                    </TouchableOpacity>
                </View>

                <View style={styles.weekDayHeader}>
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                        <Text key={index} style={styles.weekDayText}>{day}</Text>
                    ))}
                </View>

                {weeks.map((week, weekIndex) => (
                    <View key={weekIndex} style={styles.weekRow}>
                        {week.map((dayInfo, dayIndex) => {
                            const isSelected = format(dayInfo.date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
                            const isToday = format(dayInfo.date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');

                            return (
                                <TouchableOpacity
                                    key={dayIndex}
                                    style={[
                                        styles.monthDate,
                                        !dayInfo.isCurrentMonth && styles.differentMonth,
                                        isSelected && styles.selectedDate,
                                        isToday && styles.todayDate
                                    ]}
                                    onPress={() => handleMonthDateSelect(dayInfo.date)}
                                >
                                    <Text style={[
                                        styles.monthDateText,
                                        !dayInfo.isCurrentMonth && styles.differentMonthText,
                                        isSelected && styles.selectedDateText,
                                        isToday && styles.todayDateText
                                    ]}>
                                        {dayInfo.dayOfMonth}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                ))}

                <TouchableOpacity 
                    style={styles.closeButton}
                    onPress={() => setShowCustomMonthPicker(false)}
                >
                    <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.calendarButton}
                    onPress={handleDatePress}
                >
                    <Icon name="calendar" size={24} color="#007AFF" />
                    <Text style={styles.calendarText}>
                        {getDateRangeText()}
                    </Text>
                </TouchableOpacity>

                <View style={{flex:1}}>
                    <Searchbar
                        placeholder="Search work orders..."
                        onChangeText={setSearchQuery}
                        value={searchQuery}
                        style={styles.searchBar}
                    />
                </View>

                <Menu
                    visible={showFilterMenu}
                    onDismiss={() => setShowFilterMenu(false)}
                    anchor={
                        <IconButton
                            icon="filter"
                            size={24}
                            onPress={() => setShowFilterMenu(true)}
                        />
                    }
                >
                    <Menu.Item 
                        title="Due Date"
                        onPress={() => setShowDatePicker(true)}
                        leadingIcon="calendar"
                    />
                    <Divider />
                    
                    <Menu.Item 
                        title="Status"
                        leadingIcon="flag"
                    />
                    <Menu.Item 
                        onPress={() => {
                            setFilters(prev => ({ ...prev, status: 'Open' }));
                            setShowFilterMenu(false);
                        }} 
                        title="Open"
                        style={{ paddingLeft: 30 }}
                    />
                    <Menu.Item 
                        onPress={() => {
                            setFilters(prev => ({ ...prev, status: 'In Progress' }));
                            setShowFilterMenu(false);
                        }} 
                        title="In Progress"
                        style={{ paddingLeft: 30 }}
                    />
                    <Menu.Item 
                        onPress={() => {
                            setFilters(prev => ({ ...prev, status: 'On Hold' }));
                            setShowFilterMenu(false);
                        }} 
                        title="On Hold"
                        style={{ paddingLeft: 30 }}
                    />
                    <Menu.Item 
                        onPress={() => {
                            setFilters(prev => ({ ...prev, status: 'Completed' }));
                            setShowFilterMenu(false);
                        }} 
                        title="Completed"
                        style={{ paddingLeft: 30 }}
                    />
                    <Divider />

                    <Menu.Item 
                        title="Priority"
                        leadingIcon="alert-circle"
                    />
                    <Menu.Item 
                        onPress={() => {
                            setFilters(prev => ({ ...prev, priority: 2 }));
                            setShowFilterMenu(false);
                        }} 
                        title="High Priority"
                        style={{ paddingLeft: 30 }}
                    />
                    <Menu.Item 
                        onPress={() => {
                            setFilters(prev => ({ ...prev, priority: 1 }));
                            setShowFilterMenu(false);
                        }} 
                        title="Medium Priority"
                        style={{ paddingLeft: 30 }}
                    />
                    <Menu.Item 
                        onPress={() => {
                            setFilters(prev => ({ ...prev, priority: 0 }));
                            setShowFilterMenu(false);
                        }} 
                        title="Low Priority"
                        style={{ paddingLeft: 30 }}
                    />
                    <Divider />

                    <Menu.Item 
                        title="Location"
                        onPress={() => {
                            // TODO: Show location picker
                            setShowFilterMenu(false);
                        }}
                        leadingIcon="map-marker"
                    />
                    <Divider />

                    <Menu.Item 
                        title="Asset"
                        onPress={() => {
                            // TODO: Show asset picker
                            setShowFilterMenu(false);
                        }}
                        leadingIcon="cube-outline"
                    />
                    <Menu.Item 
                        title="Asset Type"
                        onPress={() => {
                            // TODO: Show asset type picker
                            setShowFilterMenu(false);
                        }}
                        leadingIcon="cube-scan"
                        style={{ paddingLeft: 30 }}
                    />
                    <Divider />

                    <Menu.Item 
                        title="Work Type"
                        onPress={() => {
                            // TODO: Show work type picker
                            setShowFilterMenu(false);
                        }}
                        leadingIcon="wrench"
                    />
                    <Divider />

                    <Menu.Item 
                        title="Category"
                        onPress={() => {
                            // TODO: Show category picker
                            setShowFilterMenu(false);
                        }}
                        leadingIcon="tag"
                    />
                    <Divider />

                    <Menu.Item 
                        title="Vendor"
                        onPress={() => {
                            // TODO: Show vendor picker
                            setShowFilterMenu(false);
                        }}
                        leadingIcon="store"
                    />
                    <Divider />

                    <Menu.Item 
                        title="Part"
                        onPress={() => {
                            // TODO: Show part picker
                            setShowFilterMenu(false);
                        }}
                        leadingIcon="cog"
                    />
                    <Divider />

                    <Menu.Item 
                        title="Procedure"
                        onPress={() => {
                            // TODO: Show procedure picker
                            setShowFilterMenu(false);
                        }}
                        leadingIcon="file-document"
                    />
                    <Divider />

                    <Menu.Item 
                        onPress={() => {
                            clearFilters();
                            setShowFilterMenu(false);
                        }} 
                        title="Clear All Filters"
                        leadingIcon="filter-remove"
                    />
                </Menu>
            </View>

            <View style={styles.viewToggleContainer}>
                <TouchableOpacity 
                    style={[
                        styles.toggleButton, 
                        viewMode === 'month' && styles.toggleButtonActive
                    ]}
                    onPress={() => handleViewModeChange('month')}
                >
                    <Icon 
                        name="calendar-month" 
                        size={20} 
                        color={viewMode === 'month' ? 'white' : '#666'} 
                    />
                    <Text style={[
                        styles.toggleText,
                        viewMode === 'month' && styles.toggleTextActive
                    ]}>Month View</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[
                        styles.toggleButton,
                        viewMode === 'week' && styles.toggleButtonActive
                    ]}
                    onPress={() => handleViewModeChange('week')}
                >
                    <Icon 
                        name="calendar-week" 
                        size={20} 
                        color={viewMode === 'week' ? 'white' : '#666'} 
                    />
                    <Text style={[
                        styles.toggleText,
                        viewMode === 'week' && styles.toggleTextActive
                    ]}>Week View</Text>
                </TouchableOpacity>
            </View>

            {viewMode === 'month' && showDatePicker && (
                <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                />
            )}
            
            {viewMode === 'week' ? <WeekPicker /> : <MonthPicker />}
            <FlatList
                data={filteredWorkOrders}
                renderItem={renderWorkOrder}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContainer}
            />

            <FAB
                icon="plus"
                style={styles.fab}
                onPress={() => navigation.navigate('WorkListing')}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    calendarButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 8,
    },
    calendarText: {
        marginLeft: 4,
        color: '#007AFF',
    },
    searchBar: {
        flex: 1,
        marginRight: 8,
        height: 40,
        backgroundColor: '#f5f5f5',justifyContent: 'center',alignItems: 'center',alignSelf: 'center',
    },
    listContainer: {
        padding: 16,
    },
    card: {
        marginBottom: 16,
        backgroundColor: '#fff',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    titleContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        marginRight: 8,
    },
    badgeContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    badge: {
        alignSelf: 'center',
        paddingHorizontal: 12,
    },
    dueDate: {
        fontSize: 12,
        color: '#666',
    },
    description: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    detailsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    detail: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    detailText: {
        fontSize: 12,
        color: '#666',
        marginLeft: 4,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: '#007AFF',
    },
    viewToggleContainer: {
        flexDirection: 'row',
        padding: 8,
        backgroundColor: '#f5f5f5',
        marginHorizontal: 16,
        marginTop: 8,
        borderRadius: 8,
        justifyContent: 'space-between',
    },
    toggleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 6,
        flex: 1,
        marginHorizontal: 4,
        justifyContent: 'center',
    },
    toggleButtonActive: {
        backgroundColor: '#2196F3',
    },
    toggleText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    toggleTextActive: {
        color: 'white',
    },
    weekPickerContainer: {
        position: 'absolute',
        top: 120,
        left: 16,
        right: 16,
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        zIndex: 1000,
    },
    weekDayHeader: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        paddingBottom: 8,
    },
    weekDayText: {
        flex: 1,
        textAlign: 'center',
        color: '#666',
        fontWeight: '600',
        fontSize: 12,
    },
    weekRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 4,
    },
    weekDateCell: {
        flex: 1,
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 2,
        borderRadius: 8,
        backgroundColor: '#f5f5f5',
    },
    weekDateNumber: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    selectedDate: {
        backgroundColor: '#2196F3',
    },
    selectedDateText: {
        color: 'white',
        fontWeight: '600',
    },
    todayDate: {
        borderWidth: 1,
        borderColor: '#2196F3',
    },
    todayDateText: {
        color: '#2196F3',
        fontWeight: '600',
    },
    monthPickerContainer: {
        position: 'absolute',
        top: 120,
        left: 16,
        right: 16,
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        zIndex: 1000,
    },
    monthHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        paddingHorizontal: 8,
    },
    monthNavButton: {
        padding: 8,
    },
    monthYearText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    monthDate: {
        flex: 1,
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 2,
        borderRadius: 8,
    },
    monthDateText: {
        fontSize: 14,
        color: '#333',
    },
    selectedDate: {
        backgroundColor: '#2196F3',
    },
    selectedDateText: {
        color: 'white',
        fontWeight: '600',
    },
    todayDate: {
        borderWidth: 1,
        borderColor: '#2196F3',
    },
    todayDateText: {
        color: '#2196F3',
        fontWeight: '600',
    },
    closeButton: {
        marginTop: 16,
        padding: 12,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#666',
        fontWeight: '600',
    },
});