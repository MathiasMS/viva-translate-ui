import { serviceSlice } from "../../app/serviceSlice";
import { IUser } from "../../entities/User/interfaces";

export interface ILoginRequest {
    username: string;
    password: string;
}

export interface ILoginResponseSuccess {
    user: IUser;
    token: string;
}

const AUTHENTICATION_BASE_URL = 'authentication';

const extendedApiSlice = serviceSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<ILoginResponseSuccess, ILoginRequest>({
            query: (credentials) => ({
                url: `${AUTHENTICATION_BASE_URL}/login`,
                method: "POST",
                body: credentials,
            }),
        }),
        register: builder.mutation<ILoginResponseSuccess, ILoginRequest>({
            query: (credentials) => ({
                url: `${AUTHENTICATION_BASE_URL}/signup`,
                method: "POST",
                body: credentials,
            }),
        }),
    }),
});

export const { useLoginMutation, useRegisterMutation } = extendedApiSlice;
