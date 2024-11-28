import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  assets: [ {
    id: 'new-asset-1',
    task: 'New Asset',
    description: 'This is a newly added asset',
    status: 'Active',
    location: 'Main Office',
    lastMaintenance: '2023-05-15',
    criticality: 'High',
  },
  {
    id: 'new-asset-2',
    task: 'Test Asset',
    description: 'This is a newly added asset',
    status: 'InActive',
    location: 'Main Office',
    lastMaintenance: '2023-05-15',
    criticality: 'low',
  },
  {
    id: 'new-asset-7',
    task: 'Asset 1',
    description: 'This is a newly added asset',
    status: 'critical',
    location: 'Main Office',
    lastMaintenance: '2023-05-15',
    criticality: 'critical',
  },
 
  {
    id: 'new-asset-3',
    task: 'Test Asset 1',
    description: 'This is a newly added asset',
    status: 'Active',
    location: 'Main Office',
    lastMaintenance: '2023-05-15',
    criticality: 'High',
  },],
  locations: [
    { id: '1', name: 'Main Building', type: 'Building' },
    { id: '2', name: 'Production Floor', type: 'Area' },
    { id: '3', name: 'Warehouse A', type: 'Storage' },
    { id: '4', name: 'Maintenance Shop', type: 'Workshop' },
    { id: '5', name: 'Assembly Line 2', type: 'Production' },
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
  vendors: [
    { id: '1', name: 'Test', category: 'Equipment' },
    { id: '2', name: 'Test 1', category: 'Equipment' },
    { id: '3', name: 'Tvst 2', category: 'Transport' },
    { id: '4', name: 'Test 3 ', category: 'Equipment' },
    { id: '5', name: 'Test 4', category: 'Facility' },
  ],
  category: [
    { 
      id: '1', 
      name: 'Damage', 
      icon: 'alert-circle-outline',
      color: '#FF4B4B',
      backgroundColor: '#FFE5E5'
    },
    { 
      id: '2', 
      name: 'Electrical', 
      icon: 'flash',
      color: '#FFB800',
      backgroundColor: '#FFF8E5'
    },
    { 
      id: '3', 
      name: 'Inspection', 
      icon: 'clipboard-text-outline',
      color: '#8B69FF',
      backgroundColor: '#F0EBFF'
    },
    { 
      id: '4', 
      name: 'Mechanical', 
      icon: 'wrench',
      color: '#FF69B4',
      backgroundColor: '#FFE5F4'
    },
    { 
      id: '5', 
      name: 'Preventive', 
      icon: 'refresh',
      color: '#4CAF50',
      backgroundColor: '#E5FFE6'
    },
    { 
      id: '6', 
      name: 'Project', 
      icon: 'file-document-outline',
      color: '#FF8C42',
      backgroundColor: '#FFE5D9'
    },
    { 
      id: '7', 
      name: 'Refrigeration', 
      icon: 'snowflake',
      color: '#42C6FF',
      backgroundColor: '#E5F8FF'
    },
    { 
      id: '8', 
      name: 'Safety', 
      icon: 'shield-outline',
      color: '#00BFA5',
      backgroundColor: '#E5FFF9'
    },
    { 
      id: '9', 
      name: 'Standard Operating Procedure', 
      icon: 'file-check-outline',
      color: '#FF69B4',
      backgroundColor: '#FFE5F4'
    },
  ]

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