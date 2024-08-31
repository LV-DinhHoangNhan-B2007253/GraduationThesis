import { configureStore } from "@reduxjs/toolkit";
import userInfoReducer from './slices/userInfoSlice'
import isLoginStateReducer from "./slices/isLoginStateSlice";
import { persistStore, persistReducer } from 'redux-persist';
import storage from "redux-persist/lib/storage";


const persistConfig = {
    key: 'root',
    storage,
};

// Áp dụng persist cho các reducers
const persistedUserInfoReducer = persistReducer(persistConfig, userInfoReducer);

const persistedUserLoginState = persistReducer(persistConfig, isLoginStateReducer);

export const store = configureStore({
    reducer: {
        userLoginState: persistedUserLoginState,
        user: persistedUserInfoReducer,
    },
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store