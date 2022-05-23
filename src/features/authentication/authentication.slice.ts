import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { IUser } from "../../entities/User/interfaces";
import {getToken, getUser, isAuthenticated} from "../../utils/authentication";

export interface AuthState {
    user: IUser | null;
    token: string | null;
    isLogged: boolean
}

const initialState: AuthState = {
    user: getUser(),
    token: getToken(),
    isLogged: isAuthenticated(),
}

const slice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, { payload: { user, token } }: PayloadAction<{ user: IUser; token: string }>) => {
            state.user = user;
            state.token = token;
            state.isLogged = true
        },
        logout: (state) => {
            state.user = null;
            state.token = "";
            state.isLogged = false
        },
    },
});

export const { login, logout } = slice.actions;

export default slice.reducer;
