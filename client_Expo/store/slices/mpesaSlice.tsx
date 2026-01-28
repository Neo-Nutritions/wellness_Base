 import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/services/api";

export interface MpesaResponse {
  Body: {
    stkCallback: {
      CheckoutRequestID: string;
      ResultCode: number;
    };
    };
}

interface MpesaState {
  response: MpesaResponse | null;
  loading: boolean;
  error: string | null;
}
const initialState: MpesaState = {
    response: null,
    loading: false,
    error: null,
};

export const processMpesaResponse = createAsyncThunk(
    "mpesa/processMpesaResponse",
    async (mpesaData: MpesaResponse, { rejectWithValue }) => {
        try {
            const response = await api.post("/payments/mpesa/callback/", mpesaData);
            return response.data;
        } catch (err: any) {
            return rejectWithValue(
                err.response?.data?.detail || "Failed to process Mpesa response"
            );
        }
    }
);
const mpesaSlice = createSlice({
    name: "mpesa",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(processMpesaResponse.pending, (state) => {
                state.loading = true;
            })
            .addCase(processMpesaResponse.fulfilled, (state, action) => {
                state.response = action.payload;
                state.loading = false;
            })
            .addCase(processMpesaResponse.rejected, (state, action) => {
                state.error = action.payload as string | null;
            });
    },
});
export default mpesaSlice.reducer;