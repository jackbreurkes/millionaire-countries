import { combineReducers, createStore } from "@reduxjs/toolkit";

function amountReducer(state: number = 5000, action: any): number {
  switch (action.type) {
    case "SET_AMOUNT": {
      return action.payload;
    }
    default:
      return state;
  }
}

function baseCurrencyReducer(state: string = "USD", action: any): string {
  switch (action.type) {
    case "SET_BASE_CURRENCY": {
      return action.payload;
    }
    default:
      return state;
  }
}

export const setAmount = (amount: number) => ({
  type: "SET_AMOUNT",
  payload: amount,
});

export const setCurrency = (currency: string) => ({
  type: "SET_BASE_CURRENCY",
  payload: currency,
});

export default createStore(
  combineReducers({ amount: amountReducer, baseCurrency: baseCurrencyReducer })
);
