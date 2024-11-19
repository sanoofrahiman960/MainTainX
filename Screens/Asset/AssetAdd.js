import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Header, Icon, Button, BottomSheet } from '@rneui/themed';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { addAssets } from '../../redux/actions/locationAction';

const AssetAdd = () => {
    const [assetName, setAssetName] = useState('');
    const [description, setDescription] = useState('');
    const [qrCode, setQrCode] = useState('');
    const [location, setLocation] = useState('');
    const [criticality, setCriticality] = useState('');
    const [serialNumber, setSerialNumber] = useState('');
    const [Manufacturer, SetManufacturer] = useState('');
    const [Year, SetYear] = useState('');
    const [model, setModel] = useState('');
    const [image, setImage] = useState(null);
    const [fileUri, setFileUri] = useState(null);
    const [ModalVisible, setModalVisible] = useState(false)
    
    const dispatch = useDispatch();
    const navigation = useNavigation();

    const handleSelectImage = () => {
        launchImageLibrary({ mediaType: 'photo' }, (response) => {
            if (response.assets && response.assets.length > 0) {
                setImage(response.assets[0].uri);
            }
        });
    };




    const handleSelectOption = (option) => {

        if (option === 'Camera') {
            handleOpenCamera();
        } else if (option === 'My Photos') {
            handleOpenLibrary();
        } else if (option === 'My Files') {
            Alert.alert("Feature not implemented", "My Files option selected");
        }
    };


    const handleOpenCamera = () => {
        launchCamera({ mediaType: 'photo' }, (response) => {
            if (response.assets && response.assets.length > 0) {
                setFileUri(response.assets[0].uri);
            }
        });
    };

    const handleOpenLibrary = () => {
        launchImageLibrary({ mediaType: 'photo' }, (response) => {
            if (response.assets && response.assets.length > 0) {
                setFileUri(response.assets[0].uri);
            }
        });
    };





    const handleTakePicture = () => {
        launchCamera({ mediaType: 'photo' }, (response) => {
            if (response.assets && response.assets.length > 0) {
                setImage(response.assets[0].uri);
            }
        });
    };

    const handleSubmit = () => {
        // Validation or API call logic goes here
        Alert.alert('Success', 'Asset created successfully!');
        navigation.goBack();
    };
    const saveAsset = async () => {
        if (!assetName.trim()) {
          Alert.alert('Error', 'Please enter a location name');
          return;
        }
    
        try {
          const newAsset = {
            id: Date.now().toString(),
            name: assetName,
            description,
            // address,
            // Add other fields as needed
          };
    
          // Save to AsyncStorage
          const existingAssetJson = await AsyncStorage.getItem('Assets');
          const existingAsset = existingAssetJson ? JSON.parse(existingAssetJson) : [];
          const updatedAssets = [...existingAsset, newAsset];
          await AsyncStorage.setItem('Assets', JSON.stringify(updatedAssets));
    
          // Dispatch to Redux
          dispatch(addAssets(newAsset));
    
          Alert.alert('Success', 'Assets saved successfully');
          navigation.goBack();
        } catch (error) {
          console.error('Error saving Assets:', error);
          Alert.alert('Error', 'Failed to save Assets');
        }
      };
    
    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            {/* Header */}
            <Header
                leftComponent={{ text: 'Cancel',  onPress: () => navigation.goBack() }}
                centerComponent={{ text: 'New Asset', style: { fontSize: 18, fontWeight: 'bold' } }}
                rightComponent={{ text: 'Create', style: {fontWeight: 'bold'  }, onPress: saveAsset }}
            />

            <ScrollView contentContainerStyle={styles.container}>
                <TextInput
                    style={styles.input}
                    placeholder="Enter Asset Name"
                    value={assetName}
                    onChangeText={setAssetName}
                />

                {/* Image Picker */}
                <TouchableOpacity style={styles.imagePicker} onPress={handleSelectImage}>
                    <Icon name="camera" type="feather" color="#007AFF" />
                    <Text style={styles.imagePickerText}>Add or take pictures</Text>
                </TouchableOpacity>

                <TextInput
                    style={[styles.input, styles.description]}
                    placeholder="Add a description"
                    value={description}
                    onChangeText={setDescription}
                    multiline
                />

                <TouchableOpacity style={styles.assignRow}>
                    <Text style={styles.assignText}>QR Code/Barcode</Text>
                    <Text style={styles.assignAction}>Assign</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.assignRow}>
                    <Text style={styles.assignText}>Location</Text>
                    <Text style={styles.assignAction}>Assign Location</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.assignRow}>
                    <Text style={styles.assignText}>Criticality</Text>
                    <Text style={styles.assignAction}>Assign</Text>
                </TouchableOpacity>

                <TextInput
                    style={styles.input}
                    placeholder="Enter Serial Number"
                    value={serialNumber}
                    onChangeText={setSerialNumber}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Enter Model"
                    value={model}
                    onChangeText={setModel}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Enter Manufacturer"
                    value={Manufacturer}
                    onChangeText={SetManufacturer}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Enter Year"
                    value={Year}
                    onChangeText={SetYear}
                />
                <View style={styles.attachmentContainer}>
                    <Text style={styles.label}>Files</Text>
                    <TouchableOpacity onPress={() => {
                        setModalVisible(true)
                    }}>
                        <Text style={styles.attachText}>Attach</Text>
                    </TouchableOpacity>
                    {fileUri ? <Text style={styles.fileText}>Selected File: {fileUri}</Text> : null}
                </View>

                <BottomSheet isVisible={ModalVisible} onBackdropPress={() => setModalVisible(false)}

                >
                    <View style={styles.bottomSheetContent}>
                        <TouchableOpacity onPress={() => handleSelectOption('Camera')} style={styles.optionButton}>
                            <Text style={styles.optionText}>Camera</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleSelectOption('My Photos')} style={styles.optionButton}>
                            <Text style={styles.optionText}>My Photos</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleSelectOption('My Files')} style={styles.optionButton}>
                            <Text style={styles.optionText}>My Files</Text>
                        </TouchableOpacity>
                    </View>
                </BottomSheet>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    input: {
        height: 50,
        borderBottomWidth: 1,
        borderColor: '#ddd',
        marginBottom: 16,
        paddingHorizontal: 10,
    },
    description: {
        height: 80,
    },
    imagePicker: {
        height: 50,
        borderWidth: 1,
        borderColor: '#007AFF',
        backgroundColor: '#EAF4FF',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginBottom: 16,
    },
    imagePickerText: {
        color: '#007AFF',
        marginLeft: 8,
    },
    assignRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#ddd',
        paddingVertical: 15,
    },
    assignText: {
        fontSize: 16,
    },
    assignAction: {
        color: '#007AFF',
    },
    attachmentContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    attachText: {
        color: '#007AFF',
        fontSize: 16,
    },
    fileText: {
        color: '#333',
        marginTop: 10,
    },
    bottomSheetContent: {
        paddingHorizontal: 20,
        paddingTop: 10, backgroundColor: "#fff"
    },
    optionButton: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    optionText: {
        fontSize: 16,
        color: '#007AFF',
    },
});

export default AssetAdd;
