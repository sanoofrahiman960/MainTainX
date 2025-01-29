import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, Alert, Platform, PermissionsAndroid, Linking } from 'react-native';
import moment from 'moment';
import { getData ,getObjectData} from '../../Util/Storage';
import { BASE_URL } from '../../Util/Const';
import SignatureScreen from 'react-native-signature-canvas';
import ReactNativeBlobUtil from 'react-native-blob-util';
import Share from 'react-native-share';
import { useIsFocused } from '@react-navigation/native';

const DeliveryReport = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSignature, setShowSignature] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [signatureType, setSignatureType] = useState(null);
  const [employeeId, setEmployeeId] = useState(null);
  const signatureRef = useRef(null);
  const isFocus = useIsFocused();

  useEffect(() => {
    const employeeData = async () => {
      const Data = await getObjectData("EMPLOYEE_DATA");
      console.log("EMPLOYEE_DATA" , Data?.id);
     
      if (Data) {
        setEmployeeId(Data?.id);
      }
    }
    employeeData();
   
    // UserDetails();
  }, [isFocus]);

  const fetchDeliveryNotes = useCallback(async () => {
    try {
      setLoading(true);
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
        setDeliveries(data.result);
      } else {
        console.error('Error in response:', data);
      }
    } catch (error) {
      console.error('Error fetching delivery notes:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDeliveryNotes();
  }, [fetchDeliveryNotes]);

  const handleSignature = useCallback((signature) => {
    setShowSignature(false);
    if (signature && selectedDelivery) {
      const base64Data = signature.split(',')[1];
      if (signatureType === 'employee') {
        submitEmployeeSignature(base64Data);
      } else if (signatureType === 'partner') {
        submitPartnerSignature(base64Data);
      }
    }
  }, [selectedDelivery, signatureType, submitEmployeeSignature, submitPartnerSignature]);

  const submitEmployeeSignature = useCallback(async (signatureBase64) => {
    try {
      const Token = await getData("ACCESS_TOKEN");
      console.log("employeeId", employeeId?.id);
     
      
    //   if (!employeeId) {
    //     Alert.alert('Error', 'Employee ID not found. Please login again.');
    //     navigation.navigate('Login');
    //     return;
    //   }

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
            args: [[employeeId], { employee_signature: signatureBase64 }],
            kwargs: {}
          }
        }),
      });

      const data = await response.json();
      if (data.result !== false) {
        Alert.alert('Success', 'Employee signature submitted successfully');
      } else {
        Alert.alert('Error', 'Failed to submit employee signature');
        console.error('Error in response:', data);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to submit employee signature');
      console.error('Error submitting signature:', error);
    }
  }, []);

  const submitPartnerSignature = useCallback(async (signatureBase64) => {
    try {
      const Token = await getData("ACCESS_TOKEN");
      if (!selectedDelivery?.partner_id?.[0]) {
        Alert.alert('Error', 'No partner found for this delivery');
        return;
      }

      const response = await fetch(`${BASE_URL}/web/dataset/call_kw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': `X-OpenERP=${Token}`,
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          params: {
            model: "res.partner",
            method: "write",
            args: [[selectedDelivery.partner_id[0]], { partner_signature: signatureBase64 }],
            kwargs: {}
          }
        }),
      });

      const data = await response.json();
      if (data.result !== false) {
        Alert.alert('Success', 'Partner signature submitted successfully');
      } else {
        Alert.alert('Error', 'Failed to submit partner signature');
        console.error('Error in response:', data);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to submit partner signature');
      console.error('Error submitting signature:', error);
    }
  }, [selectedDelivery]);

  const handleSignatureButtonPress = useCallback((item, type) => {
    setSelectedDelivery(item);
    setSignatureType(type);
    setShowSignature(true);
  }, []);

  const requestStoragePermission = useCallback(async () => {
    if (Platform.OS !== 'android') return true;

    try {
      if (Platform.Version >= 33) { 
        const readMediaPermission = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          {
            title: 'Storage Permission',
            message: 'App needs access to storage to download reports',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return readMediaPermission === PermissionsAndroid.RESULTS.GRANTED;
      } else if (Platform.Version >= 29) { 
        const readPermission = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission',
            message: 'App needs access to storage to download reports',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return readPermission === PermissionsAndroid.RESULTS.GRANTED;
      } else { 
        const writePermission = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission',
            message: 'App needs access to storage to download reports',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return writePermission === PermissionsAndroid.RESULTS.GRANTED;
      }
    } catch (err) {
      console.warn('Permission request error:', err);
      return false;
    }
  }, []);

  const openSettings = useCallback(async () => {
    try {
      if (Platform.OS === 'android') {
        await Linking.openSettings();
      }
    } catch (error) {
      console.error('Error opening settings:', error);
    }
  }, []);

  const downloadReport = useCallback(async (deliveryId, withSignature = false) => {
    try {
      if (Platform.OS === 'android') {
        const hasPermission = await requestStoragePermission();
        if (hasPermission) {
          Alert.alert(
            'Permission Required',
            'This app needs storage permission to download reports. Please grant permission in app settings.',
            [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Open Settings',
                onPress: openSettings
              },
            ]
          );
          return;
        }
      }

      const Token = await getData("ACCESS_TOKEN");
      const url = withSignature 
        ? `${BASE_URL}/report/pdf/l4l_report_delivery_slip_with_signature.report_deliveryslip_with_signature/${deliveryId}`
        : `${BASE_URL}/report/pdf/stock.report_deliveryslip/${deliveryId}`;

      const fileName = `delivery_report_${deliveryId}${withSignature ? '_signed' : ''}.pdf`;
      
      if (Platform.OS === 'ios') {
        const response = await ReactNativeBlobUtil.config({
          fileCache: true,
          appendExt: 'pdf',
        }).fetch('GET', url, {
          'Cookie': `X-OpenERP=${Token}`,
        });
        
        const base64Data = await response.base64();
        const shareOptions = {
          title: fileName,
          url: `data:application/pdf;base64,${base64Data}`,
          type: 'application/pdf',
        };
        await Share.open(shareOptions);
        await response.flush();
      } else {
        const { DownloadDir } = ReactNativeBlobUtil.fs.dirs;
        const downloadPath = `${DownloadDir}/${fileName}`;
        
        await ReactNativeBlobUtil.config({
          fileCache: true,
          addAndroidDownloads: {
            useDownloadManager: true,
            notification: true,
            mediaScannable: true,
            title: fileName,
            path: downloadPath,
            mime: 'application/pdf',
            description: 'Downloading delivery report...',
          },
        }).fetch('GET', url, {
          'Cookie': `X-OpenERP=${Token}`,
        });

        Alert.alert('Success', 'Report downloaded successfully');
      }
    } catch (error) {
      console.error('Error downloading report:', error);
      Alert.alert('Error', 'Failed to download report');
    }
  }, [requestStoragePermission, openSettings]);

  const renderDeliveryItem = useCallback(({ item }) => (
    <TouchableOpacity style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.deliveryNumber}>{item.name}</Text>
        <Text style={styles.date}>
          {moment(item.scheduled_date).format('DD MMM YYYY')}
        </Text>
      </View>
      <View style={styles.detailsRow}>
        <Text style={styles.label}>Origin: </Text>
        <Text style={styles.value}>{item.origin || 'N/A'}</Text>
      </View>
      <View style={styles.detailsRow}>
        <Text style={styles.label}>Partner: </Text>
        <Text style={styles.value}>
          {item.partner_id ? item.partner_id[1] : 'N/A'}
        </Text>
      </View>
      <View style={styles.buttonRow}>
        <View style={styles.signatureButtons}>
          <TouchableOpacity 
            style={[styles.button, styles.employeeButton]}
            onPress={() => handleSignatureButtonPress(item, 'employee')}
          >
            <Text style={styles.buttonText}>Employee Sign</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, styles.partnerButton]}
            onPress={() => handleSignatureButtonPress(item, 'partner')}
          >
            <Text style={styles.buttonText}>Partner Sign</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.reportButtons}>
          <TouchableOpacity 
            style={[styles.button, styles.reportButton]}
            onPress={() => downloadReport(item.id, false)}
          >
            <Text style={styles.buttonText}>Download Report</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, styles.signedReportButton]}
            onPress={() => downloadReport(item.id, true)}
          >
            <Text style={styles.buttonText}>Download Signed Report</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  ), [handleSignatureButtonPress, downloadReport]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={deliveries}
        renderItem={renderDeliveryItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />
      
      <Modal
        visible={showSignature}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.signatureContainer}>
            <Text style={styles.signatureTitle}>
              {signatureType === 'employee' ? 'Employee Signature' : 'Partner Signature'}
            </Text>
            <SignatureScreen
              ref={signatureRef}
              onOK={handleSignature}
              onEmpty={() => Alert.alert('Please provide a signature')}
              onClear={() => {}}
              descriptionText="Sign here"
              autoClear={true}
              imageType="image/png"
              dataURL="true"
              webStyle={`
                .m-signature-pad {
                  box-shadow: none;
                  border: none;
                  margin: 0;
                }
                .m-signature-pad--body {
                  border: none;
                }
                .m-signature-pad--footer {
                  display: none;
                }
                canvas {
                  width: 100% !important;
                  height: 100% !important;
                }
              `}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[styles.button, styles.saveButton]}
                onPress={() => {
                  if (signatureRef.current) {
                    signatureRef.current.readSignature();
                  }
                }}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.button, styles.clearButton]}
                onPress={() => {
                  if (signatureRef.current) {
                    signatureRef.current.clearSignature();
                  }
                }}
              >
                <Text style={styles.buttonText}>Clear</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]}
                onPress={() => setShowSignature(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  deliveryNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  detailsRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#666',
    width: 70,
  },
  value: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  signatureButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  reportButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signatureContainer: {
    width: '90%',
    height: 400,
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
  },
  signatureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    backgroundColor: '#f5f5f5',
  },
  buttonRow: {
    marginTop: 12,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    minWidth: 100,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  employeeButton: {
    backgroundColor: '#2196F3',
  },
  partnerButton: {
    backgroundColor: '#4CAF50',
  },
  reportButton: {
    backgroundColor: '#FF9800',
  },
  signedReportButton: {
    backgroundColor: '#9C27B0',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  clearButton: {
    backgroundColor: '#FFA000',
  },
  cancelButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default DeliveryReport;