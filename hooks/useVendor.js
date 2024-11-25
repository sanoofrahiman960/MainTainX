import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useVendor = () => {
    const [vendors, setVendors] = useState([]);

    // Load vendors from AsyncStorage
    useEffect(() => {
        loadVendors();
    }, []);

    const loadVendors = async () => {
        try {
            const storedVendors = await AsyncStorage.getItem('vendors');
            if (storedVendors) {
                setVendors(JSON.parse(storedVendors));
            }
        } catch (error) {
            console.error('Error loading vendors:', error);
        }
    };

    const saveVendors = async (newVendors) => {
        try {
            await AsyncStorage.setItem('vendors', JSON.stringify(newVendors));
            setVendors(newVendors);
        } catch (error) {
            console.error('Error saving vendors:', error);
        }
    };

    const addVendor = async (vendor) => {
        const newVendors = [...vendors, vendor];
        await saveVendors(newVendors);
    };

    const updateVendor = async (updatedVendor) => {
        const newVendors = vendors.map(vendor => 
            vendor.id === updatedVendor.id ? updatedVendor : vendor
        );
        await saveVendors(newVendors);
    };

    const removeVendor = async (vendorId) => {
        const newVendors = vendors.filter(vendor => vendor.id !== vendorId);
        await saveVendors(newVendors);
    };

    return {
        vendors,
        addVendor,
        updateVendor,
        removeVendor,
    };
};
