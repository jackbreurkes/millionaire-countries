import {AnyAction, combineReducers, configureStore, createStore} from "@reduxjs/toolkit";

/**
 * reducer for the threshold number between red and green on the map
 * @param state the new threshold (default is one million)
 * @param action
 */
function thresholdReducer(state: number = 1e6, action: AnyAction): number {
  switch (action.type) {
    case "SET_THRESHOLD": {
      return action.payload;
    }
    default:
      return state;
  }
}

function amountReducer(state: number | null = null, action: AnyAction): number | null {
  switch (action.type) {
    case "SET_AMOUNT": {
      return action.payload;
    }
    default:
      return state;
  }
}

function baseCurrencyReducer(state: string = "USD", action: AnyAction): string {
  switch (action.type) {
    case "SET_BASE_CURRENCY": {
      return action.payload;
    }
    default:
      return state;
  }
}

// if threshold becomes settable, will need to include the changing of word "millionaire"
// (perhaps making threshold an object, e.g. {value: 1e6, term: "millionaire"}?)
// will also need to update how the legend is made

export const setAmount = (amount: number | null) => ({
  type: "SET_AMOUNT",
  payload: amount,
});

export const setCurrency = (currency: string) => ({
  type: "SET_BASE_CURRENCY",
  payload: currency,
});

const store = configureStore({
  reducer: {
    threshold: thresholdReducer,
    amount: amountReducer,
    baseCurrency: baseCurrencyReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch

export default store;
