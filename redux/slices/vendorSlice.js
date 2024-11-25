import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    vendors: [],
    selectedVendors: [],
    loading: false,
    error: null
};

const vendorSlice = createSlice({
    name: 'vendor',
    initialState,
    reducers: {
        addVendor: (state, action) => {
            state.vendors.push(action.payload);
        },
        updateVendor: (state, action) => {
            const index = state.vendors.findIndex(vendor => vendor.id === action.payload.id);
            if (index !== -1) {
                state.vendors[index] = action.payload;
            }
        },
        deleteVendor: (state, action) => {
            state.vendors = state.vendors.filter(vendor => vendor.id !== action.payload);
        },
        selectVendor: (state, action) => {
            if (!state.selectedVendors.includes(action.payload)) {
                state.selectedVendors.push(action.payload);
            }
        },
        unselectVendor: (state, action) => {
            state.selectedVendors = state.selectedVendors.filter(id => id !== action.payload);
        },
        clearSelectedVendors: (state) => {
            state.selectedVendors = [];
        }
    }
});

export const {
    addVendor,
    updateVendor,
    deleteVendor,
    selectVendor,
    unselectVendor,
    clearSelectedVendors
} = vendorSlice.actions;

export default vendorSlice.reducer;
