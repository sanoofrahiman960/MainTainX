import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Alert } from 'react-native';
import { TextInput, Appbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useVendor } from '../../hooks/useVendor';
import uuid from 'react-native-uuid';

const VendorAdd = ({ route }) => {
    const navigation = useNavigation();
    const { addVendor, updateVendor } = useVendor();

    // Get editing vendor from route params if it exists
    const editingVendor = route?.params?.vendor;
    const isEditing = route?.params?.isEditing;

    // Initialize state with existing vendor data if editing
    const [name, setName] = useState(editingVendor?.name || '');
    const [email, setEmail] = useState(editingVendor?.email || '');
    const [phone, setPhone] = useState(editingVendor?.phone || '');
    const [address, setAddress] = useState(editingVendor?.address || '');
    const [description, setDescription] = useState(editingVendor?.description || '');
    const [website, setWebsite] = useState(editingVendor?.website || '');
    const [services, setServices] = useState(editingVendor?.services || '');
    const [contactPerson, setContactPerson] = useState(editingVendor?.contactPerson || '');
    const [taxId, setTaxId] = useState(editingVendor?.taxId || '');
    const [paymentTerms, setPaymentTerms] = useState(editingVendor?.paymentTerms || '');
    const [notes, setNotes] = useState(editingVendor?.notes || '');

    const handleSave = () => {
        if (!name.trim()) {
            Alert.alert('Error', 'Vendor name is required');
            return;
        }

        const vendorData = {
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim(),
            address: address.trim(),
            description: description.trim(),
            website: website.trim(),
            services: services.trim(),
            contactPerson: contactPerson.trim(),
            taxId: taxId.trim(),
            paymentTerms: paymentTerms.trim(),
            notes: notes.trim(),
            status: 'active',
            updatedAt: new Date().toISOString(),
        };

        if (isEditing) {
            // Update existing vendor
            updateVendor({
                ...vendorData,
                id: editingVendor.id,
                createdAt: editingVendor.createdAt,
            });
            Alert.alert('Success', 'Vendor updated successfully');
        } else {
            // Add new vendor
            addVendor({
                ...vendorData,
                id: uuid.v4(),
                createdAt: new Date().toISOString(),
            });
            Alert.alert('Success', 'Vendor added successfully');
        }

        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title={isEditing ? "Edit Vendor" : "Add Vendor"} />
                <Appbar.Action icon="check" onPress={handleSave} />
            </Appbar.Header>

            <ScrollView style={styles.content}>
                <TextInput
                    label="Vendor Name *"
                    value={name}
                    onChangeText={setName}
                    style={styles.input}
                    mode="outlined"
                />

                <TextInput
                    label="Email"
                    value={email}
                    onChangeText={setEmail}
                    style={styles.input}
                    mode="outlined"
                    keyboardType="email-address"
                />

                <TextInput
                    label="Phone"
                    value={phone}
                    onChangeText={setPhone}
                    style={styles.input}
                    mode="outlined"
                    keyboardType="phone-pad"
                />

                <TextInput
                    label="Address"
                    value={address}
                    onChangeText={setAddress}
                    style={styles.input}
                    mode="outlined"
                    multiline
                />

                <TextInput
                    label="Description"
                    value={description}
                    onChangeText={setDescription}
                    style={styles.input}
                    mode="outlined"
                    multiline
                />

                <TextInput
                    label="Website"
                    value={website}
                    onChangeText={setWebsite}
                    style={styles.input}
                    mode="outlined"
                    keyboardType="url"
                />

                <TextInput
                    label="Services Provided"
                    value={services}
                    onChangeText={setServices}
                    style={styles.input}
                    mode="outlined"
                    multiline
                />

                <TextInput
                    label="Contact Person"
                    value={contactPerson}
                    onChangeText={setContactPerson}
                    style={styles.input}
                    mode="outlined"
                />

                <TextInput
                    label="Tax ID"
                    value={taxId}
                    onChangeText={setTaxId}
                    style={styles.input}
                    mode="outlined"
                />

                <TextInput
                    label="Payment Terms"
                    value={paymentTerms}
                    onChangeText={setPaymentTerms}
                    style={styles.input}
                    mode="outlined"
                />

                <TextInput
                    label="Notes"
                    value={notes}
                    onChangeText={setNotes}
                    style={[styles.input, styles.lastInput]}
                    mode="outlined"
                    multiline
                />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        padding: 16,
    },
    input: {
        marginBottom: 16,
    },
    lastInput: {
        marginBottom: 32,
    },
});

export default VendorAdd;
