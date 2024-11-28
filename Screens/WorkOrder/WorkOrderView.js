import React, { useState } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Card, Searchbar, IconButton, Menu, Divider, Badge, FAB } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';

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
        dueDate: null,
        location: null,
        priority: null,
        category: null,
        workType: null,
        asset: null,
        assetType: null,
        vendor: null
    });

    const handleDateChange = (event, date) => {
        setShowDatePicker(false);
        if (date) {
            setSelectedDate(date);
            setFilters(prev => ({ ...prev, dueDate: date }));
        }
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

    const filteredWorkOrders = workOrders.filter(wo => {
        let matches = true;
        const searchLower = searchQuery.toLowerCase();

        // Search filter
        if (searchQuery) {
            matches = wo.task?.toLowerCase().includes(searchLower) ||
                     wo.description?.toLowerCase().includes(searchLower) ||
                     wo.location?.toLowerCase().includes(searchLower) ||
                     wo.asset?.toLowerCase().includes(searchLower);
        }

        // Date filter
        if (matches && filters.dueDate) {
            const woDate = new Date(wo.dueDate);
            matches = woDate.toDateString() === filters.dueDate.toDateString();
        }

        // Other filters
        if (matches && filters.location) matches = wo.location === filters.location;
        if (matches && filters.priority !== null) matches = wo.priorityIndex === filters.priority;
        if (matches && filters.workType) matches = wo.workType === filters.workType;
        if (matches && filters.asset) matches = wo.asset === filters.asset;

        return matches;
    });

    const renderWorkOrder = ({ item }) => (
        <TouchableOpacity onPress={() => navigation.navigate('WorkOrderDetails', { workOrderId: item.id })}>
            <Card style={styles.card} elevation={2}>
                <Card.Content>
                    <View style={styles.cardHeader}>
                        <View style={styles.titleContainer}>
                            <Text style={styles.title}>{item.task || 'Untitled Task'}</Text>
                            <Badge 
                                style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priorityIndex) }]}
                            >
                                {getPriorityText(item.priorityIndex)}
                            </Badge>
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

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.calendarButton}
                    onPress={() => setShowDatePicker(true)}
                >
                    <Icon name="calendar" size={24} color="#007AFF" />
                    <Text style={styles.calendarText}>
                        {format(selectedDate, 'MMM dd, yyyy')}
                    </Text>
                </TouchableOpacity>

                <Searchbar
                    placeholder="Search work orders..."
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    style={styles.searchBar}
                />

                <Menu
                    visible={showFilterMenu}
                    onDismiss={() => setShowFilterMenu(false)}
                    anchor={
                        <IconButton
                            icon="filter-variant"
                            size={24}
                            onPress={() => setShowFilterMenu(true)}
                        />
                    }
                >
                    <Menu.Item 
                        onPress={() => {
                            setFilters(prev => ({ ...prev, priority: 2 }));
                            setShowFilterMenu(false);
                        }} 
                        title="High Priority" 
                    />
                    <Menu.Item 
                        onPress={() => {
                            setFilters(prev => ({ ...prev, priority: 1 }));
                            setShowFilterMenu(false);
                        }} 
                        title="Medium Priority" 
                    />
                    <Menu.Item 
                        onPress={() => {
                            setFilters(prev => ({ ...prev, priority: 0 }));
                            setShowFilterMenu(false);
                        }} 
                        title="Low Priority" 
                    />
                    <Divider />
                    <Menu.Item 
                        onPress={() => {
                            setFilters({
                                dueDate: null,
                                location: null,
                                priority: null,
                                category: null,
                                workType: null,
                                asset: null,
                                assetType: null,
                                vendor: null
                            });
                            setShowFilterMenu(false);
                        }} 
                        title="Clear Filters" 
                    />
                </Menu>
            </View>

            {showDatePicker && (
                <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                />
            )}

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
    priorityBadge: {
        borderRadius: 4,
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
});