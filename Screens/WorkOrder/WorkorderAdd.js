import { useNavigation, useRoute } from '@react-navigation/native';
import { RootState } from '../../redux/store';
import { updateWorkOrder } from '../../redux/slices/workOrderSlice';
import { WorkOrder } from '../../redux/types/workorder';
import * as ImagePicker from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import { getData } from '../../Util/Storage';
import { BASE_URL } from '../../Util/Const';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import Toast from 'react-native-simple-toast';

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image, TextInput, Modal, Pressable, ActivityIndicator, Platform, FlatList } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { useSelector, useDispatch } from 'react-redux';
import set from 'date-fns';

import Parts from '../Parts/Parts';


const WorkOrderAdd = () => {
  const navigation = useNavigation();

  // Add useEffect for header button


  const [LocationData, setLocationData] = useState([]);
  const [CustomerData, SetCustomerData] = useState([]);
  const [CategoryData, setCategoryData] = useState([]);
  const [description, setDescription] = useState('');
  const [MaintainanceTypes, SetMaintainanceTypes] = useState([]);
  const [MaintainanceCategory, SetMaintainanceCategory] = useState([]);
  const [UserDetailsData, SetUserDetailsData] = useState([]);
  const [UserName, SetUserName] = useState('choose');
  const [estimateShow,SetestimateShow] = useState("1h 0m");
  const [Userid, SetUserid] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [taskName, setTaskName] = useState('');
  const [WorkType, SetWorktype] = useState('');
  const [AssignedTo, SetAssignedTo] = useState('');
  const [Location, SetLocation] = useState('choose');
  const [Category, SetCategory] = useState('choose');
  const [modalData, setModalData] = useState([]);
  const [visible2, setVisible2] = useState(false);
  const [types, setTypes] = useState('');
  const [WorkTypesId, setWorkTypesId] = useState('');
  const [CategoryId, setCategoryId] = useState('');
  const [AssignedToId, setAssignedToId] = useState('');
  const [LocationId, setLocationId] = useState('');
  const [LocationName, setLocationName] = useState('');
  const [PartsTypesId, setPartsTypesId] = useState('');
  const [PartsTypes, setPartsTypes] = useState('choose');
  const [CustomerId, setCustomerId] = useState('');
  const [CustomerName, setCustomerName] = useState('choose');
  const [ProductData, SetProductData] = useState([]);
  const [ProductId, setProductId] = useState('');
  const [ProductName, setProductName] = useState('choose');
  
  const [selectedProdcut, setSelectedProduct] = useState([]);
  const [QuantityValue, SetQuantityValue] = useState("");
  const [Visible, SetVisible] = useState(false);
  const [images, setImages] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [workOrderId, setWorkOrderId] = useState('');
  const [selectedParts, setSelectedParts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredModalData, setFilteredModalData] = useState([]);
  const [multiSelectedParts, setMultiSelectedParts] = useState([]);
  const [multiSelectedUsers, setMultiSelectedUsers] = useState([]);
  // const [EstimatedTime, SetEstimatedTime] = useState('1h 0m');
  const [EstimatedTime, SetEstimatedTime] = useState(1.0);
  const [showEstimatedTimeDialog, setShowEstimatedTimeDialog] = useState(false);
  const [hours, setHours] = useState('0');
  const [minutes, setMinutes] = useState('0');
  const [dueDate, setDueDate] = useState(new Date());
  const [startDate, setStartDate] = useState(new Date());
  const [showStartDate, setShowStartDate] = useState(false);
  const [showDueDate, setShowDueDate] = useState(false);
  const [showScheduleDateTime, setShowScheduleDateTime] = useState(false);
  const [scheduleDateTime, setScheduleDateTime] = useState(new Date());
  const [scheduleMode, setScheduleMode] = useState('date'); // 'date' or 'time'
  const [validationErrors, setValidationErrors] = useState({});
  const [selectedStatus, setSelectedStatus] = useState(0);
  const Colour = "#3e85f7";

  
  const showSchedulePicker = () => {
    setShowScheduleDateTime(true);
    setScheduleMode('date');
  };

  const onScheduleDateTimeChange = (event, selectedDate) => {
    if (event.type === 'dismissed') {
      setShowScheduleDateTime(false);
      return;
    }

    const currentDate = selectedDate || scheduleDateTime;
    setShowScheduleDateTime(Platform.OS === 'ios');

    if (scheduleMode === 'date') {
      setScheduleMode('time');
      setShowScheduleDateTime(true);
    } else {
      setShowScheduleDateTime(false);
      setScheduleDateTime(currentDate);
      global.tempScheduleDateTime = currentDate;
    }
  };
  

  useEffect(() => {
    CustomerDetails();
    MainTainancePartsCategory();
    UserDetails();
    MaintainancePartsTypes();
    ProductsList()
    const getCompanyId = async () => {
      const company = await getData('COMPANY_ID');
      const uid = await getData("USER_ID")

      if (company === undefined || uid === undefined) {
        console.log("COMPANY_ID or USER_ID is undefined");
      } else {
        console.log("company", company)
        console.log("uid", uid)
      }
    }
    getCompanyId()

  }, []);

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

  const CustomerDetails = async () => {
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
            "model": "res.partner",
            "method": "search_read",
            "args": [],

            "kwargs": {
              "fields": ["name"],
              "domain": [["is_customer", "=", true]]
            }
          },
        }),
      });
      const empData = await empResponse.json();
      console.log("empData.result customer", empData.result);

      if (empData.result) {

        let temp = [];
        empData?.result?.map(item => {
          temp.push({
            field: "Customer",
            ...item,
          });
        });
        console.log("Customer temp", temp)
        SetCustomerData(temp);
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

  const MaintainancePartsTypes = async () => {
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
            "model": "leap.maintenance.type",
            "method": "search_read",
            "args": [],
            "kwargs": {
              "fields": ["name"],
              "domain": []
            }
          },
        },
        ),
      });
      const empData = await empResponse.json();
      console.log("empData.result Partstypes", empData.result);

      if (empData.result) {
        let temp = [];
        empData?.result?.map(item => {
          temp.push({
            field: "PartsTypes",
            ...item,
          });
        });
        SetMaintainanceTypes(temp);
        console.log("Partstypes temp", temp)
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
  const UserDetails = async () => {
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
            "model": "hr.employee",
            "method": "search_read",
            "args": [],

            "kwargs": {
              "fields": ["name"],
              "domain": []
            }
          },
        }),
      });
      const empData = await empResponse.json();
      console.log("empData.result user", empData.result);

      if (empData.result) {
        let temp = [];
        empData?.result?.map(item => {
          temp.push({
            field: "User",
            ...item,
          });
        });
        SetUserDetailsData(temp);
        console.log("Customer temp", temp)
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
  const MainTainancePartsCategory = async () => {
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
          "params": {
            "model": "leap.maintenance.category",
            "method": "search_read",
            "args": [],
            "kwargs": {
              "fields": ["name"]

            }
          }
        }),
      });
      const empData = await empResponse.json();
      console.log("empData.result category", empData.result);

      if (empData.result) {
        let temp = [];
        empData?.result?.map(item => {
          temp.push({
            field: "Category",
            ...item,
          });
        });
        SetMaintainanceCategory(temp);
        console.log("Parts temp", temp)
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
  useEffect(() => {
    LocationDetails();
  }, [CustomerId]);

  const LocationDetails = async () => {
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
            "model": "res.partner",
            "method": "search_read",
            "args": [],

            "kwargs": {
              "fields": ["name"],
              "domain": [["parent_id", "=", CustomerId]]
            }
          },
        }),
      });
      const empData = await empResponse.json();
      console.log("empData.result Location", empData.result);

      if (empData.result) {
        let temp = [];
        empData?.result?.map(item => {
          temp.push({
            field: "Location",
            ...item,
          });
        });
        setLocationData(temp);
        console.log("Customer temp", temp)
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

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerRight: () => (
        <TouchableOpacity
          style={{ marginRight: 15 }}
          onPress={() => {
            CreateWorkOrder()
          }}
        >
          <Text style={{ color: '#007AFF', fontSize: 16 }}>Create</Text>
        </TouchableOpacity>
      ),
      title: 'Add Work Order'
    });
  }, []);

  useEffect(() => {
    console.log("CustomerId", CustomerId);
    console.log("PartsTypesId", PartsTypesId);
    console.log("CategoryId", CategoryId);
    console.log("LocationId", LocationId);
    console.log("Userid", Userid);
    console.log("taskName", taskName);
    console.log("startDate", startDate);
    console.log("dueDate", dueDate);
    console.log("scheduleDateTime", scheduleDateTime);
    console.log("selectedStatus", selectedStatus);
  }, [
    CustomerId,
    PartsTypesId,
    CategoryId,
    LocationId,
    Userid,
    taskName,
    startDate,
    dueDate,
    scheduleDateTime,
    selectedStatus,
  ]);

  console.log("Customerid9999999999", CustomerId, "PartsTypesId", PartsTypesId, "CategoryId", CategoryId, "LocationId", LocationId, "Userid", Userid)


  const handleImagePickerDialog = () => {
    Alert.alert(
      'Select Image',
      'Choose an option',
      [
        {
          text: 'Take Photo',
          onPress: handleTakePhoto,
        },
        {
          text: 'Choose from Gallery',
          onPress: handleChoosePhoto,
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  const handleTakePhoto = async () => {
    try {
      const options = {
        mediaType: 'photo',
        quality: 0.8,
        saveToPhotos: false,
        includeBase64: true,
      };

      const result = await ImagePicker.launchCamera(options);
      if (result.assets && result.assets[0]) {
        const imageData = {
          uri: result.assets[0].uri,
          type: result.assets[0].type || 'image/jpeg',
          name: result.assets[0].fileName || `photo_${Date.now()}.jpg`,
          base64: result.assets[0].base64
        };
        setImages(prevImages => [...prevImages, imageData]);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to capture photo');
    }
  };

  const handleChoosePhoto = async () => {
    try {
      const options = {
        mediaType: 'photo',
        quality: 0.8,
        selectionLimit: 0,
        includeBase64: true,
      };

      const result = await ImagePicker.launchImageLibrary(options);
      if (result.assets) {
        const imageDataArray = result.assets.map(asset => ({
          uri: asset.uri,
          type: asset.type || 'image/jpeg',
          name: asset.fileName || `photo_${Date.now()}.jpg`,
          base64: asset.base64
        }));
        setImages(prevImages => [...prevImages, ...imageDataArray]);
      }
    } catch (error) {
      console.error('Error choosing photos:', error);
      Alert.alert('Error', 'Failed to select photos');
    }
  };

  const removeImage = (index) => {
    setImages(prevImages => prevImages.filter((_, i) => i !== index));
  };

  const uploadWorkOrderImages = async () => {
    try {
      if (images.length === 0) return true;
      console.log('Starting image upload, Images count:', images.length);

      const Token = await getData("ACCESS_TOKEN");
      const finalCustomerId = global.tempCustomerId || CustomerId;
      // Create image attachments array - using the format that works in Postman
      const imageAttachments = images.map(image => [0, 0, {
        name: image.name || 'image.jpg',
        mimetype: image.type || 'image/jpeg',
        company_id: 1,
        datas: image.base64
      }]); // Take the first image for now

      const requestBody = {
        jsonrpc: '2.0',
        params: {
          model: 'maintenance.request',
          method: 'create',
          args: [{
            name: taskName || 'Image Upload',
            partner_id: parseInt(finalCustomerId),
            company_id: 1,
            maintenance_team_id: 1,
            maintenance_picture_ids: imageAttachments
          }],
          kwargs: {}
        }
      };

      console.log('Sending image upload request');

      const response = await fetch(`${BASE_URL}/web/dataset/call_kw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': `X-OpenERP=${Token}`,
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      console.log('Image upload response:', data);
      
      if (!data.result) {
        console.error('Error uploading images:', data);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error uploading images:', error);
      return false;
    }
  };

  

  const resetForm = () => {
    setTaskName('');
    setDescription('');
    setImages([]);
    SetEstimatedTime('1h 0m');
    SetUserName('choose');
    SetUserid([]);
    setCustomerName('choose');
    setCustomerId('');
    SetLocation('choose');
    setLocationId('');
    SetPartsTypes('choose');
    setPartsTypesId('');
    SetCategory('choose');
    setCategoryId('');
    setScheduleDateTime(new Date());
    setValidationErrors({});
    setError('');
    
    // Reset global temp values
    global.tempCustomerId = null;
    global.tempLocationId = null;
    global.tempPartsTypesId = null;
    global.tempCategoryId = null;
    global.tempTaskName = null;
    global.tempDescription = null;
    global.tempEstimatedTime = null;
    global.tempStartDate = null;
    global.tempDueDate = null;
    global.tempScheduleDateTime = null;
    global.tempSelectedStatus = null;
    global.tempUserIds = null;
  };

  const handlePartSelection = (part) => {
    console.log("part", part)
    if (!part) {
      console.warn('No part selected');
      return;
    }
    navigation.navigate('AddQuantity', {
      workOrderId,
      selectedPart: part
    });
  };

  console.log("MaintainanceCategory", MaintainanceCategory, "CustomerData", CustomerData, "UserDetailsData", UserDetailsData, "MaintainanceTypes", MaintainanceTypes)

  const onSelectPicker = (type) => {
    console.log("types", type)
    if (type === 'PartsTypes') {
      setModalData(MaintainanceTypes)
      setTypes(type)
      console.log("heloo1", modalData)

    }

    else if (type === 'AssignedTo') {
      setModalData(UserDetailsData)
      setTypes(type)

    }
    else if (type === 'Category') {
      setModalData(MaintainanceCategory)

      setTypes(type)

      console.log("heloo2", modalData)
    }
    else if (type === 'Location') {
      setModalData(LocationData)
      setTypes(type)

    }
    else if (type === 'Customer') {
      setModalData(CustomerData)
      setTypes(type)

    }
    else if (type === 'PartsTypes') {
      setModalData(MaintainanceTypes)
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

  const onSelectItem = (item) => {
    console.log("types1111", item)
    if (item.field === 'Location') {
      console.log("item33", item)
      SetLocation(item.name)
      setLocationId(item.id)
      global.tempLocationId = item.id;
    }
    else if (item.field === 'Category') {
      console.log("item44", item)
      SetCategory(item.name)
      setCategoryId(item.id)
      global.tempCategoryId = item.id;
    }
    else if (item.field === 'Customer') {
      console.log("item55", item)
      setCustomerName(item.name)
      setCustomerId(item.id)
      global.tempCustomerId = item.id;
    }
    else if (item.field === 'PartsTypes') {
      console.log("item55", item)
      setPartsTypes(item.name)
      setPartsTypesId(item.id)
      global.tempPartsTypesId = item.id;
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
      console.log("item44", item)
      console.log("types1111", item)
      const isSelected = multiSelectedUsers.some(user => user.id === item.id);
      if (isSelected) {
        const updatedUsers = multiSelectedUsers.filter(user => user.id !== item.id);
        setMultiSelectedUsers(updatedUsers);
        SetUserName(formatMultipleSelections(updatedUsers));
        const userIds = updatedUsers.map(u => parseInt(u.id));
        SetUserid(userIds);
        global.tempUserIds = userIds;
      } else {
        const updatedUsers = [...multiSelectedUsers, item];
        setMultiSelectedUsers(updatedUsers);
        SetUserName(formatMultipleSelections(updatedUsers));
        const userIds = updatedUsers.map(u => parseInt(u.id));
        console.log("userIds", userIds)
        SetUserid(userIds);
        global.tempUserIds = userIds;
      }
      return;
    
    }
    else if (item.field === 'Location') {
      console.log("item55", item)
      setLocationName(item.name)
      setLocationId(item.id)
      global.tempLocationId = item.id;
    }
    else {
      //setActiveYear(item.id)
      //setYear(item)
      //setClassTypeName(item.class_name + '-' + item.class_division)
      //setSelectedClass(item.id)
    }

    if (item.field !== 'Parts' && item.field !== 'User') {
      setVisible2(false);
    }
  }
console.log("images upload", images)

  const handleSearch = (text) => {
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

  const handleHoursChange = (text) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    setHours(numericValue);
  };

  const handleMinutesChange = (text) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    if (parseInt(numericValue) <= 59) {
      setMinutes(numericValue);
    }
  };




  const handleSaveEstimatedTime = () => {
    const hoursFloat = parseFloat(hours) || 0;
    const minutesFloat = parseFloat(minutes) || 0;
    const totalHours = hoursFloat + (minutesFloat / 60);
    SetEstimatedTime(`${hoursFloat}hr ${minutesFloat}min`);
    global.tempEstimatedTime = totalHours;
    setShowEstimatedTimeDialog(false);
  };

  const onStartDateChange = (event, selectedDate) => {
    setShowStartDate(false);
    if (selectedDate) {
      setStartDate(selectedDate);
      global.tempStartDate = selectedDate;
    }
  };

  const onDueDateChange = (event, selectedDate) => {
    setShowDueDate(false);
    if (selectedDate) {
      setDueDate(selectedDate);
      global.tempDueDate = selectedDate;
    }
  };

  // const onScheduleDateTimeChange = (event, selectedDate) => {
  //   setShowScheduleDateTime(false);
  //   if (selectedDate) {
  //     setScheduleDateTime(selectedDate);
  //     global.tempScheduleDateTime = selectedDate;
  //   }
  // };

  useEffect(() => {
    let isMounted = true;

    const uploadImages = async () => {
      try {
        console.log("images length out", images.length);
        if (images.length > 0) {
          console.log("images length in", images.length);
          const imagesUploaded = await uploadWorkOrderImages();
          if (isMounted && !imagesUploaded) {
            Alert.alert('Warning', 'Work order created but failed to upload some images');
          }
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error uploading images:', error);
        }
      }
    };

    if (workOrderId) {
      uploadImages();
    }

    return () => {
      isMounted = false;
    };
  }, [workOrderId, images]);

  const handleTaskNameChange = (text) => {
    setTaskName(text);
    global.tempTaskName = text;
  };

  const handleDescriptionChange = (text) => {
    setDescription(text);
    global.tempDescription = text;
  };

  const handleStatusChange = (value) => {
    setSelectedStatus(value);
    global.tempSelectedStatus = value;
  };


  const CreateWorkOrder = async () => {
    setLoading(true);
    try {
      const Token = await getData("ACCESS_TOKEN");
      console.log("Images22222", images)

      // if (images.length > 0) {
      //   const imagesUploaded = await uploadWorkOrderImages(empData.result);
      //   if (!imagesUploaded) {
      //     Alert.alert('Warning', 'Work order created but failed to upload some images');
      //   }
      // }
      
      const finalCustomerId = global.tempCustomerId || CustomerId;
      const finalLocationId = global.tempLocationId || LocationId;
      const finalPartsTypesId = global.tempPartsTypesId || PartsTypesId;
      const finalCategoryId = global.tempCategoryId || CategoryId;
      const finalTaskName = global.tempTaskName || taskName;
      const finalDescription = global.tempDescription || description;
      const finalEstimatedTime = global.tempEstimatedTime || EstimatedTime;
      const finalStartDate = global.tempStartDate || startDate;
      const finalDueDate = global.tempDueDate || dueDate;
      const finalScheduleDateTime = global.tempScheduleDateTime || scheduleDateTime;
      const finalSelectedStatus = global.tempSelectedStatus || selectedStatus;
      const finalUserIds = global.tempUserIds || Userid || [];

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
            method: "create",
            args: [{
              name: finalTaskName,
              partner_id: parseInt(finalCustomerId),
              maintenance_team_id: 1,
              company_id: 1,
              description: finalDescription,
              estimated_time: finalEstimatedTime,
              start_date: finalStartDate ? format(new Date(finalStartDate), 'yyyy-MM-dd') : null,
              due_date: finalDueDate ? format(new Date(finalDueDate), 'yyyy-MM-dd') : null,
              schedule_date: finalScheduleDateTime ? format(new Date(finalScheduleDateTime), 'yyyy-MM-dd HH:mm:ss') : null,
              maintenance_type_id: parseInt(finalPartsTypesId),
              maintenance_category_id: parseInt(finalCategoryId),
              maintenance_type: "corrective",
              priority: finalSelectedStatus,
              user_id: 2,
              contact_location_id: parseInt(finalLocationId),
              employee_ids: [
                [
                  6,
                  0,
                  finalUserIds
                ]
              ]
            }],
            kwargs: {}
          }
        }),
      });

      const empData = await empResponse.json();

      if (empData.result) {
        console.log("empData.result", empData.result, images);
        setError("");
        // Upload images if there are any
        
        
        Toast.show('Work order created successfully');
        resetForm();
        navigation.goBack();
        setWorkOrderId(empData.result);
        return true;
      } else {
        setError('No data received from server');
        Toast.show('Failed to create work order');
      }
    } catch (err) {
      console.error('Error creating work order:', err);
      setError('Failed to create work order');
      Toast.show('Failed to create work order');
    } finally {
      setLoading(false);
    }
  };





  const renderPriorityButton = (value, label) => (
    <TouchableOpacity
      style={[
        styles.priorityButton,
        selectedStatus === value && {
          backgroundColor: getPriorityColor(value),
          borderColor: getPriorityColor(value),
          elevation: 3,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
        }
      ]}
      onPress={() => handleStatusChange(value)}
    >
      <Text style={[
        styles.priorityButtonText,
        selectedStatus === value && styles.selectedPriorityText
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  // const showSchedulePicker = () => {
  //   setScheduleMode('date');
  //   setShowScheduleDateTime(true);
  // };

  useEffect(() => {
    console.log("CustomerId", CustomerId);
    console.log("PartsTypesId", PartsTypesId);
    console.log("CategoryId", CategoryId);
    console.log("LocationId", LocationId);
    console.log("Userid", Userid);
    console.log("taskName", taskName);
    console.log("startDate", startDate);
    console.log("dueDate", dueDate);
    console.log("scheduleDateTime", scheduleDateTime);
    console.log("selectedStatus", selectedStatus);
  }, [
    CustomerId,
    PartsTypesId,
    CategoryId,
    LocationId,
    Userid,
    taskName,
    startDate,
    dueDate,
    scheduleDateTime,
    selectedStatus,
  ]);

  const formatMultipleSelections = (items) => {
    if (!items || items.length === 0) return 'choose';
    if (items.length === 1) return items[0].name;
    return `${items[0].name} +${items.length - 1}`;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case '0':
        return '#3e85f7'; // Normal - Blue
      case '1':
        return '#4CAF50'; // Low - Green
      case '2':
        return '#FFA500'; // Medium - Orange
      case '3':
        return '#FF0000'; // High - Red
      default:
        return '#3e85f7'; // Default - Blue
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F5F6F8',
      padding: 16,
    },
    formCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: 15,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
      marginBottom: 20,
    },
    inputContainer: {
      marginBottom: 15,
    },
    input: {
      height: 50,
      backgroundColor: '#F8F9FA',
      borderBottomWidth: 1,
      borderColor: '#000',
      borderRadius: 10,
      paddingHorizontal: 15,
      fontSize: 16,
      color: '#333',
    },
    label: {
      fontSize: 15,
      fontWeight: '600',
      color: '#2C3E50',
      marginBottom: 8,
      marginLeft: 4,
    },
    pickerContainer: {
      marginBottom: 15,
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
    pickerText: {
      fontSize: 16,
      color: '#333',
    },
    pickerIcon: {
      color: Colour,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
      backgroundColor: '#FFFFFF',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingTop: 20,
      paddingHorizontal: 16,
      paddingBottom: 30,
      height: '80%',
      marginTop: 'auto',
    },
    modalContents: {
      backgroundColor: '#FFFFFF',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingTop: 20,
      paddingHorizontal: 16,
      paddingBottom: 30,
      maxHeight: '80%',
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
    statusContainer: {
      marginBottom: 20,
    },
    statusLabel: {
      fontSize: 15,
      fontWeight: '600',
      color: '#2C3E50',
      marginBottom: 12,
      marginLeft: 4,
    },
    statusButtonsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    statusButton: {
      flex: 1,
      height: 40,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 4,
      borderWidth: 1,
    },
    statusButtonText: {
      fontSize: 14,
      fontWeight: '500',
    },
    // Status button variants
    noneButton: {
      backgroundColor: selectedStatus === 0 ? '#E2E8F0' : '#FFFFFF',
      borderColor: '#E2E8F0',
    },
    lowButton: {
      backgroundColor: selectedStatus === 1 ? '#BBF7D0' : '#FFFFFF',
      borderColor: '#BBF7D0',
    },
    mediumButton: {
      backgroundColor: selectedStatus === 2 ? '#FDE68A' : '#FFFFFF',
      borderColor: '#FDE68A',
    },
    highButton: {
      backgroundColor: selectedStatus === 3 ? '#FECACA' : '#FFFFFF',
      borderColor: '#FECACA',
    },
    // Status text variants
    noneText: {
      color: selectedStatus === 0 ? '#475569' : '#64748B',
    },
    lowText: {
      color: selectedStatus === 1 ? '#166534' : '#22C55E',
    },
    mediumText: {
      color: selectedStatus === 2 ? '#854D0E' : '#EAB308',
    },
    highText: {
      color: selectedStatus === 3 ? '#991B1B' : '#EF4444',
    },
    imageUploadContainer: {
      marginVertical: 10,
      padding: 15,
      backgroundColor: '#fff',
      borderRadius: 8,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    uploadButton: {
      backgroundColor: '#f5f5f5',
      padding: 15,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#e0e0e0',
      borderStyle: 'dashed',
    },
    uploadButtonContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    uploadButtonText: {
      marginLeft: 10,
      fontSize: 16,
      color: '#2196F3',
      fontWeight: '500',
    },
    loadingIndicator: {
      marginTop: 10,
    },
    errorText: {
      color: '#f44336',
      marginTop: 8,
      fontSize: 14,
    },
    imageButtonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 15,
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
      color: Colour,
      fontSize: 14,
    },
    imagePreviewContainer: {
      flexDirection: 'row',
      marginTop: 10,
      paddingHorizontal: 10,
    },
    imagePreview: {
      position: 'relative',
      marginRight: 10,
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
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
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
    addImageText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '600',
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
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
    },
    modalOptionText: {
      fontSize: 16,
      marginLeft: 15,
      color: '#333',
    },
    cancelOption: {
      borderBottomWidth: 0,
      marginTop: 10,
    },
    cancelText: {
      color: 'red',
      textAlign: 'center',
      width: '100%',
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
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 20,
      color: '#000',
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
    timeInput: {
      borderWidth: 1,
      borderColor: Colour,
      borderRadius: 10,
      paddingHorizontal: 15,
      paddingVertical: 10,
      width: 100,
      marginBottom: 5,
      fontSize: 16,
      textAlign: 'center',
      color: '#000',
    },
    timeLabel: {
      color: '#666',
      fontSize: 14,
    },
    modalButtonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
      marginTop: 10,
    },
    modalButton: {
      borderRadius: 10,
      padding: 10,
      elevation: 2,
      minWidth: 100,
      marginHorizontal: 10,
    },
    saveButton: {
      backgroundColor: Colour,
    },
    cancelButton: {
      backgroundColor: '#ccc',
    },
    modalButtonText: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
      fontSize: 16,
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
    selectedPartsContainer: {
      marginTop: 16,
    },
    partItem: {
      backgroundColor: '#f5f5f5',
      padding: 12,
      borderRadius: 8,
      marginBottom: 8,
    },
    partName: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 4,
    },
    partQty: {
      fontSize: 14,
      color: '#666',
    },
    dateTimeDisplay: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 8,
    },
    dateTimeText: {
      fontSize: 16,
      color: '#333',
    },
    datePickerButton: {
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
    datePickerLabel: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 5,
    },
    datePickerValue: {
      fontSize: 16,
      color: '#3e85f7',
    },
    saveButton: {
      backgroundColor: '#3e85f7',
      padding: 12,
      borderRadius: 8,
      marginTop: 10,
      alignItems: 'center',
      marginHorizontal: 10,
    },
    saveButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '500',
    },
    saveButtonDisabled: {
      backgroundColor: '#cccccc',
    },
    uploadMoreButton: {
      backgroundColor: '#f0f0f0',
      padding: 12,
      borderRadius: 8,
      marginTop: 10,
      alignItems: 'center',
      marginHorizontal: 10,
      flexDirection: 'row',
      justifyContent: 'center',
    },
    uploadMoreButtonText: {
      color: '#3e85f7',
      fontSize: 16,
      marginLeft: 8,
    },
    inputError: {
      borderColor: '#ff0000',
      borderWidth: 1,
    },
    errorText: {
      color: '#ff0000',
      fontSize: 12,
      marginTop: 5,
    },
    priorityContainer: {
      marginBottom: 15,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    bottomSheetContainer: {
      backgroundColor: 'white',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingHorizontal: 20,
      paddingTop: 12,
      paddingBottom: 30,
      minHeight: 300,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: -2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    bottomSheetContent: {
      width: '100%',
    },
    bottomSheetHandle: {
      width: 40,
      height: 4,
      borderRadius: 2,
      backgroundColor: '#ccc',
      alignSelf: 'center',
      marginBottom: 20,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
      color: '#000',
    },
    timeInputContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 30,
    },
    timeInputGroup: {
      alignItems: 'center',
    },
    timeInput: {
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 8,
      padding: 12,
      width: 100,
      textAlign: 'center',
      fontSize: 18,
      marginBottom: 8,
    },
    timeLabel: {
      fontSize: 16,
      color: '#666',
    },
    modalButtonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
    },
    modalButton: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 8,
      marginHorizontal: 8,
    },
    cancelButton: {
      backgroundColor: '#f2f2f2',
    },
    saveButton: {
      backgroundColor: '#3e85f7',
    },
    modalButtonText: {
      textAlign: 'center',
      fontSize: 16,
      fontWeight: '600',
    },
    cancelButtonText: {
      color: '#666',
    },
    saveButtonText: {
      color: '#fff',
    },
    inputError: {
      borderColor: '#ff0000',
      borderWidth: 1,
    },
    errorText: {
      color: '#ff0000',
      fontSize: 12,
      marginTop: 5,
    },
    priorityButtonsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
      marginTop: 8,
    },
    priorityButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#E0E0E0',
      backgroundColor: '#F5F5F5',
      minWidth: 50,
      alignItems: 'center',
    },
    priorityButtonText: {
      fontSize: 14,
      color: '#333',
      fontWeight: '500',
    },
    selectedPriorityText: {
      color: '#FFFFFF',
      fontWeight: 'bold',
      textShadowColor: 'rgba(0, 0, 0, 0.2)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
    },
    imageSection: {
      marginVertical: 10,
    },
    addImageButton: {
      backgroundColor: '#007AFF',
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
    },
    addImageText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '600',
    },
    imageList: {
      paddingVertical: 10,
    },
    imageContainer: {
      marginRight: 10,
      position: 'relative',
    },
    imagePreview: {
      width: 100,
      height: 100,
      borderRadius: 8,
    },
    removeImageButton: {
      position: 'absolute',
      top: -8,
      right: -8,
      backgroundColor: 'red',
      width: 24,
      height: 24,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    removeImageText: {
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold',
    },
    uploadButton: {
      backgroundColor: '#007AFF',
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
    },
    uploadButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '600',
    },
    imagePreviewContainer: {
      marginTop: 10,
      minHeight: 120,
    },
    imagePreviewWrapper: {
      marginRight: 10,
      position: 'relative',
    },
    previewImage: {
      width: 100,
      height: 100,
      borderRadius: 8,
    },
  });


  return (
    <ScrollView style={styles.container}>
      <View style={styles.formCard}>
        <View style={styles.inputContainer}>
          <TextInput
            style={[
              styles.input,
              validationErrors.taskName && styles.inputError
            ]}
            placeholder="What needs to be done?"
            placeholderTextColor="#999"
            value={taskName}
            onChangeText={(text) => handleTaskNameChange(text)}
          />
          {validationErrors.taskName && (
            <Text style={styles.errorText}>{validationErrors.taskName}</Text>
          )}
        </View>

        <View style={styles.documentContainer}>
          {documents.map((doc, index) => (
            <View key={index} style={styles.documentItem}>
              <Text style={styles.documentName}>{doc.name}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Images</Text>
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={handleImagePickerDialog}
          >
            <Text style={styles.uploadButtonText}>Add Images</Text>
          </TouchableOpacity>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.imagePreviewContainer}
          >
            {images.map((image, index) => (
              <View key={index} style={styles.imagePreviewWrapper}>
                <Image 
                  source={{ uri: image.uri }} 
                  style={styles.previewImage} 
                />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => removeImage(index)}
                >
                  <Text style={styles.removeImageText}>×</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={[styles.inputContainer, { height: 100 }]}>
          <Text style={styles.label}>Discription</Text>
          <TextInput numberOfLines={4}
            style={[
              styles.input,
              validationErrors.description && styles.inputError
            ]}
            placeholder="Add a description"
            placeholderTextColor="#999"
            value={description}
            onChangeText={(text) => handleDescriptionChange(text)}
          />

          {validationErrors.description && (
            <Text style={styles.errorText}>{validationErrors.description}</Text>
          )}
        </View>
        <TouchableOpacity
          style={[styles.pickerButton, { marginVertical: 10 }]}
          onPress={() => setShowEstimatedTimeDialog(true)}
        >
          <View>
            <Text style={[styles.pickerText, { color: "#000", fontWeight: "bold" }]}>
              Estimated Time
            </Text>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
            <Text style={{ color: Colour, fontWeight: "bold" }}>{EstimatedTime==1?"1h 0m": EstimatedTime}</Text>
            <Icon
              type='ionicon'
              name='chevron-right'
              size={18}
              style={styles.pickerIcon}
            />
          </View>

        </TouchableOpacity>
        <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowDueDate(true)}>
          <Text style={styles.datePickerLabel}>Due Date</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.datePickerValue}>
              {dueDate ? format(new Date(dueDate), 'dd/MM/yyyy') : 'Set'}
            </Text>
            {dueDate && (
              <TouchableOpacity 
                onPress={(e) => {
                  e.stopPropagation();
                  setDueDate(null);
                }}
                style={{ marginLeft: 8, padding: 4 }}
              >
                <Icon name="minus-circle" size={20} color="red" />
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowStartDate(true)}>
          <Text style={styles.datePickerLabel}>Start Date</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.datePickerValue}>
              {startDate ? format(new Date(startDate), 'dd/MM/yyyy') : 'Set'}
            </Text>
            {startDate && (
              <TouchableOpacity 
                onPress={(e) => {
                  e.stopPropagation();
                  setStartDate(null);
                }}
                style={{ marginLeft: 8, padding: 4 }}
              >
                <Icon name="minus-circle" size={20} color="red" />
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.datePickerButton} onPress={showSchedulePicker}>
          <Text style={styles.datePickerLabel}>Schedule Date</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.datePickerValue}>
              {scheduleDateTime ? format(new Date(scheduleDateTime), 'dd/MM/yyyy hh:mm a') : 'Set'}
            </Text>
            {scheduleDateTime && (
              <TouchableOpacity 
                onPress={(e) => {
                  e.stopPropagation();
                  setScheduleDateTime(null);
                }}
                style={{ marginLeft: 8, padding: 4 }}
              >
                <Icon name="minus-circle" size={20} color="red" />
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>

        {showScheduleDateTime && (
          <DateTimePicker
            value={new Date()}
            mode={scheduleMode}
            is24Hour={false}
            display="default"
            onChange={onScheduleDateTimeChange}
          />
        )}

        {showDueDate && (
          <DateTimePicker
            value={dueDate || new Date()}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDueDate(false);
              if (selectedDate) {
                setDueDate(selectedDate);
                global.tempDueDate = selectedDate;
              }
            }}
          />
        )}

        {showStartDate && (
          <DateTimePicker
            value={startDate || new Date()}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowStartDate(false);
              if (selectedDate) {
                setStartDate(selectedDate);
                global.tempStartDate = selectedDate;
              }
            }}
          />
        )}
        <Modal
          animationType="slide"
          transparent={true}
          visible={showEstimatedTimeDialog}
          onRequestClose={() => setShowEstimatedTimeDialog(false)}
        >
          <TouchableOpacity 
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowEstimatedTimeDialog(false)}
          >
            <View style={styles.bottomSheetContainer}>
              <View style={styles.bottomSheetContent}>
                <View style={styles.bottomSheetHandle} />
                
                <Text style={styles.modalTitle}>Set Estimated Time</Text>

                <View style={styles.timeInputContainer}>
                  <View style={styles.timeInputGroup}>
                    <TextInput
                      style={styles.timeInput}
                      keyboardType="numeric"
                      value={hours}
                      onChangeText={handleHoursChange}
                      maxLength={4}
                    />
                    <Text style={styles.timeLabel}>Hours</Text>
                  </View>

                  <View style={styles.timeInputGroup}>
                    <TextInput
                      style={styles.timeInput}
                      keyboardType="numeric"
                      value={minutes}
                      onChangeText={handleMinutesChange}
                      maxLength={4}
                    />
                    <Text style={styles.timeLabel}>Minutes</Text>
                  </View>
                </View>

                <View style={styles.modalButtonContainer}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => setShowEstimatedTimeDialog(false)}
                  >
                    <Text style={[styles.modalButtonText, styles.cancelButtonText]}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.saveButton]}
                    onPress={handleSaveEstimatedTime}
                  >
                    <Text style={[styles.modalButtonText, styles.saveButtonText]}>Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
        <View style={styles.priorityContainer}>
          <Text style={styles.label}>Priority</Text>
          <View style={styles.priorityButtonsContainer}>
            {renderPriorityButton('0', 'Normal')}
            {renderPriorityButton('1', 'Low')}
            {renderPriorityButton('2', 'Medium')}
            {renderPriorityButton('3', 'High')}
          </View>
        </View>

        {[
          { label: 'Work Types', value: PartsTypes, type: 'PartsTypes' },
          { label: 'Customer', value: CustomerName, type: 'Customer' },
          { label: 'Assigned To', value: UserName, type: 'AssignedTo' },
          { label: 'Location', value: Location, type: 'Location' },
          { label: 'Category', value: Category, type: 'Category' },

          // { label: 'Parts', value: formatMultipleSelections(multiSelectedParts), type: 'Parts' }
        ].map((item, index) => (
          // <View key={index} style={styles.pickerContainer}>
          //   <Text style={styles.label}>{item.label}</Text>
          <TouchableOpacity
            style={styles.pickerButton}
            onPress={() => onSelectPicker(item.type)}
          >
            <View>
              <Text style={[styles.pickerText, { color: "#000", fontWeight: "bold" }]}>
                {item?.label}
                {/* {item.value || `Select ${item.label}`} */}
              </Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
              <Text style={{ color: Colour, fontWeight: "bold" }}>{item.value}</Text>
              <Icon
                type='ionicon'
                name='chevron-right'
                size={18}
                style={styles.pickerIcon}
              />
            </View>

          </TouchableOpacity>
          // </View>
        ))}

        {/* <TouchableOpacity 
            style={styles.imageUploadButton}
            onPress={() => handlePartSelection(multiSelectedParts)}
          >
            <Text style={styles.buttonText}>Add Parts</Text>
          </TouchableOpacity>
          <View style={styles.selectedPartsContainer}>
            {multiSelectedParts.map((part) => (
              <View key={part.id} style={styles.partItem}>
                <Text style={styles.partName}>{part.name}</Text>
                <Text style={styles.partQty}>Quantity: {part.free_qty}</Text>
              </View>
            ))}
          </View> */}
        {/* <TouchableOpacity 
            style={styles.imageUploadButton}
            onPress={pickImage}
          >
            <Text style={styles.buttonText}>Upload Image</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.documentUploadButton}
            onPress={uploadDocument}
          >
            <Text style={styles.buttonText}>Upload Document</Text>
          </TouchableOpacity> */}
        {/* <TouchableOpacity 
            style={styles.documentUploadButton}
            onPress={uploadDocument}
          >
            <Text style={styles.buttonText}>Upload Document</Text>
          </TouchableOpacity> */}

      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={visible2}
        onRequestClose={() => {
          setVisible2(false);
          console.warn("close", modalData);
        }}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.modalDismissArea}
            onPress={() => {
              setVisible2(false);
              console.warn("close", modalData);
            }}
          />
          <View style={styles.modalContents}>
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search..."
                value={searchQuery}
                onChangeText={handleSearch}
                placeholderTextColor="#666"
              />
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {(searchQuery ? filteredModalData : modalData).map((item, i) => {
                const isSelected =
                  (item.field === 'Parts' && multiSelectedParts.some(part => part.id === item.id)) ||
                  (item.field === 'User' && multiSelectedUsers.some(user => user.id === item.id));

                return (
                  <TouchableOpacity
                    key={i}
                    style={[
                      styles.modalItem,
                      isSelected && styles.selectedModalItem
                    ]}
                    onPress={() => onSelectItem(item)}
                  >
                    <Icon
                      name={item.field === "PartsTypes" ? "wrench" :
                        item.field === "Customer" ? "account" :
                          item.field === "AssignedTo" ? "account-multiple" :
                            item.field === "Category" ? "folder" :
                              item.field === "Location" ? "map-marker" : "wrench"}
                      size={24}
                      style={{}}
                    />
                    <Text style={styles.modalItemText}>
                      {types === "PartsTypes" ? item.name :
                        types === "Customer" ? item.name :
                          types === "AssignedTo" ? item.name :
                            types === "Category" ? item.name :
                              types === "Location" ? item.name : item.name}
                    </Text>
                    {isSelected && (
                      <Icon2 name="check" size={24} style={styles.tickIcon} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={Visible}
        onRequestClose={() => {
          SetVisible(false);
          console.warn("close", modalData);
        }}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.modalDismissArea}
            onPress={() => {
              SetVisible(false);
              console.warn("close", modalData);
            }}
          />
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View>
                <Text>{selectedProdcut.name}</Text>

                <Text>{selectedProdcut.free_qty}</Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );;
};

export default WorkOrderAdd; 
