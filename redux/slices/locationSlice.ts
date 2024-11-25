import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Location {
  id: string;
  name: string;
  description?: string;
  parentId?: string | null;
}

interface LocationState {
  locations: Location[];
  selectedLocation: Location | null;
}

const initialState: LocationState = {
  locations: [],
  selectedLocation: null,
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    addLocation: (state, action: PayloadAction<Location>) => {
      state.locations.push(action.payload);
    },
    updateLocation: (state, action: PayloadAction<Location>) => {
      const index = state.locations.findIndex(loc => loc.id === action.payload.id);
      if (index !== -1) {
        state.locations[index] = action.payload;
      }
    },
    deleteLocation: (state, action: PayloadAction<string>) => {
      state.locations = state.locations.filter(loc => loc.id !== action.payload);
      if (state.selectedLocation?.id === action.payload) {
        state.selectedLocation = null;
      }
    },
    selectLocation: (state, action: PayloadAction<string>) => {
      state.selectedLocation = state.locations.find(loc => loc.id === action.payload) || null;
    },
    clearSelectedLocation: (state) => {
      state.selectedLocation = null;
    },
  },
});

export const {
  addLocation,
  updateLocation,
  deleteLocation,
  selectLocation,
  clearSelectedLocation,
} = locationSlice.actions;

export default locationSlice.reducer;
