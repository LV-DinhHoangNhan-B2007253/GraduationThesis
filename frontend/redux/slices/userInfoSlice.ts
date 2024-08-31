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
        error: null as string | null
    } as UserState,
    reducers: {},
    extraReducers: (builder) => {
        // get info của user và sử lí state
        builder.addCase(GetNSetUserInfo.pending, (state, action) => {
            state.loading = false
        })
        builder.addCase(GetNSetUserInfo.fulfilled, (state, action) => {
            state.loading = true
            state.userInfo = action.payload
        })
        builder.addCase(GetNSetUserInfo.rejected, (state, action) => {
            state.loading = false
            state.error = action.error.message ?? null
        })
    }
})



export const { } = userInfoSlice.actions
export default userInfoSlice.reducer    