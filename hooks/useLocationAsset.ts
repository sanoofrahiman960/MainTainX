import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import {
  addLocation,
  updateLocation,
  deleteLocation,
  selectLocation,
  clearSelectedLocation,
} from '../redux/slices/locationSlice';
import {
  addAsset,
  updateAsset,
  deleteAsset,
  selectAsset,
  clearSelectedAsset,
  updateAssetLocation,
} from '../redux/slices/assetSlice';

export const useLocationAsset = () => {
  const dispatch = useDispatch();
  const locations = useSelector((state: RootState) => state.location.locations);
  const selectedLocation = useSelector((state: RootState) => state.location.selectedLocation);
  const assets = useSelector((state: RootState) => state.asset.assets);
  const selectedAsset = useSelector((state: RootState) => state.asset.selectedAsset);
  const loading = useSelector((state: RootState) => state.asset.loading);
  const error = useSelector((state: RootState) => state.asset.error);

  // Location actions
  const addNewLocation = (location: any) => dispatch(addLocation(location));
  const updateExistingLocation = (location: any) => dispatch(updateLocation(location));
  const removeLocation = (locationId: string) => dispatch(deleteLocation(locationId));
  const setSelectedLocation = (locationId: string) => dispatch(selectLocation(locationId));
  const clearLocationSelection = () => dispatch(clearSelectedLocation());

  // Asset actions
  const addNewAsset = (asset: any) => dispatch(addAsset(asset));
  const updateExistingAsset = (asset: any) => dispatch(updateAsset(asset));
  const removeAsset = (assetId: string) => dispatch(deleteAsset(assetId));
  const setSelectedAsset = (assetId: string) => dispatch(selectAsset(assetId));
  const clearAssetSelection = () => dispatch(clearSelectedAsset());
  const assignAssetToLocation = (assetId: string, locationId: string) =>
    dispatch(updateAssetLocation({ assetId, locationId }));

  // Filtered assets by location
  const getAssetsByLocation = (locationId: string) => {
    return assets.filter(asset => asset.locationId === locationId);
  };

  return {
    // State
    locations,
    selectedLocation,
    assets,
    selectedAsset,
    loading,
    error,

    // Location actions
    addNewLocation,
    updateExistingLocation,
    removeLocation,
    setSelectedLocation,
    clearLocationSelection,

    // Asset actions
    addNewAsset,
    updateExistingAsset,
    removeAsset,
    setSelectedAsset,
    clearAssetSelection,
    assignAssetToLocation,
    getAssetsByLocation,
  };
};
