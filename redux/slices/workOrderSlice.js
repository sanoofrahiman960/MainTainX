import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    workOrders: [],
    workOrderViews: [],
    currentView: null,
    loading: false,
    error: null,
};

export const workOrderSlice = createSlice({
    name: 'workOrders',
    initialState,
    reducers: {
        addWorkOrder: (state, action) => {
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
        // New actions for workorder views
        addWorkOrderView: (state, action) => {
            state.workOrderViews = [...state.workOrderViews, action.payload];
        },
        updateWorkOrderView: (state, action) => {
            const index = state.workOrderViews.findIndex(view => view.id === action.payload.id);
            if (index !== -1) {
                state.workOrderViews = [...state.workOrderViews.slice(0, index), action.payload, ...state.workOrderViews.slice(index + 1)];
            }
        },
        deleteWorkOrderView: (state, action) => {
            state.workOrderViews = state.workOrderViews.filter(view => view.id !== action.payload);
        },
        setWorkOrderViews: (state, action) => {
            state.workOrderViews = action.payload;
        },
        setCurrentView: (state, action) => {
            state.currentView = action.payload;
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
    addWorkOrderView,
    updateWorkOrderView,
    deleteWorkOrderView,
    setWorkOrderViews,
    setCurrentView, 
    setLoading, 
    setError 
} = workOrderSlice.actions;

export default workOrderSlice.reducer;
