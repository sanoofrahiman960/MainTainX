import React, { useState, useMemo, useEffect } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, Text, ScrollView, Platform, ActivityIndicator, Modal, Alert,TextInput } from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { Card, Searchbar, IconButton, Menu, Divider, Badge, FAB } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format, startOfWeek, endOfWeek, isSameDay, isWithinInterval } from 'date-fns';
import axios from 'axios';
import { getData, getObjectData, storeData } from '../../Util/Storage';
import { BASE_URL } from '../../Util/Const';
import { useDispatch } from 'react-redux';
import { WorkOrder } from '../../redux/slices/workOrderSlice';
import { addWorkOrder } from '../../redux/slices/workOrderSlice';
import { Calendar } from 'react-native-calendars';
import Toast from 'react-native-simple-toast';

export default function WorkOrderView() {
    const navigation = useNavigation();
    const Focus = useIsFocused()
    const [workOrderData, setWorkOrderData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const locations = useSelector(state => state.location?.locations || []);
    const assets = useSelector(state => state.asset?.assets || []);
    const dispatch = useDispatch();
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [filteredData, setFilteredData] = useState([]);
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
    const [markedDates, setMarkedDates] = useState({});

    const handleDeleteWorkOrder = async (workOrderId) => {
        try {
            const Token = await getData("ACCESS_TOKEN");
            const response = await fetch(`${BASE_URL}/web/dataset/call_kw`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': `X-OpenERP=${Token}`,
                },
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    params: {
                        model: "maintenance.request",
                        method: "unlink",
                        args: [[workOrderId]],
                        kwargs: {}
                    }
                })
            });

            const data = await response.json();
            console.log("Delete response:", data);

            if (data.result === true) {
                Toast.show('Work order deleted successfully');
                // Refresh work orders using the fetchWorkOrders function
                fetchWorkOrders();
                return true;
            } else {
                Toast.show('Failed to delete work order');
                return false;
            }
        } catch (error) {
            console.error('Error deleting work order:', error);
            Toast.show('An error occurred while deleting the work order');
            return false;
        }
    };

    const confirmDelete = (workOrderId, event) => {
        event.stopPropagation(); // Prevent navigation when clicking delete
        Alert.alert(
            "Delete Work Order",
            "Are you sure you want to delete this work order?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        setLoading(true);
                        const success = await handleDeleteWorkOrder(workOrderId);
                        setLoading(false);
                        if (success) {
                            console.log("Work order deleted successfully");
                        } else {
                            console.log("Failed to delete work order");
                        }
                    }
                }
            ]
        );
    };

    const fetchWorkOrders = async () => {
        const Data = await getObjectData("EMPLOYEE_DATA");
        console.log("EMPLOYEE_DATA", Data?.id);
        
        try {
            const Token = await getData("ACCESS_TOKEN");
            const IDs = await getData("EMPLOYEE_ID");
            const currentWorkOrders = await getData("CURRENT_WORK_ORDERS");
            console.log("IDs", IDs, Token);

            const empResponse = await fetch(`${BASE_URL}/web/dataset/call_kw`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': `X-OpenERP=${Token}`,
                },
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    params: {
                        "model": "maintenance.request",
                        "method": "search_read",
                        "args": [],
                        "kwargs": {
                            "fields": ["name", "priority", "stage_id", "due_date", "employee_ids", "contact_location_id", "partner_id", "description", "write_date"],
                            "domain": [["employee_ids", "in", [Data?.id]]]
                        }
                    },
                }),
            });
            const empData = await empResponse.json();
            console.log("empData.result", empData.result);
            
            if (empData.result) {
                const hasChanges = !currentWorkOrders || 
                    empData.result.some((newOrder, index) => {
                        const currentOrder = currentWorkOrders[index];
                        return !currentOrder || currentOrder.write_date !== newOrder.write_date;
                    });

                if (hasChanges) {
                    const sortedWorkOrders = sortWorkOrdersByDate(empData.result);
                    setWorkOrderData(sortedWorkOrders);
                    dispatch(addWorkOrder(sortedWorkOrders));
                    processWorkOrderDates(sortedWorkOrders);
                    await storeData("CURRENT_WORK_ORDERS", sortedWorkOrders);
                }
                setError(null);
            } else {
                setError('No data received from server');
            }
        } catch (err) {
            console.error('Error fetching work orders:', err);
            setError('Failed to fetch work orders');
        }
    };

    useEffect(() => {
        fetchWorkOrders();
    }, [Focus]);

    const processWorkOrderDates = (workOrders) => {
        const dates = {};
        workOrders.forEach(order => {
            if (order.due_date) {
                const date = new Date(order.due_date).toISOString().split('T')[0];
                dates[date] = {
                    marked: true,
                    dotColor: getStatusColor(order.stage_id?.[1]),
                    selectedDotColor: '#fff'
                };
            }
        });
        setMarkedDates(dates);
    };

    const sortWorkOrdersByDate = (workOrders) => {
        return [...workOrders].sort((a, b) => {
            const dateA = new Date(a.due_date);
            const dateB = new Date(b.due_date);
            return dateB - dateA; // Sort in descending order (newest first)
        });
    };

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

    const handleDatePress = (day) => {
        const selected = new Date(day.timestamp);
        setSelectedDate(selected);
        
        const filtered = workOrderData.filter(order => {
            if (!order.due_date) return false;
            const orderDate = new Date(order.due_date);
            return (
                orderDate.getFullYear() === selected.getFullYear() &&
                orderDate.getMonth() === selected.getMonth() &&
                orderDate.getDate() === selected.getDate()
            );
        });
        
        setFilteredData(filtered);
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

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 0:
                return '#5174e8'; // Low
            case 1:
                return '#61f299'; // Medium
            case 2:
                return 'green'; // High
            case 3:
                return '#eb1b0c'; // Highest
            default:
                return '#5174e8';
        }
    };

    const getPriorityText = (priority) => {
        switch (priority) {
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

    const getStatusColor = (status) => {
        switch (status) {
            case 'New':
                return '#4daae8'; // Blue
            case 'In Progress':
                return '#2e8ee8'; // Yellow/Orange
            case 'On Hold':
                return '#ed9624'; // Red
            case 'Done':
                return '#135233'; // Green
            default:
                return '#757575'; // Grey
        }
    };

    const getStatusColorNew = (status) => {
        switch (status?.toLowerCase()) {
          case 'in progress':
            return '#2196F3';
          case 'completed':
          case 'done':
            return '#4CAF50';
          case 'pending':
            return '#FFC107';
          case 'cancelled':
            return '#F44336';
          default:
            return '#757575';
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

    const handleSearch = (query) => {
        setSearchQuery(query);
        if (!query.trim()) {
            setFilteredData(workOrderData);
            return;
        }

        const searchTerms = query.toLowerCase().split(' ');
        const filtered = workOrderData.filter(order => {
            const searchableText = [
                order.name,
                order.partner_id && order.partner_id[1],
                order.stage_id && order.stage_id[1],
                order.priority && getPriorityText(order.priority)
            ]
                .filter(Boolean)
                .join(' ')
                .toLowerCase();

            return searchTerms.every(term => searchableText.includes(term));
        });

        setFilteredData(filtered);
    };

    useEffect(() => {
        if (workOrderData.length > 0) {
            setFilteredData(workOrderData);
        }
    }, [workOrderData]);

    const renderWorkOrder = ({ item }) => {
        const formattedDate = new Date(item.due_date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        const getStatusColor = (status) => {
            switch (status?.toLowerCase()) {
              case 'in progress':
                return '#2196F3';
              case 'completed':
              case 'done':
                return '#4CAF50';
              case 'pending':
                return '#FFC107';
              case 'cancelled':
                return '#F44336';
              default:
                return '#757575';
            }
        };

        const getPriorityStyle = (priority) => {
            switch (priority) {
              case '3':
                return { backgroundColor: '#FFE5E5', color: '#D32F2F' };
              case '2':
                return { backgroundColor: '#FFF3E0', color: '#F57C00' };
              case '1':
                return { backgroundColor: '#E3F2FD', color: '#1976D2' };
              default:
                return { backgroundColor: '#F5F5F5', color: '#757575' };
            }
        };

        const priorityStyle = getPriorityStyle(item.priority);
        const statusColor = getStatusColorNew(item.stage_id?.[1]);

        return (
            <TouchableOpacity
                style={styles.workOrderCard}
                onPress={() => navigation.navigate('WorkOrderDetails', { workOrderId: item.id })}
            >
                <View style={styles.cardHeader}>
                    <View style={styles.cardLeft}>
                        <View style={styles.dateContainer}>
                            <Text style={styles.dateMonth}>
                                {new Date(item.due_date).toLocaleString('en-US', { month: 'short' })}
                            </Text>
                            <Text style={styles.dateDay}>
                                {new Date(item.due_date).getDate()}
                            </Text>
                        </View>
                        <View style={styles.titleContainer}>
                            <Text style={styles.workOrderTitle} numberOfLines={1}>
                                {item.name}
                            </Text>
                            <Text style={styles.teamText} numberOfLines={1}>
                                {item.maintenance_team_id ? item.maintenance_team_id[1] : 'No Team'}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.cardRight}>
                        <View style={[styles.priorityBadge, { backgroundColor: priorityStyle.backgroundColor }]}>
                            <Text style={[styles.priorityText, { color: priorityStyle.color }]}>
                                {item.priority === '3' ? 'High' : item.priority === '2' ? 'Medium' : 'Low'}
                            </Text>
                        </View>
                        <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
                        <IconButton
                            icon="delete"
                            iconColor="#FF0000"
                            size={20}
                            onPress={(e) => confirmDelete(item.id, e)}
                            style={{ marginLeft: 8 }}
                        />
                    </View>
                </View>
                <View style={styles.cardContent}>
                    {item.description && (
                        <Text style={styles.descriptionText} numberOfLines={2}>
                            {item.description?.replace(/<p>/g, '').replace(/<\/p>/g, '')}
                        </Text>
                    )}
                    <View style={styles.cardFooter}>
                        {item.partner_id && (
                            <Text style={styles.partnerText} numberOfLines={1}>
                                Client: {item.partner_id[1]}
                            </Text>
                        )}
                        <View style={[styles.statusBadge, { backgroundColor: `${statusColor}15` }]}>
                            <Text style={[styles.statusText, { color: statusColor }]}>
                                {item.stage_id ? item.stage_id[1] : 'New'}
                            </Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

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

    const renderCalendar = () => {
        const selectedDateStr = selectedDate ? 
            new Date(selectedDate).toISOString().split('T')[0] : '';
        
        const markedDatesWithSelected = {
            ...markedDates,
            [selectedDateStr]: {
                ...markedDates[selectedDateStr],
                selected: true,
                selectedColor: '#2196F3',
            }
        };

        return (
            <Calendar
                style={styles.calendar}
                markedDates={markedDatesWithSelected}
                markingType="dot"
                theme={{
                    backgroundColor: '#ffffff',
                    calendarBackground: '#ffffff',
                    textSectionTitleColor: '#333',
                    selectedDayBackgroundColor: '#2196F3',
                    selectedDayTextColor: '#ffffff',
                    todayTextColor: '#2196F3',
                    dayTextColor: '#333',
                    textDisabledColor: '#d9e1e8',
                    dotColor: '#2196F3',
                    selectedDotColor: '#ffffff',
                    arrowColor: '#2196F3',
                    monthTextColor: '#333',
                    textDayFontWeight: '400',
                    textMonthFontWeight: '600',
                    textDayHeaderFontWeight: '500'
                }}
                onDayPress={handleDatePress}
                enableSwipeMonths={true}
            />
        );
    };

    const renderHeader = () => (
        <View style={styles.header}>
          {showSearch ? (
            <View style={styles.searchContainer}>
              <Icon name="magnify" size={24} color="#666" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search work orders..."
                value={searchQuery}
                onChangeText={handleSearch}
                autoFocus
              />
              <TouchableOpacity onPress={() => {
                setShowSearch(false);
                setSearchQuery('');
                setFilteredData(workOrderData);
              }}>
                <Icon name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.headerContent}>
              <Text style={styles.headerTitle}>Work Orders</Text>
              <View style={styles.headerIcons}>
                <TouchableOpacity 
                  style={styles.iconButton}
                  onPress={() => setShowSearch(true)}
                >
                  <Icon name="magnify" size={24} color="#666" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.iconButton}
                  onPress={() => navigation.navigate('WorkOrderCalendar')}
                >
                  <Icon name="calendar-month" size={24} color="#666" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.iconButton}
                  onPress={() => setShowFilterMenu(true)}
                >
                  <Icon name="filter-variant" size={24} color="#666" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      );

    const renderContent = () => {
        if (loading) {
            return (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            );
        }

        if (error) {
            return (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            );
        }

        const dataToDisplay = searchQuery ? filteredData : (selectedDate ? filteredData : workOrderData);

        return (
            <View style={styles.container}>
                {renderHeader()}
                <FAB
                    icon="plus"
                    style={styles.fab}
                    onPress={() => navigation.navigate('AddWorks')}
                />
                <ScrollView style={styles.scrollView}>
                    {renderCalendar()}
                    <View style={styles.listContainer}>
                        {selectedDate && (
                            <View style={styles.selectedDateContainer}>
                                <Text style={styles.selectedDateText}>
                                    Work Orders for {new Date(selectedDate).toLocaleDateString()}
                                </Text>
                                <TouchableOpacity
                                    style={styles.clearFilterButton}
                                    onPress={() => {
                                        setSelectedDate(null);
                                        setFilteredData([]);
                                        setSearchQuery('');
                                    }}
                                >
                                    <Text style={styles.clearFilterText}>Clear Filter</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                        {dataToDisplay.length === 0 ? (
                            <Text style={styles.noDataText}>
                                {searchQuery 
                                    ? 'No matching work orders found'
                                    : selectedDate 
                                        ? 'No work orders for this date' 
                                        : 'No work orders found'}
                            </Text>
                        ) : (
                            dataToDisplay.map((item, index) => (
                                <View key={index}>
                                    {renderWorkOrder({ item })}
                                </View>
                            ))
                        )}
                    </View>
                </ScrollView>
            </View>
        );
    };

    return renderContent();
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollView: {
        flex: 1,
    },
    listContainer: {
        paddingHorizontal: 16,
        paddingBottom: 80, // Space for FAB
    },
    calendar: {
        marginBottom: 16,
        borderRadius: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        backgroundColor: '#fff',
        padding: 8,
        marginHorizontal: 16,
        marginTop: 16,
    },
    workOrderCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    cardLeft: {
        flexDirection: 'row',
        flex: 1,
    },
    dateContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        padding: 8,
        marginRight: 12,
        minWidth: 48,
    },
    dateMonth: {
        fontSize: 12,
        fontWeight: '600',
        color: '#666',
        textTransform: 'uppercase',
    },
    dateDay: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
        marginTop: 2,
    },
    titleContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    workOrderTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    teamText: {
        fontSize: 13,
        color: '#666',
    },
    cardRight: {
        alignItems: 'flex-end',
    },
    priorityBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        marginBottom: 8,
    },
    priorityText: {
        fontSize: 12,
        fontWeight: '600',
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    cardContent: {
        marginTop: 12,
    },
    descriptionText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 12,
        lineHeight: 20,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    partnerText: {
        fontSize: 13,
        color: '#666',
        flex: 1,
        marginRight: 8,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
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
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: '#2196F3',
        zIndex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
    },
    noDataText: {
        textAlign: 'center',
        color: '#666',
        marginTop: 20,
        fontSize: 16,
    },
    selectedDateContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        marginBottom: 16,
    },
    selectedDateText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    clearFilterButton: {
        padding: 8,
        backgroundColor: '#f5f5f5',
        borderRadius: 6,
    },
    clearFilterText: {
        color: '#2196F3',
        fontSize: 14,
        fontWeight: '500',
    },
    header: {
        backgroundColor: '#fff',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    headerIcons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconButton: {
        padding: 8,
        marginLeft: 8,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        padding: 8,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
});