import { configureStore } from "@reduxjs/toolkit";
import userInfoReducer from './slices/userInfoSlice'
import isLoginStateReducer from "./slices/isLoginStateSlice";
import { persistStore, persistReducer } from 'redux-persist';
import storage from "redux-persist/lib/storage";


const userInfoPersistConfig = {
    key: 'userInfo',
    storage,
};

const userLoginStatePersistConfig = {
    key: 'userLoginState',
    storage,
};

// Áp dụng persist cho các reducers
const persistedUserInfoReducer = persistReducer(userInfoPersistConfig, userInfoReducer);

const persistedUserLoginState = persistReducer(userLoginStatePersistConfig, isLoginStateReducer);

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