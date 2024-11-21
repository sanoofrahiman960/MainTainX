import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  assets: [],
  locations: [
    { id: '1', name: 'Main Building', type: 'Building' },
    { id: '2', name: 'Production Floor', type: 'Area' },
    { id: '3', name: 'Warehouse A', type: 'Storage' },
    { id: '4', name: 'Maintenance Shop', type: 'Workshop' },
    { id: '5', name: 'Assembly Line 1', type: 'Production' },
  ],
  assetTypes: [
    { id: '1', name: 'Machinery', category: 'Equipment' },
    { id: '2', name: 'Electronics', category: 'Equipment' },
    { id: '3', name: 'Vehicles', category: 'Transport' },
    { id: '4', name: 'Tools', category: 'Equipment' },
    { id: '5', name: 'Infrastructure', category: 'Facility' },
  ],
  parts: [
    { id: '1', name: 'Motor', category: 'Mechanical', quantity: 5 },
    { id: '2', name: 'Circuit Board', category: 'Electronic', quantity: 10 },
    { id: '3', name: 'Belt', category: 'Mechanical', quantity: 15 },
    { id: '4', name: 'Filter', category: 'Consumable', quantity: 20 },
    { id: '5', name: 'Sensor', category: 'Electronic', quantity: 8 },
  ],
};

const assetSlice = createSlice({
  name: 'assets',
  initialState,
  reducers: {
    addAsset: (state, action) => {
      state.assets.push(action.payload);
    },
    addLocation: (state, action) => {
      const newLocation = {
        id: (state.locations.length + 1).toString(),
        ...action.payload,
      };
      state.locations.push(newLocation);
    },
    addAssetType: (state, action) => {
      const newAssetType = {
        id: (state.assetTypes.length + 1).toString(),
        ...action.payload,
      };
      state.assetTypes.push(newAssetType);
    },
    addPart: (state, action) => {
      const newPart = {
        id: (state.parts.length + 1).toString(),
        ...action.payload,
      };
      state.parts.push(newPart);
    },
  },
});

export const { addAsset, addLocation, addAssetType, addPart } = assetSlice.actions;
export default assetSlice.reducer;