import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useLocationAsset = () => {
    const [assets, setAssets] = useState([]);
    const [locations, setLocations] = useState([]);

    // Load data from AsyncStorage
    useEffect(() => {
        loadAssets();
        loadLocations();
    }, []);

    const loadAssets = async () => {
        try {
            const storedAssets = await AsyncStorage.getItem('assets');
            if (storedAssets) {
                setAssets(JSON.parse(storedAssets));
            }
        } catch (error) {
            console.error('Error loading assets:', error);
        }
    };

    const loadLocations = async () => {
        try {
            const storedLocations = await AsyncStorage.getItem('locations');
            if (storedLocations) {
                setLocations(JSON.parse(storedLocations));
            }
        } catch (error) {
            console.error('Error loading locations:', error);
        }
    };

    const saveAssets = async (newAssets) => {
        try {
            await AsyncStorage.setItem('assets', JSON.stringify(newAssets));
            setAssets(newAssets);
        } catch (error) {
            console.error('Error saving assets:', error);
        }
    };

    const saveLocations = async (newLocations) => {
        try {
            await AsyncStorage.setItem('locations', JSON.stringify(newLocations));
            setLocations(newLocations);
        } catch (error) {
            console.error('Error saving locations:', error);
        }
    };

    const addNewAsset = async (asset) => {
        const newAssets = [...assets, asset];
        await saveAssets(newAssets);
    };

    const updateAsset = async (updatedAsset) => {
        const newAssets = assets.map(asset => 
            asset.id === updatedAsset.id ? updatedAsset : asset
        );
        await saveAssets(newAssets);
    };

    const removeAsset = async (assetId) => {
        const newAssets = assets.filter(asset => asset.id !== assetId);
        await saveAssets(newAssets);
    };

    const addNewLocation = async (location) => {
        const newLocations = [...locations, location];
        await saveLocations(newLocations);
    };

    const updateLocation = async (updatedLocation) => {
        const newLocations = locations.map(location => 
            location.id === updatedLocation.id ? updatedLocation : location
        );
        await saveLocations(newLocations);
    };

    const removeLocation = async (locationId) => {
        const newLocations = locations.filter(location => location.id !== locationId);
        await saveLocations(newLocations);
    };

    return {
        assets,
        locations,
        addNewAsset,
        updateAsset,
        removeAsset,
        addNewLocation,
        updateLocation,
        removeLocation,
    };
};
