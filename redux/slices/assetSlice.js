import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  assets: [],
  loading: false,
  error: null,
};

export const assetSlice = createSlice({
  name: 'assets',
  initialState,
  reducers: {
    addAsset: (state, action) => {
      state.assets.push(action.payload);
    },
    updateAsset: (state, action) => {
      const index = state.assets.findIndex(asset => asset.id === action.payload.id);
      if (index !== -1) {
        state.assets[index] = action.payload;
      }
    },
    deleteAsset: (state, action) => {
      state.assets = state.assets.filter(asset => asset.id !== action.payload);
    },
    setAssets: (state, action) => {
      state.assets = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { 
  addAsset, 
  updateAsset, 
  deleteAsset, 
  setAssets, 
  setLoading, 
  setError 
} = assetSlice.actions;

export default assetSlice.reducer;
