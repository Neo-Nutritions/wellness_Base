import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/services/api";

export interface Subscription {
    plan: string;
}

interface SubscriptionState {
    subscription: Subscription | null;
    loading: boolean;
    error: string | null;
}

const initialState: SubscriptionState = {
    subscription: null,
    loading: false,
    error: null,
};

export const subscribeToPlan = createAsyncThunk(
    "subscription/subscribeToPlan",
    async (planId: string, { rejectWithValue }) => {
        try {
            const response = await api.post("/subscriptions/subscribe/", { plan: planId });
            return response.data;
        } catch (err: any) {
            console.log(err)
            return rejectWithValue(
                err.response?.data?.detail || "Failed to subscribe to plan"
            );
        }   

    }
);

const subscriptionSlice = createSlice({
    name: "subscription",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(subscribeToPlan.pending, (state) => {
                state.loading = true;
            })
            .addCase(subscribeToPlan.fulfilled, (state, action) => {
                state.subscription = action.payload;
                state.loading = false;
            })
            .addCase(subscribeToPlan.rejected, (state, action) => {
                state.error = action.payload as string | null;
                state.loading = false;
            });
    },
});
export default subscriptionSlice.reducer;
