import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Alert, Image, Text, Pressable, ActivityIndicator, Dimensions, FlatList } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import {
  Card,
  Title,
  Paragraph,
  Badge,
  Button,
  Avatar,
  List,
  Divider,
  Portal,
  Dialog,
  TextInput,
  useTheme,
  IconButton,
  Chip,
  Surface,
  Menu,
  SegmentedButtons,
} from 'react-native-paper';
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { RootState } from '../../redux/store';
import { updateWorkOrder } from '../../redux/slices/workOrderSlice';
import { WorkOrder } from '../../redux/types/workorder';
import * as ImagePicker from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getData, getObjectData, storeData } from '../../Util/Storage';
import { BASE_URL } from '../../Util/Const';
import WorkOrderList from './WorkOrderList';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import RNFS from 'react-native-fs';
import { BottomSheet } from '@rneui/themed';

const WorkOrderDetails = () => {

  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const { workOrderId } = route.params?.workOrderId || {};
  const selectedParts = useSelector((state: any) =>
    state.partQuantity.selectedParts[workOrderId] || []
  );

  console.log("Work Order", route.params?.workOrderId);
  const Colour = "#3e85f7";
  const isFocus = useIsFocused();
  const [workOrderData, setWorkOrderData] = useState([]);
  const [MainTainancePartsData, setMainTainancePartsData] = useState([]);
  const [TimeSheetData, setTimeSheetData] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [Expenses, SetExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState(null);
  const [addedParts, setAddedParts] = useState([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [description, setDescription] = useState('');
  const [unitAmount, setUnitAmount] = useState('');
  const [Category, SetCategory] = useState('choose');
  const [modalData, setModalData] = useState([]);
  const [visible2, setVisible2] = useState(false);
  const [types, setTypes] = useState('');
  const [ProductId, setProductId] = useState('');
  const [ProductName, setProductName] = useState('choose');

  const [filteredModalData, setFilteredModalData] = useState([]);
  const [multiSelectedParts, setMultiSelectedParts] = useState([]);
  const [multiSelectedUsers, setMultiSelectedUsers] = useState([]);
  const [ProductData, SetProductData] = useState([]);
  const [UserData, SetUserData] = useState([]);
  const [Userid, SetUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [showTimeEntryModal, setShowTimeEntryModal] = useState(false);
  const [timeDescription, setTimeDescription] = useState('');
  const [timeHours, setTimeHours] = useState('');
  const [timeMinutes, setTimeMinutes] = useState('');
  const [EmployeeData, SetEmployeeData] = useState([]);

  const [maintenanceStages, setMaintenanceStages] = useState<MaintenanceStage[]>([]);
  const [selectedStage, setSelectedStage] = useState<number>(1);
  const [isStageModalVisible, setIsStageModalVisible] = useState(false);

  const [showMoreInfoModal, setShowMoreInfoModal] = useState(false);

  interface WorkOrder {
    id: number;
    name: string;
    priority: string;
    stage_id: [number, string];
    due_date: string | false;
    employee_ids: number[];
    contact_location_id: [number, string] | false;
    partner_id: [number, string] | false;
  }

  interface MaintenanceStage {
    id: number;
    name: string;
  }

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'New':
        return '#2196F3';
      case 'In Progress':
        return '#FF9800';
      case 'Done':
        return '#4CAF50';
      default:
        return '#808080';
    }
  };

  console.log("Work Order Data", workOrderData, MainTainancePartsData, TimeSheetData, attachments);

  const formatMultipleSelections = (items: any) => {
    if (!items || items.length === 0) return 'choose';
    if (items.length === 1) return items[0].name;
    return `${items[0].name} +${items.length - 1}`;
  };

  const handleTimeEntrySubmit = async () => {
    if (!timeDescription || (!timeHours && !timeMinutes)) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Convert hours and minutes to decimal hours
    const hours = parseFloat(timeHours) || 0;
    const minutes = parseFloat(timeMinutes) || 0;
    const totalHours = hours + (minutes / 60);

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
            model: "account.analytic.line",
            method: "create",
            args: [{
              employee_id: EmployeeData?.id, // Use just the ID from EmployeeData
              name: timeDescription,
              project_id: 43,
              unit_amount: totalHours,
              maintenance_id: route.params?.workOrderId
            }],
            kwargs: {}
          }
        }),
      });
      const data = await response.json();
      console.log("Time entry response:", data);
      if (data?.result) {
        Alert.alert('Success', 'Time entry added successfully');
        setShowTimeEntryModal(false);
        setTimeDescription('');
        setTimeHours('');
        setTimeMinutes('');
      } else if (data?.error) {
        console.error('Server error:', data.error);
        Alert.alert('Error', data.error?.data?.message || 'Failed to add time entry');
      }
    } catch (error) {
      console.error('Error adding time entry:', error);
      Alert.alert('Error', 'Failed to add time entry');
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        await fetchMaintenanceStages();
        await fetchWorkOrders();
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };
    fetchInitialData();
  }, [isFocus]);

  const CACHE_KEYS = {
    workOrder: (id) => `workOrder_${id}`,
    parts: (id) => `workOrder_parts_${id}`,
    timesheet: (id) => `workOrder_timesheet_${id}`,
    attachments: (id) => `workOrder_attachments_${id}`,
    expenses: (id) => `workOrder_expenses_${id}`,
  };

  const CACHE_EXPIRY = 30 * 60 * 1000;

  const isCacheValid = (timestamp) => {
    return timestamp && Date.now() - timestamp < CACHE_EXPIRY;
  };

  const fetchWorkOrders = async () => {
    if (!route.params?.workOrderId) return;

    setLoading(true);
    try {
      const cachedData = await getObjectData(CACHE_KEYS.workOrder(route.params?.workOrderId));
      if (cachedData && isCacheValid(cachedData.timestamp)) {
        setWorkOrderData(cachedData.data);
        setLoading(false);
        return;
      }

      const Token = await getData("ACCESS_TOKEN");

      console.log("Token", Token);
      const empResponse = await fetch(`${BASE_URL}/web/dataset/call_kw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': `X-OpenERP=${Token}`,
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          params: {
            model: "maintenance.request",
            method: "search_read",
            args: [],
            kwargs: {
              fields: ["name", "priority", "stage_id", "due_date", "employee_ids", "contact_location_id", "partner_id", "request_date", "maintenance_team_id", "start_date", "maintenance_type_id", "maintenance_category_id", "maintenance_part_ids", "timesheet_ids", "checklist_template_ids", "partner_id", "description", "estimated_time"],
              domain: [["id", "in", [route.params?.workOrderId]]]
            }
          },
        }),
      });
      const empData = await empResponse.json();
      console.log("empData.result WorkOrder", empData.result);

      if (empData.result) {
        await storeData(CACHE_KEYS.workOrder(route.params?.workOrderId), {
          data: empData.result,
          timestamp: Date.now()
        });
        setWorkOrderData(empData.result);
        console.log("WorkOrder maintainence part", empData.result[0]?.maintenance_part_ids)
        MainTainancePart(empData?.result[0]?.maintenance_part_ids);
        TimeSheet(empData?.result[0]?.timesheet_ids)
        Attachment(empData?.result[0]?.checklist_template_ids)
        Expense(empData?.result[0]?.id)


        // dispatch(addWorkOrder(empData.result));
        setError("");
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

  const handleAddTimesheet = async () => {
    try {
      // await createTimesheetEntry(1, description, 43, parseFloat(unitAmount), workOrderId);
      Alert('Timesheet entry created successfully!');
    } catch (error) {
      Alert('Failed to create timesheet entry.');
    }
  };

  const fetchMaintenanceStages = async () => {
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
            model: "maintenance.stage",
            method: "search_read",
            args: [],
            kwargs: {
              fields: ["name"]
            }
          }
        }),
      });

      const data = await response.json();
      if (data.result) {
        setMaintenanceStages(data.result);
        console.log("maintenanceStages", maintenanceStages);
      } else {
        console.error("Failed to fetch maintenance stages");
      }
    } catch (error) {
      console.error("Error fetching maintenance stages:", error);
    }
  };

  const updateWorkOrderStage = async (stageId: number) => {
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
            method: "write",
            args: [[route.params?.workOrderId], { stage_id: stageId }],
            kwargs: {}
          }
        }),
      });

      const data = await response.json();
      if (data.result) {
        setSelectedStage(stageId);
        Alert.alert('Work order status updated successfully');
        setIsStageModalVisible(false);
        // Refresh work order details after status update
        fetchWorkOrders();
      } else {
        console.error("Failed to update work order stage");
        Alert.alert('Failed to update work order status');
      }
    } catch (error) {
      console.error("Error updating work order stage:", error);
      Alert.alert('Error updating work order status');
    }
  };

  const handlePartSelection = (multiSelectedParts: any) => {
    console.log("multiSelectedParts", multiSelectedParts)

    if (!multiSelectedParts) {
      console.warn('No part selected');
      return;
    }
    console.log("types for navigates", types)
    if (types === 'Cost') {
      navigation.navigate('AddExpense', {
        workOrderId: route.params?.workOrderId,
        selectedPart: multiSelectedParts
      });
    }
    else {
      navigation.navigate('AddQuantity', {
        workOrderId: route.params?.workOrderId,
        selectedPart: multiSelectedParts
      });
    }
    // navigation.navigate('AddQuantity', {
    //   workOrderId:route.params?.workOrderId,
    //   selectedPart: multiSelectedParts
    // });
  };


  const onSelectPicker = (type: any) => {
    console.log("types", type)
    if (type === 'PartsTypes') {

      setTypes(type)
      console.log("heloo1", modalData)

    }

    else if (type === 'AssignedTo') {

      // setTypes(type)
      // setModalData(UserData)

    }
    else if (type === 'Category') {


      setTypes(type)

      console.log("heloo2", modalData)
    }
    else if (type === 'Cost') {
      setModalData(ProductData)
      setTypes(type)

    }
    else if (type === 'Customer') {

      setTypes(type)

    }
    else if (type === 'PartsTypes') {

      setTypes(type)

    }
    else if (type === 'Parts') {
      setModalData(ProductData)
      setTypes(type)

    }
    else {
      // setModalData(Monthss)
      // setTypes(type)
      // console.warn("months", type, Monthss)
    }

    setVisible2(true)
  }

  const onSelectItem = (item: any) => {
    console.log("types", item)
    if (item.field === 'Location') {
    }

    else if (item.field === 'WorkType') {


    }
    else if (item.field === 'Category') {

    }
    else if (item.field === 'Parts') {
      console.log("item44", item)
      const isSelected = multiSelectedParts.some(part => part.id === item.id);
      if (isSelected) {
        const updatedParts = multiSelectedParts.filter(part => part.id !== item.id);
        setMultiSelectedParts(updatedParts);
        setProductName(formatMultipleSelections(updatedParts));
        setProductId(updatedParts.map(p => p.id).join(','));
      } else {
        const updatedParts = [...multiSelectedParts, item];
        setMultiSelectedParts(updatedParts);
        setProductName(formatMultipleSelections(updatedParts));
        setProductId(updatedParts.map(p => p.id).join(','));
      }
      return;
    }
    else if (item.field === 'User') {
      // SetUserId(item.id);
      // setUserName(item.name);
      // setVisible2(false); // Close user selection modal
      setShowTimeEntryModal(true);

    }
    else if (item.field === 'Customer') {

    }
    else if (item.field === 'PartsTypes') {

    }
    else if (item.field === 'Location') {


    }
    else {

    }

    if (item.field !== 'Parts' && item.field !== 'User') {
      setVisible2(false);
    }
  }

  const MainTainancePart = async (ids: any) => {
    console.log("ids", ids);
    setLoading(true);
    try {
      const cachedData = await getObjectData(CACHE_KEYS.parts(route.params?.workOrderId));
      if (cachedData && isCacheValid(cachedData.timestamp)) {
        setMainTainancePartsData(cachedData.data);
        setLoading(false);
        return;
      }

      const Token = await getData("ACCESS_TOKEN");

      console.log("Token", Token);
      const empResponse = await fetch(`${BASE_URL}/web/dataset/call_kw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': `X-OpenERP=${Token}`,
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          params: {
            model: "leap.maintenance.part",
            method: "search_read",
            args: [[["maintenance_request_id", "=", route.params?.workOrderId]]],
            kwargs: {
              fields: ["product_id", "qty_estimated",]
            }
          }
        }),
      });
      const empData = await empResponse.json();
      console.log("empData.result", empData.result);

      if (empData.result) {
        await storeData(CACHE_KEYS.parts(route.params?.workOrderId), {
          data: empData.result,
          timestamp: Date.now()
        });
        setMainTainancePartsData(empData.result);
        console.log("WorkOrder maintainence part", empData.result);
        // dispatch(addWorkOrder(empData.result));
        setError("");
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

  const handleSearch = (text: any) => {
    setSearchQuery(text);
    if (text) {
      const filtered = modalData.filter(item => {
        if (!item || !item.name) return false;
        const searchTerm = text.toLowerCase();
        const itemName = String(item.name).toLowerCase();
        return itemName.includes(searchTerm);
      });
      setFilteredModalData(filtered);
    } else {
      setFilteredModalData(modalData);
    }
  };


  const TimeSheet = async (ids: any) => {
    console.log("ids", ids);
    setLoading(true);
    try {
      const cachedData = await getObjectData(CACHE_KEYS.timesheet(route.params?.workOrderId));
      if (cachedData && isCacheValid(cachedData.timestamp)) {
        setTimeSheetData(cachedData.data);
        setLoading(false);
        return;
      }

      const Token = await getData("ACCESS_TOKEN");

      console.log("Token", Token);
      const empResponse = await fetch(`${BASE_URL}/web/dataset/call_kw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': `X-OpenERP=${Token}`,
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          params: {
            model: "account.analytic.line",
            method: "search_read",
            args: [],
            kwargs: {
              fields: ["employee_id", "unit_amount"],
              domain: [["id", "in", ids]]
            }
          },
        }),
      });
      const empData = await empResponse.json();
      console.log("empData.result", empData.result);

      if (empData.result) {
        await storeData(CACHE_KEYS.timesheet(route.params?.workOrderId), {
          data: empData.result,
          timestamp: Date.now()
        });
        setTimeSheetData(empData.result);
        console.log("WorkOrder TimeSheet", empData.result);
        // dispatch(addWorkOrder(empData.result));
        setError("");
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

  const Attachment = async (ids: any) => {
    console.log("ids", ids);
    setLoading(true);
    try {
      const cachedData = await getObjectData(CACHE_KEYS.attachments(route.params?.workOrderId));
      if (cachedData && isCacheValid(cachedData.timestamp)) {
        setAttachments(cachedData.data);
        setLoading(false);
        return;
      }

      const Token = await getData("ACCESS_TOKEN");

      console.log("Token", Token);
      const empResponse = await fetch(`${BASE_URL}/web/dataset/call_kw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': `X-OpenERP=${Token}`,
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          params: {
            model: "ir.attachment",
            method: "search_read",
            args: [],
            kwargs: {
              fields: ["name", "datas"],
              domain: [["document_maintenance_id", "=", route.params?.workOrderId]]
            }
          }
        }),
      });
      const empData = await empResponse.json();
      console.log("empData.result", empData.result);

      if (empData.result) {
        await storeData(CACHE_KEYS.attachments(route.params?.workOrderId), {
          data: empData.result,
          timestamp: Date.now()
        });
        setAttachments(empData.result);
        console.log("WorkOrder Attachment", empData.result);
        // dispatch(addWorkOrder(empData.result));
        setError("");
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

  const Expense = async (id: any) => {
    console.log("workorder id for expense", id);
    setLoading(true);
    try {
      const cachedData = await getObjectData(CACHE_KEYS.expenses(route.params?.workOrderId));
      if (cachedData && isCacheValid(cachedData.timestamp)) {
        SetExpenses(cachedData.data);
        setLoading(false);
        return;
      }

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
            model: "hr.expense",
            method: "search_read",
            args: [],
            kwargs: {
              fields: ["name", "employee_id", "total_amount_currency", "product_id"],
              domain: [["maintenance_id", "=", id]]
            }
          },
        }),
      });
      const data = await response.json();
      console.log("Expense data", data.result);

      if (data.result) {
        await storeData(CACHE_KEYS.expenses(route.params?.workOrderId), {
          data: data.result,
          timestamp: Date.now()
        });
        SetExpenses(data.result);
        setError("");
      } else {
        setError('No expense data received from server');
      }
    } catch (err) {
      console.error('Error fetching expenses:', err);
      setError('Failed to fetch expenses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const employeeData = async () => {
      const Data = await getObjectData("EMPLOYEE_DATA");
      console.log("EMPLOYEE_DATA", Data?.id);
      if (Data) {
        SetEmployeeData(Data);
      }
    }
    employeeData();
    ProductsList();
    // UserDetails();
  }, [isFocus]);


  // const UserDetails = async () => {
  //   // console.log("ids", ids);
  //   setLoading(true);
  //   try {
  //     const Token = await getData("ACCESS_TOKEN");

  //     console.log("Token", Token);
  //     const empResponse = await fetch(`${BASE_URL}/web/dataset/call_kw`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Cookie': `X-OpenERP=${Token}`,
  //       },
  //       body: JSON.stringify({
  //         jsonrpc: '2.0',
  //         params: {
  //           "model": "hr.employee",
  //           "method": "search_read",
  //           "args": [],

  //           "kwargs": {
  //             "fields": ["name"],
  //             "domain": []
  //           }
  //         },
  //       }),
  //     });
  //     const empData = await empResponse.json();
  //     console.log("empData.result user", empData.result);

  //     if (empData.result) {
  //       let temp = [];
  //       empData?.result?.map(item => {
  //         temp.push({
  //           field: "User",
  //           ...item,
  //         });
  //       });
  //       SetUserData(temp);
  //       console.log("Customer temp", temp)
  //       console.log("WorkOrder maintainence part", empData.result);
  //       // dispatch(addWorkOrder(empData.result));
  //       setError("");
  //     } else {
  //       setError('No data received from server');
  //     }
  //   } catch (err) {
  //     console.error('Error fetching work orders:', err);
  //     setError('Failed to fetch work orders');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const ProductsList = async () => {
    // console.log("ids", ids);
    setLoading(true);
    try {
      const Token = await getData("ACCESS_TOKEN");

      console.log("Token", Token);
      const empResponse = await fetch(`${BASE_URL}/web/dataset/call_kw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': `X-OpenERP=${Token}`,
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          params: {
            "model": "product.product",
            "method": "search_read",
            "args": [],
            "kwargs": {
              "fields": ["name", "free_qty", "default_code"],
              // "domain":[["can_be_expensed","=",true]]
              "domain": [["is_spare_part", "=", true]]
            }
          },
        }),
      });
      const empData = await empResponse.json();
      console.log("empData.result Parts", empData.result);

      if (empData.result) {

        let temp = [];
        empData?.result?.map(item => {
          temp.push({
            field: "Parts",
            ...item,
          });
        });
        console.log("Customer temp", temp)
        SetProductData(temp);
        console.log("WorkOrder maintainence part", empData.result);
        // dispatch(addWorkOrder(empData.result));
        setError("");
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


  const formatDate = (dateString: string | false) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  const fetchTimeSheetData = async () => {
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
            model: "leap.maintenance.part",
            method: "search_read",
            args: [],
            kwargs: {
              fields: ["product_id", "qty_estimated",]
            }
          }
        })
      });
      const data = await response.json();
      if (data?.result) {
        setAddedParts(data.result);
      }
    } catch (error) {
      console.error('Error fetching added parts:', error);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case '0':
        return 'blue';
      case '1':
        return 'green';
      case '2':
        return 'yellow';
      case '3':
        return 'red';
      default:
        return 'blue';
    }
  };

  const [status, setStatus] = useState('open');
  const statusButtons = [
    { value: 'open', label: 'Open' },
    { value: 'on hold', label: 'On Hold' },
    { value: 'in progress', label: 'In Progress' },
    { value: 'done', label: 'Done' },
  ];

  const getStatusStyle = (value, isSelected) => {
    if (!isSelected) {
      return { backgroundColor: '#fff', color: '#666' };
    }
    switch (value) {
      case 1:
        return { backgroundColor: '#1E90FF', color: 'white' };
      case 2:
        return { backgroundColor: '#FFD700', color: 'black' };
      case 3:
        return { backgroundColor: '#2196F3', color: 'white' };
      case 4:
        return { backgroundColor: '#4CAF50', color: 'white' };
      default:
        return { backgroundColor: '#fff', color: '#666' };
    }
  };

  const getStatusIcon = (value, isSelected) => {
    const iconName = (() => {
      switch (value) {
        case 1: return 'folder-open';
        case 2: return 'pause-circle';
        case 3: return 'progress-clock';
        case 4: return 'check-circle';
        default: return 'folder-open';
      }
    })();
    return { name: iconName, color: isSelected ? getStatusStyle(value, true).color : '#666' };
  };

  const handleStatusChange = async (newStageId: number) => {
    try {
      await updateWorkOrderStage(newStageId);
      // The status will be updated automatically when the work order is refreshed
    } catch (error) {
      console.error('Error updating status:', error);
      Alert.alert('Error', 'Failed to update status');
    }
  };

  const [showTimeDialog, setShowTimeDialog] = useState(false);
  const [showCostDialog, setShowCostDialog] = useState(false);
  const [laborHours, setLaborHours] = useState('0');
  const [laborMinutes, setLaborMinutes] = useState('0');
  const [materialCost, setMaterialCost] = useState('0');

  const handleTimeUpdate = () => {
    const hours = parseInt(laborHours);
    const minutes = parseInt(laborMinutes);

    if (isNaN(hours) || hours < 0 || isNaN(minutes) || minutes < 0 || minutes >= 60) {
      Alert.alert('Invalid Input', 'Please enter valid hours and minutes (minutes should be between 0-59)');
      return;
    }

    // dispatch(updateWorkOrder({
    //   ...workOrder,
    //   laborTime: {
    //     hours,
    //     minutes
    //   },
    //   lastUpdated: new Date().toISOString(),
    // }));
    setShowTimeDialog(false);
  };

  const handleCostUpdate = () => {
    const cost = parseFloat(materialCost);
    if (isNaN(cost) || cost < 0) {
      Alert.alert('Invalid Input', 'Please enter a valid cost');
      return;
    }

    // dispatch(updateWorkOrder({
    //   ...workOrder,
    //   materialCost: cost,
    //   lastUpdated: new Date().toISOString(),
    // }));
    setShowCostDialog(false);
  };

  const formatLaborTime = (hours: number, minutes: number) => {
    return `${hours}h ${minutes}m`;
  };

  const calculateTotalCostss = () => {
    const hourlyRate = 50; // You might want to make this configurable
    const hours = parseInt(laborHours) || 0;
    const minutes = parseInt(laborMinutes) || 0;
    const laborCost = (hours + minutes / 60) * hourlyRate;
    const materials = parseFloat(materialCost) || 0;
    return laborCost + materials;
  };

  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleMoreInfo = () => {
    setShowMoreInfoModal(true);
  };

  const FileUpload = async (fileData: any) => {
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
          // params: {
          //   model: "maintenance.request",
          //   method: "create",
          //   args: [
          //      ,
          //     { maintenance_id:route.params?.workOrderId,
          //       name:fileData.name,
          //       company_id:1,
          //       maintenance_team_id:1, 
          //       partner_id:1122, 
          //       maintenance_picture_ids: [[0, 0, {
          //         name: fileData.name,
          //         mimetype: fileData.type,
          //         datas: fileData.base64Data,
          //       }]]
          //     }
          //   ],
          //   kwargs: {}
          // }
          params: {
            "model": "ir.attachment",
            "method": "create",
            "args": [{
              name: fileData.name || 'image.jpg',
              document_maintenance_id: route.params?.workOrderId,
              mimetype: fileData.type,
              company_id: 1,
              datas: fileData.base64Data
            }],
            "kwargs": {}
          },

        })
      });


      const data = await response.json();
      if (data?.result) {
        console.log("File uploaded successfully");
        return true;
      } else if (data?.error) {
        console.error("Upload error:", data.error);
        throw new Error(data.error?.data?.message || "Upload failed");
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };

  const handleImagePicker = async () => {
    try {
      const results = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
      });

      const fileData = {
        name: results[0].name,
        type: results[0].type,
        base64Data: await RNFS.readFile(results[0].uri, 'base64'),
      };

      await FileUpload(fileData);
      Alert.alert('Success', 'File uploaded successfully');
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        console.error('Error picking document:', err);
        Alert.alert('Error', 'Failed to upload file');
      }
    }
  };


  // const handleFilePicker = async () => {
  //   try {
  //     const results = await DocumentPicker.pick({
  //       type: [
  //         DocumentPicker.types.images,
  //         DocumentPicker.types.pdf,
  //         DocumentPicker.types.doc,
  //         DocumentPicker.types.docx,
  //         DocumentPicker.types.xls,
  //         DocumentPicker.types.xlsx,
  //       ],
  //       allowMultiSelection: true,
  //     });

  //     const newAttachments = results.map(file => ({
  //       name: file.name,
  //       type: file.type,
  //       uri: file.uri,
  //       size: file.size,
  //     }));

  //     setAttachments(prev => [...prev, ...newAttachments]);
  //     Alert.alert('Success', 'Files uploaded successfully');
  //   } catch (err) {
  //     if (DocumentPicker.isCancel(err)) {
  //       // User cancelled the picker
  //       console.log('User cancelled file picker');
  //     } else {
  //       Alert.alert('Error', 'Error picking files. Please try again.');
  //       console.error('Error picking files:', err);
  //     }
  //   }
  // };

  const handleSaveAndNavigate = () => {
    if (multiSelectedParts.length === 0) {
      Alert.alert('Error', 'Please select at least one part');
      return;
    }
    setVisible2(false); // Close the modal
    handlePartSelection(multiSelectedParts); // Navigate to AddQuantity
  };

  const fetchAddedParts = async () => {
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
            model: "leap.maintenance.part",
            method: "search_read",
            args: [[["maintenance_request_id", "=", route.params?.workOrderId]]],
            kwargs: {
              fields: ["product_id", "qty_estimated",]
            }
          }
        })
      });
      const data = await response.json();
      if (data?.result) {
        setAddedParts(data.result);
      }
    } catch (error) {
      console.error('Error fetching added parts:', error);
    }
  };
  const handleDocumentUpload = async (fileData: any) => {
    try {
      const Token = await getData("ACCESS_TOKEN");
      const response = await fetch(`${BASE_URL}/web/dataset/call_kw`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Token}`,
        },
        body: JSON.stringify({
          "jsonrpc": "2.0",
          "method": "call",
          "params": {
            "model": "ir.attachment",
            "method": "create",
            "args": [{
              "name": fileData.name,
              "document_maintenance_id": route.params?.workOrderId,
              "mimetype": fileData.type,
              "company_id": 1,
              "datas": fileData.base64Data
            }],
            "kwargs": {}
          }
        }),
      });
      const result = await response.json();
      if (result.error) {
        throw new Error(result.error.data.message);
      }
      return result;
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  };

  const handleDocumentPicker = async () => {
    try {
      const results = await DocumentPicker.pick({
        type: [
          DocumentPicker.types.pdf,
          DocumentPicker.types.doc,
          DocumentPicker.types.docx,
          DocumentPicker.types.xls,
          DocumentPicker.types.xlsx,
        ],
        allowMultiSelection: true,
      });

      for (const file of results) {
        const fileData = {
          name: file.name,
          type: file.type,
          base64Data: await RNFS.readFile(file.uri, 'base64'),
        };

        await handleDocumentUpload(fileData);
      }

      setAttachments(prev => [...prev, ...results.map(file => ({
        name: file.name,
        type: file.type,
        uri: file.uri,
        size: file.size,
      }))]);

      Alert.alert('Success', 'Documents uploaded successfully');
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        console.error('Error picking document:', err);
        Alert.alert('Error', 'Failed to upload documents');
      }
    }
  };


  useEffect(() => {
    fetchAddedParts();
    fetchTimeSheetData();
  }, [route.params?.workOrderId, isFocus]);

  const calculateTotalCost = () => {
    return Expenses.reduce((total, expense) => {
      return total + (expense.total_amount_currency || 0);
    }, 0);
  };

  const calculateTotalQuantity = () => {
    return MainTainancePartsData.reduce((total, part) => {
      return total + (part.qty_estimated || 0);
    }, 0);
  };

  const calculateTotalWorkHours = () => {
    return TimeSheetData.reduce((total, entry) => {
      return total + (entry.unit_amount || 0);
    }, 0);
  };

  const fetchAttachments = async () => {
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
            model: "ir.attachment",
            method: "search_read",
            args: [],
            kwargs: {
              fields: ["name", "datas"],
              domain: [["document_maintenance_id", "=", route.params?.workOrderId]]
            }
          }
        }),
      });
      const data = await response.json();
      if (data?.result) {
        setAttachments(data.result);
      }
    } catch (error) {
      console.error('Error fetching attachments:', error);
    }
  };

  useEffect(() => {
    fetchAttachments();
  }, [route.params?.workOrderId, isFocus]);

  const getStageIcon = (stageName: string) => {
    switch (stageName.toLowerCase()) {
      case 'new':
        return 'file-tray';
      case 'in progress':
        return 'construct';
      case 'done':
        return 'checkmark-circle';
      case 'cancelled':
        return 'close-circle';
      default:
        return 'ellipsis-horizontal';
    }
  };

  const handleEmployeePress = async () => {
    if (workOrderData && workOrderData[0]?.employee_ids) {
      setLoading(true);
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
              model: "hr.employee",
              method: "search_read",
              args: [],
              kwargs: {
                fields: ["name", "emp_pass"],
                domain: [["id", "in", workOrderData[0].employee_ids]]
              }
            }
          })
        });
        const data = await response.json();
        if (data.result) {
          navigation.navigate('EmployeeDetails', {
            employees: data.result
          });
        }
      } catch (error) {
        console.error('Error fetching employees:', error);
        Alert.alert('Error', 'Failed to fetch employee details');
      } finally {
        setLoading(false);
      }
    }
  };

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const windowWidth = Dimensions.get('window').width;

  const renderImageItem = ({ item, index }) => (
    <TouchableOpacity 
      style={styles.carouselItem}
      onPress={() => navigation.navigate('ViewAttachments', {
        workOrderId: route.params?.workOrderId
      })}
    >
      <Image
        source={{ uri: `data:${item.mimetype || 'image/jpeg'};base64,${item.datas}` }}
        style={styles.carouselImage}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        {/* {workOrderData.map((order) => (
      <Card key={order.id} style={styles.card}>
        <Card.Content>
          <View style={styles.header}>
            <Title style={{fontWeight:"bold",color:"#000"}}>{order.name}</Title>
            <Chip style={[styles.priorityBadge, { backgroundColor: getPriorityColor(order.priority) }]}>
              {order.priority=== '0' ? 'Normal' : order.priority === '1' ? 'Low' : order.priority === '2' ? 'Medium' : order.priority === '3' ? 'High' : 'Normal'}
            </Chip>
          </View>
          <Paragraph style={{fontWeight:"bold",color:"#000"}}>Stage: {order.stage_id[1]}</Paragraph>
          <Paragraph style={{fontWeight:"bold",color:"#000"}}>Due Date: {order.due_date || 'N/A'}</Paragraph>
          <Paragraph style={{fontWeight:"bold",color:"#000"}}>Request Date: {order.request_date || 'N/A'}</Paragraph>
          <View style={[styles.statusSection,{backgroundColor:"red",}]}>
            <Title style={styles.sectionTitle}>Status</Title>
            <SegmentedButtons
              value={status}
              onValueChange={handleStatusChange}
              buttons={statusButtons.map(button => ({
                ...button,
                style: [styles.statusButton, getStatusStyle(button.value, status === button.value)],
                labelStyle: [
                  styles.statusLabel,
                  { color: getStatusStyle(button.value, status === button.value).color }
                ],
                icon: ({size}) => {
                  const icon = getStatusIcon(button.value, status === button.value);
                  return <Icon name={icon.name} size={20} color={icon.color} />;
                }
              }))}
              style={styles.segmentedButtons}
            />
          </View>
        </Card.Content>
        <View style={[styles.statusSection,{backgroundColor:"red",}]}>
            <Title style={styles.sectionTitle}>Status</Title>
            <SegmentedButtons
              value={status}
              onValueChange={handleStatusChange}
              buttons={statusButtons.map(button => ({
                ...button,
                style: [styles.statusButton, getStatusStyle(button.value, status === button.value)],
                labelStyle: [
                  styles.statusLabel,
                  { color: getStatusStyle(button.value, status === button.value).color }
                ],
                icon: ({size}) => {
                  const icon = getStatusIcon(button.value, status === button.value);
                  return <Icon name={icon.name} size={20} color={icon.color} />;
                }
              }))}
              style={styles.segmentedButtons}
            />
          </View>
      </Card>
      
    ))} */}
        <View style={[styles.statusSection, {}]}>
          <Title style={styles.sectionTitle}> {workOrderData[0]?.name || 'N/A'}</Title>
          <Title style={styles.sectionTitle}>Status:</Title>
          <View style={styles.stageButtonsContainer}>
            {maintenanceStages.map(stage => (
              <TouchableOpacity
                key={stage.id}
                onPress={() => handleStatusChange(stage.id)}
                style={[
                  styles.stageButton,
                  workOrderData[0]?.stage_id?.[0] === stage.id && styles.activeStageButton
                ]}
              >
                <Text style={[
                  styles.stageButtonText,
                  workOrderData[0]?.stage_id?.[0] === stage.id && styles.activeStageButtonText
                ]}>
                  {stage.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <Surface style={styles.section}>
          <View style={styles.sectionHeader}>
            <Title>Attachments</Title>
            <View style={styles.headerButtons}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: '#3e85f7', marginRight: 10, padding: 10, borderRadius: 5 }]}
                onPress={() => navigation.navigate('ViewAttachments', {
                  workOrderId: route.params?.workOrderId
                })}
              >
                <Text style={styles.actionButtonText}>View All</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: '#3e85f7', padding: 10, borderRadius: 5 }]}
                onPress={handleImagePicker}
              >
                <Text style={styles.actionButtonText}>Add Image</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.infoContainer}>
            <View style={[styles.infoItem, { flexDirection: "row" }]}>
              <Text style={styles.infoLabel}>Total Images:</Text>
              <Text style={styles.infoValue}>{attachments.length}</Text>
            </View>
          </View>
          {attachments.length > 0 && (
            <View style={styles.carouselContainer}>
              <FlatList
                data={attachments}
                renderItem={renderImageItem}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                snapToInterval={windowWidth - 32}
                decelerationRate="fast"
                onMomentumScrollEnd={(event) => {
                  const slideIndex = Math.round(
                    event.nativeEvent.contentOffset.x / (windowWidth - 32)
                  );
                  setActiveImageIndex(slideIndex);
                }}
              />
              {attachments.length > 1 && (
                <View style={styles.paginationContainer}>
                  {attachments.map((_, index) => (
                    <View
                      key={index}
                      style={[
                        styles.paginationDot,
                        index === activeImageIndex && styles.paginationDotActive
                      ]}
                    />
                  ))}
                </View>
              )}
              <Text style={styles.imageNameText}>
                {attachments[activeImageIndex]?.name || ''}
              </Text>
            </View>
          )}
          <View style={{ marginVertical: 10, marginHorizontal: 10 }}>
            <Text style={{ fontSize: 16, color: "#000", fontWeight: "bold" }}>Description</Text>
            <View style={{ padding: 10 }}>
              <Text style={styles.detailValue}>
                {workOrderData[0]?.description ? workOrderData[0].description.replace(/<p>/g, '').replace(/<\/p>/g, '') : 'N/A'}
              </Text>
            </View>
          </View>
        </Surface>
        {workOrderData.map((order) => (
          <Surface style={styles.section}>

            <View style={styles.pickerButton}>
              <View>
                <Text style={[styles.pickerText, { color: "#000", fontWeight: "bold" }]}>
                  Due Date
                </Text>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                <Text style={{ color: Colour, fontWeight: "bold" }}> {workOrderData[0]?.due_date || 'N/A'}</Text>
                <Icon
                  type='ionicon'
                  name='chevron-right'
                  size={18}
                  style={styles.pickerIcon}
                />
              </View>

            </View>
            <View style={styles.pickerButton}>
              <View>
                <Text style={[styles.pickerText, { color: "#000", fontWeight: "bold" }]}>
                  Start Date
                </Text>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                <Text style={{ color: Colour, fontWeight: "bold" }}> {workOrderData[0]?.start_date || 'N/A'}</Text>
                <Icon
                  type='ionicon'
                  name='chevron-right'
                  size={18}
                  style={styles.pickerIcon}
                />
              </View>

            </View>

            <TouchableOpacity style={styles.pickerButton} onPress={handleEmployeePress}>
              <View>
                <Text style={[styles.pickerText, { color: "#000", fontWeight: "bold" }]}>
                  Assigned To
                </Text>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                <Text style={{ color: Colour, fontWeight: "bold" }}>
                  {workOrderData[0]?.employee_ids?.length ? `${workOrderData[0]?.employee_ids?.length} Assigned` : 'N/A'}
                </Text>
                <Icon
                  type='ionicon'
                  name='chevron-right'
                  size={18}
                  style={styles.pickerIcon}
                />
              </View>
            </TouchableOpacity>
            <View style={styles.pickerButton}>
              <View>
                <Text style={[styles.pickerText, { color: "#000", fontWeight: "bold" }]}>
                Location
                </Text>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                <Text style={{ color: Colour, fontWeight: "bold" }}> {workOrderData[0]?.contact_location_id?.[1] || 'N/A'}</Text>
                <Icon
                  type='ionicon'
                  name='chevron-right'
                  size={18}
                  style={styles.pickerIcon}
                />
              </View>

            </View>
            <View style={styles.pickerButton}>
              <View>
                <Text style={[styles.pickerText, { color: "#000", fontWeight: "bold" }]}>
                  Priority
                </Text>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                {/* <Text style={{ color: Colour, fontWeight: "bold" }}> {order.stage_id[1]}</Text> */}
                <Chip style={[styles.priorityBadge, { backgroundColor: getPriorityColor(order.priority) }]}>
                  {order.priority === '0' ? 'Normal' : order.priority === '1' ? 'Low' : order.priority === '2' ? 'Medium' : order.priority === '3' ? 'High' : 'Normal'}
                </Chip>
              </View>

            </View>
            {/* <TouchableOpacity style={styles.pickerButton} onPress={handleImagePicker}>
              <View>
                <Text style={[styles.pickerText, { color: "#000", fontWeight: "bold" }]}>
                  Add Image
                </Text>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                <Text style={{ color: Colour, fontWeight: "bold" }}> {attachments.filter(attachment => attachment.type && attachment.type.startsWith('image')).length > 0 ? `${attachments.filter(attachment => attachment.type && attachment.type.startsWith('image')).length} image attachments` : 'No image attachments'}</Text>
                <Icon
                  type='ionicon'
                  name='chevron-right'
                  size={18}
                  style={styles.pickerIcon}
                />
              </View>

            </TouchableOpacity> */}
            <TouchableOpacity style={styles.pickerButton} onPress={handleMoreInfo}>
              <View>
                <Text style={[styles.pickerText, { color: "#000", fontWeight: "bold" }]}>
                  More info
                </Text>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                <Text style={{ color: Colour, fontWeight: "bold" }}> { }</Text>
                <Icon
                  type='ionicon'
                  name='chevron-right'
                  size={18}
                  style={styles.pickerIcon}
                />
              </View>

            </TouchableOpacity>
            <TouchableOpacity style={styles.pickerButton} onPress={handleDocumentPicker}>
              <View>
                <Text style={[styles.pickerText, { color: "#000", fontWeight: "bold" }]}>
                  Add Files
                </Text>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                <Text style={{ color: Colour, fontWeight: "bold" }}> {attachments.filter(attachment => attachment.type && !attachment.type.startsWith('image')).length > 0 ? `${attachments.filter(attachment => attachment.type && !attachment.type.startsWith('image')).length} attachments` : 'No attachments'}</Text>
                <Icon
                  type='ionicon'
                  name='chevron-right'
                  size={18}
                  style={styles.pickerIcon}
                />
              </View>
            </TouchableOpacity>


          </Surface>


        ))}

        <Surface style={styles.section}>
          <Title>Time and Costs</Title>

          <TouchableOpacity style={styles.pickerButton} onPress={() =>  navigation.navigate('AddQuantity',{  workOrderId: route.params?.workOrderId})}>
            <View>
              <Text style={[styles.pickerText, { color: "#000", fontWeight: "bold" }]}>
                Add Parts
              </Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-around", alignItems: "center" }}>
              <Text style={[styles.countText, { color: Colour, marginRight: 8 }]}>
                {MainTainancePartsData.length > 0 ? MainTainancePartsData.length +" " +"parts": ''}
              </Text>
              <Icon
                type='ionicon'
                name='chevron-right'
                size={18}
                style={styles.pickerIcon}
              />
            </View>

          </TouchableOpacity>
          <TouchableOpacity
            style={styles.pickerButton}
            onPress={() => setShowTimeEntryModal(true)}
          >
            <View>
              <Text style={[styles.pickerText, { color: "#000", fontWeight: "bold" }]}>
                Timesheet
              </Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-around", alignItems: "center" }}>
              <Text style={[styles.countText, { color: Colour, marginRight: 8 }]}>
                {TimeSheetData.length > 0 ? TimeSheetData.length : ''}
              </Text>
              <Icon
                type='ionicon'
                name='chevron-right'
                size={18}
                style={styles.pickerIcon}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.pickerButton}
            onPress={() => navigation.navigate('AddExpense',{  workOrderId: route.params?.workOrderId})}
          >
            <View>
              <Text style={[styles.pickerText, { color: "#000", fontWeight: "bold" }]}>
                Cost
              </Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-around", alignItems: "center" }}>
              <Text style={[styles.countText, { color: Colour, marginRight: 8 }]}>
                {Expenses.length > 0 ? Expenses.length : ''}
              </Text>
              <Icon
                type='ionicon'
                name='chevron-right'
                size={18}
                style={styles.pickerIcon}
              />
            </View>
          </TouchableOpacity>
          <Divider />
          {/* <List.Item
            title="Total Cost"
            description={`$${calculateTotalCost().toFixed(2)}`}
          /> */}
        </Surface>


        {/* <Surface style={styles.section}>
      <Title style={{fontWeight:"bold",color:"#000"}}>Parts</Title>
      {MainTainancePartsData.map((part, index) => (
        <List.Item
          key={index}
          title={part.product_id[1]}
          description={`Estimated: ${part.qty_estimated}, Used: ${part.qty_used}`}
          left={(props) => <List.Icon {...props} icon="cog" />}
        />
      ))}
    </Surface> */}
        {/* <Surface style={styles.section}>
          <Title style={{ fontWeight: "bold", color: "#000" }}>Summary</Title>



          <View style={styles.summaryCard}>
            <View style={styles.summaryContent}>
              <Title style={styles.summaryTitle}>Timesheet</Title>
              <Text style={styles.summaryText}>
                Total Hours: {calculateTotalWorkHours().toFixed(2)}
              </Text>
              {TimeSheetData.length > 0 && (
                <>
                  <Text style={styles.lastAddedText}>
                    Last Entry: {TimeSheetData[0].employee_id[1]}
                  </Text>
                  <Text style={styles.lastAddedText}>
                    Duration: {TimeSheetData[0].unit_amount.toFixed(2)} hrs
                  </Text>
                  <Text style={styles.lastAddedText}>
                    Date: {new Date(TimeSheetData[0].date).toLocaleDateString()}
                  </Text>
                </>
              )}
            </View>
            <TouchableOpacity
              style={styles.showDetailsButton}
              onPress={() => navigation.navigate('WorkOrderDetailsView', {
                type: 'timesheet',
                data: TimeSheetData,
                total: calculateTotalWorkHours()
              })}
            >
              <Text style={styles.showDetailsText}>View All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.summaryCard}>
            <View style={styles.summaryContent}>
              <Title style={styles.summaryTitle}>Parts</Title>
              <Text style={styles.summaryText}>
                Total Parts: {MainTainancePartsData.length}
              </Text>
              {MainTainancePartsData.length > 0 && (
                <Text style={styles.lastAddedText}>
                  Last Added: {MainTainancePartsData[MainTainancePartsData.length - 1].qty_estimated} × {MainTainancePartsData[MainTainancePartsData.length - 1].product_id[1]}
                </Text>
              )}
            </View>
            <TouchableOpacity
              style={styles.showDetailsButton}
              onPress={() => navigation.navigate('WorkOrderDetailsView', {
                type: 'parts',
                data: MainTainancePartsData,
                total: calculateTotalQuantity()
              })}
            >
              <Text style={styles.showDetailsText}>View All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.summaryCard}>
            <View style={styles.summaryContent}>
              <Title style={styles.summaryTitle}>Expenses</Title>
              <Text style={styles.summaryText}>
                Total Cost: ${calculateTotalCost().toFixed(2)}
              </Text>
              {Expenses.length > 0 && (
                <Text style={styles.lastAddedText}>
                  Last Added: ${Expenses[0].total_amount_currency} - {Expenses[0].name}
                </Text>
              )}
            </View>
            <TouchableOpacity
              style={styles.showDetailsButton}
              onPress={() => navigation.navigate('WorkOrderDetailsView', {
                type: 'expenses',
                data: Expenses,
                total: calculateTotalCost()
              })}
            >
              <Text style={styles.showDetailsText}>View All</Text>
            </TouchableOpacity>
          </View>
        </Surface> */}
        {/* <Surface style={styles.section}>
      <Title>Expense</Title>
      {Expenses.map((expense, index) => (
        <List.Item
          key={index}
          title={expense.name}
          description={`${expense.product_id[1]}`}
          right={(props) => <Text {...props} style={{fontWeight:"bold"}}>{expense.total_amount_currency+' $'}</Text>}
        />
      ))}
      <Divider style={{ marginVertical: 8 }} />
      <List.Item
        title="Total Cost"
        titleStyle={{ fontWeight: 'bold', color: '#000' }}
        right={(props) => (
          <Text {...props} style={{ fontWeight: 'bold', color: '#007AFF', fontSize: 16 }}>
            {calculateTotalCost().toFixed(2)} $
          </Text>
        )}
      />
    </Surface> */}
        {/* <Surface style={styles.section}>
      <Title style={{fontWeight:"bold",color:"#000"}}>Expense</Title>
      {Expenses.map((expense, index) => (
        <View key={index} style={styles.expenseItem}>
          <View style={styles.expenseDetails}>
            <Text style={styles.expenseDescription}>{expense.name}</Text>
            <Text style={styles.expenseSubtext}>
              {expense.employee_id[1]} - {expense.product_id[1]}
            </Text>
          </View>
          <Text style={styles.expenseAmount}>
            ${expense.total_amount_currency.toFixed(2)}
          </Text>
        </View>
      ))}
    </Surface> */}
        {/* <Surface style={styles.section}>
      <Title style={{fontWeight:"bold",color:"#000"}}>Timesheet</Title>
      {TimeSheetData.map((entry, index) => (
        <List.Item
          key={index}
          title={`Employee ID: ${entry.employee_id[1]}`}
          description={`${entry.unit_amount} hours`}
          left={(props) => <List.Icon {...props} icon="clock" />}
        />
      ))}
    </Surface> */}

        {/* Time Dialog */}
        <Portal>
          <Dialog visible={showTimeDialog} onDismiss={() => setShowTimeDialog(false)}>
            <Dialog.Title>Update Labor Time</Dialog.Title>
            <Dialog.Content>
              <TextInput
                label="Hours"
                value={laborHours}
                onChangeText={setLaborHours}
                keyboardType="numeric"
                mode="outlined"
                style={{ marginBottom: 10 }}
              />
              <TextInput
                label="Minutes"
                value={laborMinutes}
                onChangeText={setLaborMinutes}
                keyboardType="numeric"
                mode="outlined"
                style={{ marginBottom: 10 }}
              />
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setShowTimeDialog(false)}>Cancel</Button>
              <Button onPress={handleTimeUpdate}>Update</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
        <Portal>
          <Dialog visible={showTimeEntryModal} onDismiss={() => setShowTimeEntryModal(false)}>
            <Dialog.Title>Add Time Entry</Dialog.Title>
            <Dialog.Content>
              <TextInput
                label="Description"
                value={timeDescription}
                onChangeText={setTimeDescription}
                mode="outlined"
                style={{ marginBottom: 10 }}
              />
              <View style={styles.timeInputRow}>
                <TextInput
                  label="Hours"
                  value={timeHours}
                  onChangeText={(text) => {
                    const value = text.replace(/[^0-9]/g, '');
                    setTimeHours(value);
                  }}
                  keyboardType="numeric"
                  mode="outlined"
                  style={styles.timeInput}
                />
                <TextInput
                  label="Minutes"
                  value={timeMinutes}
                  onChangeText={(text) => {
                    const value = text.replace(/[^0-9]/g, '');
                    if (parseInt(value) <= 59) {
                      setTimeMinutes(value);
                    }
                  }}
                  keyboardType="numeric"
                  mode="outlined"
                  style={styles.timeInput}
                />
              </View>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setShowTimeEntryModal(false)}>Cancel</Button>
              <Button onPress={handleTimeEntrySubmit}>Submit</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>

        {/* Cost Dialog */}
        <Portal>
          <Dialog visible={showCostDialog} onDismiss={() => setShowCostDialog(false)}>
            <Dialog.Title>Update Material Cost</Dialog.Title>
            <Dialog.Content>
              <TextInput
                label="Cost ($)"
                value={materialCost}
                onChangeText={setMaterialCost}
                keyboardType="decimal-pad"
                mode="outlined"
              />
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setShowCostDialog(false)}>Cancel</Button>
              <Button onPress={handleCostUpdate}>Update</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
        <BottomSheet
          isVisible={visible2}
          onBackdropPress={() => setVisible2(false)}
        >
          <View style={[styles.bottomSheetView, { maxHeight: '80%' }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Parts</Text>
              <TouchableOpacity onPress={() => setVisible2(false)}>
                <Icon name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            <ScrollView style={{ width: '100%', maxHeight: '70%', paddingBottom: 15 }}>
              {(searchQuery ? filteredModalData : modalData).map((item, i) => (
                <TouchableOpacity
                  key={i}
                  style={[
                    styles.modalItem,
                    multiSelectedParts.some(part => part.id === item.id) && styles.selectedItem
                  ]}
                  onPress={() => onSelectItem(item)}
                >
                  <Text style={styles.modalText}>{item.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={() => setVisible2(false)}
              >
                <Text style={styles.textStyle}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.buttonSave]}
                onPress={handleSaveAndNavigate}
              >
                <Text style={styles.textStyle}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </BottomSheet>

        <BottomSheet
          isVisible={showMoreInfoModal}
          onBackdropPress={() => setShowMoreInfoModal(false)}

        >
          <View style={[styles.bottomSheetView]}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderContent}>
                <Text style={styles.modalTitle}>Work Order Details</Text>
                <Text style={styles.workOrderName}>{workOrderData[0]?.name || 'N/A'}</Text>
              </View>
              <TouchableOpacity onPress={() => setShowMoreInfoModal(false)}>
                <Icon name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            <ScrollView style={{ padding: 15, maxHeight: '70%' }}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Priority:</Text>
                <Text style={styles.detailValue}>
                  {workOrderData[0]?.priority === '0' ? 'Normal' :
                    workOrderData[0]?.priority === '1' ? 'Low' :
                      workOrderData[0]?.priority === '2' ? 'Medium' :
                        workOrderData[0]?.priority === '3' ? 'High' : 'N/A'}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Stage:</Text>
                <Text style={styles.detailValue}>{workOrderData[0]?.stage_id?.[1] || 'N/A'}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Due Date:</Text>
                <Text style={styles.detailValue}>{workOrderData[0]?.due_date || 'N/A'}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Start Date:</Text>
                <Text style={styles.detailValue}>{workOrderData[0]?.start_date || 'N/A'}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Request Date:</Text>
                <Text style={styles.detailValue}>{workOrderData[0]?.request_date || 'N/A'}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Location:</Text>
                <Text style={styles.detailValue}>{workOrderData[0]?.contact_location_id?.[1] || 'N/A'}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Description:</Text>
                <Text style={styles.detailValue}>{workOrderData[0]?.description ? workOrderData[0].description.replace(/<p>/g, '').replace(/<\/p>/g, '') : 'N/A'}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Estimated Time:</Text>
                <Text style={styles.detailValue}>{workOrderData[0]?.estimated_time + " hr" || 'N/A'}</Text>
              </View>


              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Maintenance Team:</Text>
                <Text style={styles.detailValue}>{workOrderData[0]?.maintenance_team_id?.[1] || 'N/A'}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Maintenance Type:</Text>
                <Text style={styles.detailValue}>{workOrderData[0]?.maintenance_type_id?.[1] || 'N/A'}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Maintenance Category:</Text>
                <Text style={styles.detailValue}>{workOrderData[0]?.maintenance_category_id?.[1] || 'N/A'}</Text>
              </View>
            </ScrollView>
          </View>
        </BottomSheet>
      </ScrollView>
      {loading && (
        <View style={styles.loaderOverlay}>
          <ActivityIndicator size="large" color={Colour} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  card: {
    margin: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    color: '#fff',
    fontSize: 14,
  },
  section: {
    margin: 8,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  attachmentImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginTop: 8,
  },
  container: {
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  pickerIcon: {
    color: '#007AFF',
  },
  statusSection: {
    marginVertical: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    elevation: 2,
  },
  stageButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 4,
    width: '100%',
  },
  
  stageButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    marginHorizontal: 2,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    minWidth: 80,
  },
  activeStageButton: {
    backgroundColor: '#3e85f7',
    borderColor: '#3e85f7',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  stageButtonText: {
    fontSize: 14,
    color: '#212529',
    textAlign: 'center',
    fontWeight: '500',
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  activeStageButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  searchContainer: {
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  searchInput: {
    height: 40,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 5,
  },
  pickerButton: {
    height: 50,
    // backgroundColor: '#F8F9FA',
    borderBottomWidth: 1,
    borderColor: '#E2E4E8',
    // borderRadius: 10,
    // paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  pickerIcon: {
    color: "3#e85f7",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 30,
    height: '80%',
    marginTop: 'auto',
  },
  modalItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  selectedModalItem: {
    backgroundColor: '#f0f9ff',
  },
  modalItemText: {
    fontSize: 16,
    flex: 1,
    fontWeight: "bold"
  },
  tickIcon: {
    color: '#2196F3',
    marginLeft: 10,
  },
  modalDismissArea: {
    flex: 1,
  },
  pickerText: {
    fontSize: 16,
    color: '#333',
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  section: {
    marginVertical: 10,
    padding: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  imageButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 10,
  },
  imageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    width: '45%',
    justifyContent: 'center',
  },
  buttonText: {
    marginLeft: 8,
    color: "#3e85f7",
    fontSize: 14,
  },
  imagePreviewContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  imagePreview: {
    marginRight: 10,
    position: 'relative',
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  addImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    justifyContent: 'center',
    marginBottom: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalOptionText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#333',
  },
  cancelOption: {
    borderBottomWidth: 0,
    marginTop: 10,
    justifyContent: 'center',
  },
  cancelText: {
    color: 'red',
    marginLeft: 0,
    fontWeight: '500',
  },

  timeInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  timeInputGroup: {
    alignItems: 'center',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  button: {
    borderRadius: 8,
    padding: 10,
    width: '45%',
  },
  buttonClose: {
    backgroundColor: '#6B7280',
  },
  buttonSave: {
    backgroundColor: '#10B981',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  selectedItem: {
    backgroundColor: '#E5E7EB',
  },
  partItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  partName: {
    fontSize: 16,
    color: '#000',
    flex: 1,
  },
  partQuantity: {
    fontSize: 14,
    color: '#6B7280',
  },
  noParts: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  timeInputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  timeInput: {
    flex: 1,
  },
  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  expenseDetails: {
    flex: 1,
    marginRight: 16
  },
  expenseDescription: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333'
  },
  expenseSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 4
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF'
  },
  noDataText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    marginVertical: 16
  },
  summaryCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
    elevation: 2,
  },
  summaryContent: {
    flex: 1,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  summaryText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  lastAddedText: {
    fontSize: 12,
    color: '#007AFF',
    marginTop: 4,
    fontStyle: 'italic',
  },
  showDetailsButton: {
    backgroundColor: '#007AFF',
    padding: 8,
    borderRadius: 6,
    marginLeft: 16,
  },
  showDetailsText: {
    color: '#fff',
    fontWeight: '600',
  },
  stageIconContainer: {
    marginRight: 6,
  },
  attachmentList: {
    marginTop: 10,
  },
  attachmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  attachmentInfo: {
    flex: 1,
    marginRight: 10,
  },
  attachmentName: {
    fontSize: 16,
    marginBottom: 5,
  },
  attachmentThumbnail: {
    width: 100,
    height: 100,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 10,
  },
  lastAddedImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginTop: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loaderOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalHeaderContent: {
    flex: 1,
    marginRight: 10,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  workOrderName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  detailRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  detailLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#666',
  },
  detailValue: {
    flex: 1,
    fontSize: 15,
    color: '#000',
  },
  descriptionText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    marginBottom: 8,
    lineHeight: 20,
  },
  estimatedTimeText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  bottomSheetView: {
    backgroundColor: 'white',
    padding: 16,
    maxHeight: '80%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    
    // paddingBottom: 0, // Remove bottom padding since modalButtonContainer will handle it
  },
  countText: {
    fontSize: 14,
    fontWeight: 'bold',
    opacity: 0.8
  },
  carouselContainer: {
    marginTop: 10,
    height: 250,
  },
  carouselItem: {
    width: Dimensions.get('window').width - 32,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#3e85f7',
  },
  imageNameText: {
    textAlign: 'center',
    marginTop: 5,
    color: '#666',
    fontSize: 12,
  },
});
export default React.memo(WorkOrderDetails);