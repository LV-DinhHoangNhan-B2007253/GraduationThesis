"use client";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./store";
import { Provider } from "react-redux";

export interface IReduxProviderProps {
  children: React.ReactNode;
}

export default function ReduxProvider(props: IReduxProviderProps) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {props.children}
      </PersistGate>
    </Provider>
  );
}
