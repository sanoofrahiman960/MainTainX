import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    workOrders: [],
    loading: false,
    error: null,
};

export const workOrderSlice = createSlice({
    name: 'workOrders',
    initialState,
    reducers: {
        addWorkOrders: (state, action) => {
            console.log("Redux - Adding work order:", action.payload);
            state.workOrders = [...state.workOrders, action.payload];
        },
        updateWorkOrder: (state, action) => {
            const index = state.workOrders.findIndex(wo => wo.id === action.payload.id);
            if (index !== -1) {
                state.workOrders = [...state.workOrders.slice(0, index), action.payload, ...state.workOrders.slice(index + 1)];
            }
        },
        deleteWorkOrder: (state, action) => {
            state.workOrders = state.workOrders.filter(wo => wo.id !== action.payload);
        },
        setWorkOrders: (state, action) => {
            state.workOrders = action.payload;
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
    addWorkOrder, 
    updateWorkOrder, 
    deleteWorkOrder, 
    setWorkOrders, 
    setLoading, 
    setError 
} = workOrderSlice.actions;

export default workOrderSlice.reducer;
