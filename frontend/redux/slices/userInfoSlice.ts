'use client'

import { UserState } from "@/interfaces/auth.interface"
import { GetUserInfo } from "@/services/auth.service"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

export const GetNSetUserInfo = createAsyncThunk('/userInfo/GetNSetUserInfo', async () => {
    const resData = await GetUserInfo()
    return resData
})

export const userInfoSlice = createSlice({
    name: 'userInfo',
    initialState: {
        userInfo: null,
        loading: false,
        error: null as string | null,
    } as UserState,
    reducers: {
        setNullInfo: (state) => {
            state.userInfo = null
        }
    },
    extraReducers: (builder) => {
        // get info của user và sử lí state
        builder.addCase(GetNSetUserInfo.pending, (state) => {
            state.loading = true
            state.error = null
        })
        builder.addCase(GetNSetUserInfo.fulfilled, (state, action) => {
            state.loading = false
            state.userInfo = action.payload
        })
        builder.addCase(GetNSetUserInfo.rejected, (state, action) => {
            state.loading = false
            state.error = action.error.message ?? null
        })
    }
})



export const { setNullInfo } = userInfoSlice.actions
export default userInfoSlice.reducer    