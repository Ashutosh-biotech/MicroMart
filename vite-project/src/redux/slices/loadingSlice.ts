import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface LoadingState {
  isLoading: boolean;
}

const initialState: LoadingState = {
  isLoading: false,
};

export const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
	Loading: (state: LoadingState) => {
	  state.isLoading = true;
	},
	Loaded: (state: LoadingState) => {
	  state.isLoading = false;
	},
	setLoading: (state: LoadingState, action: PayloadAction<boolean>) => {
	  state.isLoading = action.payload;
	},
  }
});

export const { setLoading } = loadingSlice.actions;
export default loadingSlice.reducer;