import React, { useState, useMemo, useEffect } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, Text, ScrollView, Platform,ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Card, Searchbar, IconButton, Menu, Divider, Badge, FAB } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format, startOfWeek, endOfWeek, isSameDay, isWithinInterval } from 'date-fns';
import axios from 'axios';
import { getData } from '../../Util/Storage';
import { BASE_URL } from '../../Util/Const';

export default function WorkOrderView() {
    const navigation = useNavigation();
    const [workOrderData, setWorkOrderData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
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

    useEffect(() => {
        const fetchWorkOrders = async () => {
            setLoading(true);
            try {
                const Token = await getData("ACCESS_TOKEN");
                const IDs = await getData("EMPLOYEE_ID");
                console.log("IDs", IDs,Token);
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
                                "fields": ["name", "priority", "stage_id", "due_date", "employee_ids", "contact_location_id", "partner_id"],
                                "domain": [["employee_ids", "in", [17]]]
                            }
                        },
                    }),
                });
                const empData = await empResponse.json();
                console.log("empData.result", empData.result);
                
                if (empData.result) {
                    setWorkOrderData(empData.result);
                    // dispatch(addWorkOrder(empData.result));
                    setError(null);
                } else {
                    setError('No data received from server');
                }
            } catch (err) {
                console.error('Error fetching work orders:', err);
                setError('Failed to fetch work orders');
            } finally {
                setLoading(false);
            }
        };

        fetchWorkOrders();
    }, []);

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
        console.log("status", status);
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

   

    const renderWorkOrder = ({ item }) => (
        <TouchableOpacity onPress={() => navigation.navigate('WorkOrderDetails', { workOrderId: item.id })}>
            <Card style={styles.card} elevation={2}>
                <Card.Content>
                    <View style={styles.cardHeader}>
                        <View style={styles.titleContainer}>
                            <Text style={styles.title}>{item.name}</Text>
                            <View style={styles.badgeContainer}>
                                <Badge 
                                    style={[styles.badge, { backgroundColor: getPriorityColor(parseInt(item.priority)) }]}
                                >
                                    {getPriorityText(parseInt(item.priority))}
                                </Badge>
                                <Badge 
                                    style={[styles.badge, { backgroundColor: getStatusColor(item.stage_id[1]) }]}
                                >
                                    {item.stage_id[1]}
                                </Badge>
                            </View>
                        </View>
                    </View>
                    <View style={styles.cardContent}>
                        {item.contact_location_id && (
                            <View style={styles.infoRow}>
                                <Icon name="map-marker" size={16} color="#666" />
                                <Text style={styles.infoText}>{item.contact_location_id[1]}</Text>
                            </View>
                        )}
                        {item.due_date && (
                            <View style={styles.infoRow}>
                                <Icon name="calendar" size={16} color="#666" />
                                <Text style={styles.infoText}>{new Date(item.due_date).toLocaleDateString()}</Text>
                            </View>
                        )}
                        {item.partner_id && (
                            <View style={styles.infoRow}>
                                <Icon name="account-group" size={16} color="#666" />
                                <Text style={styles.infoText}>{item.partner_id[1]}</Text>
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

    const renderContent = () => {
        if (loading) {
            return (
                <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                    <ActivityIndicator size="large" color="#007AFF" />
                </View>
            );
        }

        if (error) {
            return (
                <View style={styles.container}>
                    <Text>Error: {error}</Text>
                </View>
            );
        }

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
                            onPress={() => setShowFilterMenu(false)}
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

                {viewMode === 'week' ? <WeekPicker /> : <MonthPicker />}
                
                {showDatePicker && (
                    <DateTimePicker
                        value={selectedDate}
                        mode="date"
                        display="default"
                        onChange={handleDateChange}
                    />
                )}
                
                <FlatList
                    data={workOrderData.filter(order => {
                        // Search query filter
                        const searchMatches = !searchQuery || 
                            (order.name && order.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
                            (order.contact_location_id && order.contact_location_id[1].toLowerCase().includes(searchQuery.toLowerCase())) ||
                            (order.partner_id && order.partner_id[1].toLowerCase().includes(searchQuery.toLowerCase()));

                        // Date filter
                        let dateMatches = true;
                        if (filters.dueDate && order.due_date) {
                            const orderDueDate = new Date(order.due_date);
                            const filterDate = new Date(filters.dueDate);
                            
                            dateMatches = (
                                orderDueDate.getFullYear() === filterDate.getFullYear() &&
                                orderDueDate.getMonth() === filterDate.getMonth() &&
                                orderDueDate.getDate() === filterDate.getDate()
                            );
                        }

                        // Status filter based on stage_id[1]
                        const statusMatches = !filters.status || (
                            (filters.status === 'New' && order.stage_id[1] === 'New') ||
                            (filters.status === 'In Progress' && order.stage_id[1] === 'In Progress') ||
                            (filters.status === 'On Hold' && order.stage_id[1] === 'On Hold') ||
                            (filters.status === 'Done' && order.stage_id[1] === 'Done')
                        );

                        // Priority filter (converting string to number)
                        const priorityMatches = !filters.priority || parseInt(order.priority) === filters.priority;

                        // Location filter
                        const locationMatches = !filters.location || 
                            (order.contact_location_id && order.contact_location_id[0] === filters.location);

                        // Partner/Vendor filter
                        const vendorMatches = !filters.vendor || 
                            (order.partner_id && order.partner_id[0] === filters.vendor);

                        return dateMatches && searchMatches && statusMatches && 
                               priorityMatches && locationMatches && vendorMatches;
                    })}
                    renderItem={renderWorkOrder}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContainer}
                />

                <FAB
                    icon="plus"
                    style={styles.fab}
                    onPress={() => navigation.navigate('NewWorkOrder')}
                />
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
    cardContent: {
        padding: 8,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    infoText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 4,
    },
});