import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Asset {
  id: string;
  name: string;
  description?: string;
  locationId?: string;
  type?: string;
  status?: 'active' | 'inactive' | 'maintenance';
  metadata?: Record<string, any>;
}

interface AssetState {
  assets: Asset[];
  selectedAsset: Asset | null;
  loading: boolean;
  error: string | null;
}

const initialState: AssetState = {
  assets: [],
  selectedAsset: null,
  loading: false,
  error: null,
};

const assetSlice = createSlice({
  name: 'asset',
  initialState,
  reducers: {
    addAsset: (state, action: PayloadAction<Asset>) => {
      state.assets.push(action.payload);
    },
    updateAsset: (state, action: PayloadAction<Asset>) => {
      const index = state.assets.findIndex(asset => asset.id === action.payload.id);
      if (index !== -1) {
        state.assets[index] = action.payload;
      }
    },
    deleteAsset: (state, action: PayloadAction<string>) => {
      state.assets = state.assets.filter(asset => asset.id !== action.payload);
      if (state.selectedAsset?.id === action.payload) {
        state.selectedAsset = null;
      }
    },
    selectAsset: (state, action: PayloadAction<string>) => {
      state.selectedAsset = state.assets.find(asset => asset.id === action.payload) || null;
    },
    clearSelectedAsset: (state) => {
      state.selectedAsset = null;
    },
    setAssetLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setAssetError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    updateAssetLocation: (state, action: PayloadAction<{ assetId: string; locationId: string }>) => {
      const asset = state.assets.find(a => a.id === action.payload.assetId);
      if (asset) {
        asset.locationId = action.payload.locationId;
      }
    },
  },
});

export const {
  addAsset,
  updateAsset,
  deleteAsset,
  selectAsset,
  clearSelectedAsset,
  setAssetLoading,
  setAssetError,
  updateAssetLocation,
} = assetSlice.actions;

export default assetSlice.reducer;
