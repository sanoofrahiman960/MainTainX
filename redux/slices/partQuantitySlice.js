import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    selectedParts: {},  // workOrderId -> array of parts with quantities
    loading: false,
    error: null
};

export const partQuantitySlice = createSlice({
    name: 'partQuantity',
    initialState,
    reducers: {
        addPartQuantity: (state, action) => {
            const { workOrderId, part } = action.payload;
            if (!state.selectedParts[workOrderId]) {
                state.selectedParts[workOrderId] = [];
            }
            state.selectedParts[workOrderId].push(part);
        },
        updatePartQuantity: (state, action) => {
            const { workOrderId, partId, quantity } = action.payload;
            const parts = state.selectedParts[workOrderId];
            if (parts) {
                const partIndex = parts.findIndex(p => p.id === partId);
                if (partIndex !== -1) {
                    parts[partIndex].needed_qty = quantity;
                }
            }
        },
        removePartQuantity: (state, action) => {
            const { workOrderId, partId } = action.payload;
            const parts = state.selectedParts[workOrderId];
            if (parts) {
                state.selectedParts[workOrderId] = parts.filter(p => p.id !== partId);
            }
        },
        clearPartQuantities: (state, action) => {
            const { workOrderId } = action.payload;
            state.selectedParts[workOrderId] = [];
        }
    }
});

export const {
    addPartQuantity,
    updatePartQuantity,
    removePartQuantity,
    clearPartQuantities
} = partQuantitySlice.actions;

export default partQuantitySlice.reducer;
