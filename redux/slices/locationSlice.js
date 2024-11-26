import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  locations: [],
  loading: false,
  error: null,
};

export const locationSlice = createSlice({
  name: 'locations',
  initialState,
  reducers: {
    addLocation: (state, action) => {
      state.locations.push(action.payload);
    },
    updateLocation: (state, action) => {
      const index = state.locations.findIndex(location => location.id === action.payload.id);
      if (index !== -1) {
        state.locations[index] = action.payload;
      }
    },
    deleteLocation: (state, action) => {
      state.locations = state.locations.filter(location => location.id !== action.payload);
    },
    setLocations: (state, action) => {
      state.locations = action.payload;
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
  addLocation, 
  updateLocation, 
  deleteLocation, 
  setLocations, 
  setLoading, 
  setError 
} = locationSlice.actions;

export default locationSlice.reducer;
