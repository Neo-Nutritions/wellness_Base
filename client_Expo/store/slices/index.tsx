import { configureStore } from "@reduxjs/toolkit";
import plansReducer from "./plansSlice";
import subscriptionReducer from "./subscriptionSlice";
import mpesaReducer from "./mpesaSlice";
export const store = configureStore({
  reducer: {
    plans: plansReducer,
    subscription: subscriptionReducer,
    mpesa: mpesaReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
