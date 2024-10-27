import { configureStore, } from "@reduxjs/toolkit";
import userInfoReducer from './slices/userInfoSlice'
import isLoginStateReducer from "./slices/isLoginStateSlice";
import { persistStore, persistReducer, FLUSH, REGISTER, REHYDRATE, PAUSE, PERSIST, PURGE } from 'redux-persist';
import sessionStorage from 'redux-persist/es/storage/session';



const userInfoPersistConfig = {
    key: 'userInfo',
    storage: sessionStorage
};

const userLoginStatePersistConfig = {
    key: 'userLoginState',
    storage: sessionStorage
};

// Áp dụng persist cho các reducers
const persistedUserInfoReducer = persistReducer(userInfoPersistConfig, userInfoReducer);

const persistedUserLoginState = persistReducer(userLoginStatePersistConfig, isLoginStateReducer);

export const store = configureStore({
    reducer: {
        userLoginState: persistedUserLoginState,
        user: persistedUserInfoReducer,

    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store