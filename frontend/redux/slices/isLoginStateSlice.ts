'use client'

import { createSlice } from "@reduxjs/toolkit"

const isLoginState = createSlice({
    name: 'isLogin',
    initialState: {
        isLogin: false
    },
    reducers: {
        setLogged: (state) => {
            state.isLogin = true
        },
        removeLog: (state) => {
            state.isLogin = false
        }
    }
})

export const { setLogged, removeLog } = isLoginState.actions

export default isLoginState.reducer