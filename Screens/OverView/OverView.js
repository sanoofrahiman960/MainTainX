import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Animated,
  Easing,
  Dimensions,
  Modal,
  Alert,
  Platform,
  PermissionsAndroid
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { signOut } from '../../redux/reducers/authReducer';
import { useSelector, useDispatch } from 'react-redux';
import * as asyncCache from '../../Util/Storage';
import { getData,getObjectData } from '../../Util/Storage';
import { BASE_URL } from '../../Util/Const';
import { set } from 'date-fns';
import { CommonActions } from '@react-navigation/native';
import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';
import SignatureScreen from 'react-native-signature-canvas';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2; // 16px padding on each side, 16px gap

export default function LandingScreen() {
  const [scaleAnim] = useState(new Animated.Value(0.95));
  const navigation = useNavigation();
  const Focus=useIsFocused();
  const [activeTab, setActiveTab] = useState('Overview');
  const [isModalVisible, setModalVisible] = useState(false);
  const [employeeName, setEmployeeName] = useState('');
  const [employeeID, setEmployeeID] = useState('');
  const [workOrders, setWorkOrderData] = useState([]);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [employeeId, setEmployeeId] = useState(null);

  const downloadDeliveryReport = async () => {
    setIsDownloading(true);
    try {
      // Request storage permission for Android
      if (Platform.OS === 'android') {
        try {
          // For Android 10 and above
          if (Platform.Version >= 29) {
            const permissions = [
              PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
              PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
            ];
            
            const granted = await PermissionsAndroid.requestMultiple(permissions);
            
            const allGranted = Object.values(granted).every(
              permission => permission === PermissionsAndroid.RESULTS.GRANTED
            );
            
            if (allGranted) {
              Alert.alert(
                'Permission Required',
                'Please grant storage permissions to download the report',
                [
                  {
                    text: 'OK',
                    onPress: () => setIsDownloading(false)
                  }
                ]
              );
              return;
            }
          } else {
            // For Android 9 and below
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
              {
                title: 'Storage Permission',
                message: 'App needs access to storage to download the report',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
              }
            );
            
            if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
              Alert.alert(
                'Permission Required',
                'Please grant storage permission to download the report',
                [
                  {
                    text: 'OK',
                    onPress: () => setIsDownloading(false)
                  }
                ]
              );
              return;
            }
          }
        } catch (err) {
          console.warn(err);
          Alert.alert('Error', 'Failed to request permission');
          setIsDownloading(false);
          return;
        }
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
            model: "stock.picking",
            method: "search_read",
            args: [],
            kwargs: {
              fields: ["name", "scheduled_date", "origin", "partner_id"],
              domain: [
                ["picking_type_code", "=", "outgoing"],
                ["state", "not in", ["done", "cancel"]],
                ["company_id", "=", 1]
              ]
            }
          }
        }),
      });

      const data = await response.json();
      
      if (data.result) {
        // Format the data for CSV
        const csvData = data.result.map(item => ({
          'Order Reference': item.name,
          'Scheduled Date': item.scheduled_date ? new Date(item.scheduled_date).toLocaleDateString() : '',
          'Source Document': item.origin || '',
          'Partner': item.partner_id ? item.partner_id[1] : ''
        }));

        // Convert to CSV string
        const headers = ['Order Reference', 'Scheduled Date', 'Source Document', 'Partner'];
        const csvString = [
          headers.join(','),
          ...csvData.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
        ].join('\n');

        // Get the local path for saving the file
        const fileName = `delivery_orders_${new Date().toISOString().split('T')[0]}.csv`;
        const localFile = Platform.select({
          ios: `${RNFS.DocumentDirectoryPath}/${fileName}`,
          android: `${RNFS.DownloadDirectoryPath}/${fileName}`
        });

        // Write the file
        await RNFS.writeFile(localFile, csvString, 'utf8');

        // Show success message with view option
        Alert.alert(
          'Success',
          Platform.OS === 'android' 
            ? `Report downloaded to Downloads folder as "${fileName}". Would you like to view it?`
            : 'Report downloaded successfully. Would you like to view it?',
          [
            {
              text: 'View',
              onPress: async () => {
                try {
                  await FileViewer.open(localFile, {
                    showOpenWithDialog: true
                  });
                } catch (error) {
                  console.error('Error opening file:', error);
                  Alert.alert('Error', 'Could not open the file. You can find it in your Downloads folder.');
                }
              }
            },
            {
              text: 'Close',
              style: 'cancel'
            }
          ]
        );
      } else {
        Alert.alert('No Data', 'No delivery orders found');
      }
    } catch (error) {
      console.error('Error downloading report:', error);
      Alert.alert('Error', 'Failed to download delivery report');
    } finally {
      setIsDownloading(false);
    }
  };

  useEffect(() => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 300,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      navigation.navigate('Tabs');
    }, 200);

    return () => clearTimeout(timer);
  }, [navigation, scaleAnim]);

  useEffect(() => {
    const fetchWorkOrders = async () => {
        const Data = await getObjectData("EMPLOYEE_DATA");
        setEmployeeName(Data?.name);
      
        try {
            const Token = await getData("ACCESS_TOKEN");
            const IDs = await getData("EMPLOYEE_ID");
            const currentWorkOrders = await getData("OVERVIEW_WORK_ORDERS");
            
            if (currentWorkOrders) {
              setWorkOrderData(currentWorkOrders);
            }

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
                            "fields": ["name", "priority", "stage_id", "due_date", "employee_ids", "contact_location_id", "partner_id", "write_date"],
                            "domain": [["employee_ids", "in", [Data?.id]]]
                        }
                    },
                }),
            });
            const empData = await empResponse.json();
            
            if (empData.result) {
                const hasChanges = !currentWorkOrders || 
                    empData.result.some((newOrder, index) => {
                        const currentOrder = currentWorkOrders[index];
                        return !currentOrder || currentOrder.write_date !== newOrder.write_date;
                    });

                if (hasChanges) {
                    setWorkOrderData(empData.result);
                    await asyncCache.storeData("OVERVIEW_WORK_ORDERS", empData.result);
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

    fetchWorkOrders();
}, [Focus]);

  useEffect(() => {
    const fetchEmployeeId = async () => {
      try {
        const data = await getObjectData("EMPLOYEE_DATA");
        if (data && data.id) {
          setEmployeeId(data.id);
        }
      } catch (error) {
        console.error('Error fetching employee data:', error);
      }
    };
    fetchEmployeeId();
  }, []);

  const handleSignature = async (signature) => {
    try {
      if (!employeeId) {
        Alert.alert('Error', 'Employee ID not found');
        return;
      }

      // Process the signature data
      let base64Data = signature;
      
      // If it's a data URL, extract the base64 part
      if (base64Data.startsWith('data:')) {
        base64Data = base64Data.split(',')[1];
      }

      // Clean up any whitespace and newlines
      base64Data = base64Data.trim().replace(/[\n\r]/g, '');

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
            method: "write",
            args: [[employeeId], { employee_signature: base64Data }],
            kwargs: {}
          }
        }),
      });

      const result = await response.json();
      
      if (result.error) {
        console.error('API Error:', result.error);
        throw new Error(result.error.data?.message || 'Failed to save signature');
      }

      Alert.alert('Success', 'Signature saved successfully');
      setShowSignatureModal(false);
    } catch (error) {
      console.error('Error saving signature:', error);
      Alert.alert('Error', 'Failed to save signature. Please try again.');
    }
  };

  const handleSignatureClear = () => {
    // Signature pad clear handler
  };

  const handleSignatureEnd = () => {
    // Signature end handler
  };

  const getWorkOrderCounts = (workOrders) => {
    const today = new Date('2024-12-14T20:46:18+05:30');
  
    return {
      highPriority: workOrders.filter(wo => wo.priority === '0' || wo.priority === '1').length,
      overdue: workOrders.filter(wo => {
        if (!wo.due_date) return false;
        return new Date(wo.due_date) < today;
      }).length,
      pending: workOrders.filter(wo => wo.stage_id[0] === 1).length,
      completed: workOrders.filter(wo => wo.stage_id[0] === 3).length
    };
  };

  const workOrderCounts = getWorkOrderCounts(workOrders);

  const statusCards = [
    {
      title: 'High Priority',
      icon: 'alert',
      color: '#F44336',
      count: workOrderCounts.highPriority,
      filter: { priority: ['0', '1'] }
    },
    {
      title: 'Overdue',
      icon: 'clock-alert',
      color: '#FF9800',
      count: workOrderCounts.overdue,
      filter: { overdue: true }
    },
    {
      title: 'Pending',
      icon: 'clock',
      color: '#2196F3',
      count: workOrderCounts.pending,
      filter: { stage: 1 }
    },
    {
      title: 'Completed',
      icon: 'check-circle',
      color: '#4CAF50',
      count: workOrderCounts.completed,
      filter: { stage: 3 }
    }
  ];

  const handleAccount = () => {
    asyncCache.clearAll();
    navigation.navigate('AuthStack');
  
  };


    
  const CreateOption = ({ icon, label, onPress }) => (
    <TouchableOpacity style={styles.createOption} onPress={onPress}>
      <View style={styles.createIconContainer}>
        <Icon name={icon} size={24} color="#007AFF" />
      </View>
      <Text style={styles.createOptionLabel}>{label}</Text>
      <Icon name="chevron-right" size={24} color="#999" />
    </TouchableOpacity>
  );

  const actionButtons = [
    { id: 1, title: 'Due Today', icon: 'clock-outline', color: '#4CAF50' },
    { id: 2, title: 'Add', icon: 'plus', color: '#2196F3' },
    { id: 3, title: 'Delivery Report', icon: 'qrcode', color: '#FF9800' },
    { id: 4, title: 'Support', icon: 'help-circle-outline', color: '#9C27B0' },
  ];

  const renderActionButton = ({ title, icon, color }) => (
    <TouchableOpacity
      style={styles.actionButton}
      key={title}
      onPress={() => {
        if (title === 'Add') {
          setModalVisible(true);
        } else if (title === 'Due Today') {
          console.log('Due Today pressed');
        } else if (title === 'Delivery Report') {
          navigation.navigate('DeliveryReport');
        } else if (title === 'Support') {
          console.log('Support pressed');
        }
      }}
    >
      <View style={[styles.actionIconContainer, { backgroundColor: color }]}>
        <Icon name={icon} size={24} color="#FFFFFF" />
      </View>
      <Text style={styles.actionButtonText}>{title}</Text>
    </TouchableOpacity>
  );

  const renderStatusCard = ({ title, icon, count, color, onPress }) => (
    <TouchableOpacity
      style={[styles.statusCard, { width: cardWidth }]}
      key={title}
      onPress={onPress}
    >
      <View style={[styles.statusCardIcon, { backgroundColor: color }]}>
        <Icon name={icon} size={24} color="#FFFFFF" />
      </View>
      <Text style={styles.statusCount}>{count}</Text>
      <Text style={styles.statusTitle}>{title}</Text>
    </TouchableOpacity>
  );

  const getPriorityColor = (priority) => {
    console.log("priority", priority);
    switch (priority) {
      case 0: return '#F44336';  // Critical - Red
      case 1: return '#FF9800';  // High - Orange
      case 2: return '#FFC107';  // Medium - Yellow
      case 3: return '#4CAF50';  // Low - Green
      default: return '#757575';   // Default - Grey
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Animated.View style={[styles.content, { transform: [{ scale: scaleAnim }] }]}>
          {/* Header Section */}
          <View style={styles.header}>
            <View>
              <Text style={styles.welcomeText}>Welcome back,</Text>
              <Text style={styles.name}>{employeeName || 'Guest'}</Text>
            </View>
            <TouchableOpacity onPress={handleAccount} style={styles.accountButton}>
              <Icon name="account" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Status Overview Section */}
          <View style={styles.overviewSection}>
            <Text style={styles.sectionTitle}>Work Orders Overview</Text>
            <View style={styles.statusCardsContainer}>
              {statusCards.map(card => renderStatusCard(card))}
            </View>
          </View>

          {/* Quick Actions Section */}
          <View style={styles.quickActionsSection}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.actionButtonsContainer}>
              {actionButtons.map(button => renderActionButton(button))}
            </View>
          </View>

          {/* Recent Activity Section */}
          <View style={styles.recentActivitySection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Activity</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Work Orders')}>
                <Text style={styles.viewAllButton}>View All</Text>
              </TouchableOpacity>
            </View>
            {workOrders.slice(0, 3).map((wo) => (
              <View 
               
                style={styles.activityCard}

              >
                <View style={styles.activityHeader}>
                  <Text style={styles.activityTitle}>{wo.name}</Text>
                  <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(wo.priority) }]}>
                    <Text style={styles.priorityText}>
                      {wo.priority === '0' ? 'Normal' : 
                       wo.priority === '1' ? 'Low' : 
                       wo.priority === '2' ? 'Medium' : 'High'}
                    </Text>
                  </View>
                </View>
                <View style={styles.activityMeta}>
                  <Text style={styles.activityId}>#{wo.id}</Text>
                  <View style={styles.metaDetails}>
                    <Icon name="map-marker" size={14} color="#666" style={styles.metaIcon} />
                    <Text style={styles.metaText} numberOfLines={1}>
                      {wo.contact_location_id ? wo.contact_location_id[1] : 'No Location'}
                    </Text>
                  </View>
                  {wo.due_date && (
                    <View style={styles.metaDetails}>
                      <Icon name="calendar" size={14} color="#666" style={styles.metaIcon} />
                      <Text style={[styles.metaText, 
                        new Date(wo.due_date) < new Date('2024-12-14T20:46:18+05:30') ? styles.overdueText : null]}>
                        {new Date(wo.due_date).toLocaleDateString()}
                      </Text>
                    </View>
                  )}
                </View>
             </View>
            ))}
          </View>
          {/* <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.actionButton, { marginBottom: 10 }]}
              onPress={() => setShowSignatureModal(true)}
            >
              <Icon name="draw" size={24} color="#fff" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Add Signature</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.downloadButton, { opacity: isDownloading ? 0.7 : 1 }]}
              onPress={downloadDeliveryReport}
              disabled={isDownloading}
            >
              <Icon name="file-download" size={24} color="#fff" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>
                {isDownloading ? 'Downloading...' : 'Download Delivery Report'}
              </Text>
            </TouchableOpacity>
          </View> */}
        </Animated.View>
      </ScrollView>
      {/* FAB for creating new work order */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Icon name="plus" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Create New Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create New</Text>
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => setModalVisible(false)}
              >
                <Icon name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <CreateOption
              icon="wrench"
              label="Work Order"
              onPress={() => {
                setModalVisible(false);
                navigation.navigate('Work Orders');
              }}
            />
            <CreateOption
              icon="clipboard-list"
              label="Maintenance Task"
              onPress={() => {
                setModalVisible(false);
                navigation.navigate('CreateTask');
              }}
            />
          
          </View>
        </View>
      </Modal>

      {/* Signature Modal */}
      <Modal
        visible={showSignatureModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowSignatureModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Your Signature</Text>
            <View style={styles.signaturePadContainer}>
              <SignatureScreen
                onOK={(signature) => handleSignature(signature)}
                onEmpty={() => Alert.alert('Error', 'Please add your signature')}
                onClear={handleSignatureClear}
                onEnd={handleSignatureEnd}
                descriptionText="Sign above"
                clearText="Clear"
                confirmText="Save"
                webStyle={`
                  .m-signature-pad {
                    margin: 0;
                    height: 100%;
                    width: 100%;
                  }
                  .m-signature-pad--body {
                    border: 1px solid #e8e8e8;
                  }
                  .m-signature-pad--body canvas {
                    width: 100% !important;
                    height: 100% !important;
                    margin: 0;
                  }
                  .m-signature-pad--footer {
                    margin-top: 10px;
                    height: 40px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                  }
                  .m-signature-pad--footer .button {
                    padding: 8px 20px;
                    margin: 0 10px;
                    border: none;
                    border-radius: 4px;
                    font-size: 14px;
                    font-weight: bold;
                    cursor: pointer;
                  }
                  .m-signature-pad--footer .button.clear {
                    background-color: #f44336;
                    color: white;
                  }
                  .m-signature-pad--footer .button.save {
                    background-color: #2196F3;
                    color: white;
                  }
                `}
                autoClear={true}
                imageType="image/png"
                dataURL={true}
                trimWhitespace={true}
                backgroundColor="white"
                penColor="black"
                dotSize={1}
              />
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowSignatureModal(false)}
            >
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  accountButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  overviewSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  statusCardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statusCardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusCount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  statusTitle: {
    fontSize: 14,
    color: '#666',
  },
  quickActionsSection: {
    marginBottom: 24,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    width: '23%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIconContainer: {
    marginBottom: 8,
  },
  actionButtonText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  recentActivitySection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllButton: {
    color: '#2196F3',
    fontSize: 14,
    fontWeight: '600',
  },
  activityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    flex: 1,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  priorityText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  activityMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activityId: {
    fontSize: 14,
    color: '#666',
  },
  metaDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  metaIcon: {
    marginRight: 4,
  },
  metaText: {
    fontSize: 14,
    color: '#666',
    maxWidth: 200,
  },
  overdueText: {
    color: '#F44336',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  signaturePadContainer: {
    height: 400,
    width: '100%',
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  closeButton: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#333',
    fontSize: 16,
  },
  buttonContainer: {
    padding: 16,
    alignItems: 'center',
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3e85f7',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    elevation: 2,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});
