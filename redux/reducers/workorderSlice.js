import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const createWorkOrder = createAsyncThunk(
  'workOrders/create',
  async (workOrder, { rejectWithValue }) => {
    try {
      // In a real app, you would make an API call here
      // For this example, we'll just simulate a successful creation
      return { ...workOrder, id: Date.now().toString() };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const workOrderSlice = createSlice({
  name: 'workOrders',
  initialState: {
    workOrders: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createWorkOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createWorkOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.workOrders.push(action.payload);
      })
      .addCase(createWorkOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default workOrderSlice.reducer;
