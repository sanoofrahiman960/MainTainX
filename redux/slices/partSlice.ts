import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Part {
  id: string;
  name: string;
  image?: string;
  description?: string;
  unitsInStock: number;
  minimumStock: number;
  unitCost: number;
  barcode?: string;
  partType?: string;
  location?: string;
  area?: string;
  assets: string[];
  teams: string[];
  vendors: string[];
  files: any[];
  createdAt: number;
  updatedAt: number;
}

interface PartState {
  parts: Part[];
  selectedParts: string[];
  loading: boolean;
  error: string | null;
}

const initialState: PartState = {
  parts: [],
  selectedParts: [],
  loading: false,
  error: null,
};

const partSlice = createSlice({
  name: 'part',
  initialState,
  reducers: {
    addPart: (state, action: PayloadAction<Part>) => {
      state.parts.push(action.payload);
    },
    updatePart: (state, action: PayloadAction<Part>) => {
      const index = state.parts.findIndex(part => part.id === action.payload.id);
      if (index !== -1) {
        state.parts[index] = action.payload;
      }
    },
    deletePart: (state, action: PayloadAction<string>) => {
      state.parts = state.parts.filter(part => part.id !== action.payload);
    },
    selectPart: (state, action: PayloadAction<string>) => {
      if (!state.selectedParts.includes(action.payload)) {
        state.selectedParts.push(action.payload);
      }
    },
    unselectPart: (state, action: PayloadAction<string>) => {
      state.selectedParts = state.selectedParts.filter(id => id !== action.payload);
    },
    clearSelectedParts: (state) => {
      state.selectedParts = [];
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  addPart,
  updatePart,
  deletePart,
  selectPart,
  unselectPart,
  clearSelectedParts,
  setLoading,
  setError,
} = partSlice.actions;

export default partSlice.reducer;
