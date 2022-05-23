import {AuthState} from "../features/authentication/authentication.slice";
import {IUser} from "../entities/User/interfaces";

const TOKEN_NAME = "viva-translate:auth";

export const setAuthData = (authState: AuthState) => {
    localStorage.setItem(TOKEN_NAME, JSON.stringify(authState));
}

export const removeAuthData = () => {
    return localStorage.removeItem(TOKEN_NAME)
};

const getAuthData: () => AuthState | null = () => {
    const authData: any = JSON.parse(<string>localStorage.getItem(TOKEN_NAME))

    if(authData) {
        const state: AuthState = {
            user: {
                _id: authData.user.id,
                username: authData.user.username,
            },
            isLogged: authData.isLogged,
            token: authData.token
        }

        return state
    }
    return null
}

export const getToken = (): string => {
    const authData = getAuthData()

    if(authData && authData.token) {
        return authData.token
    }

    return ""
};

export const getUser = (): IUser | null => {
    const authData = getAuthData()

    if(authData && authData.user) {
        return authData.user
    }
    return null
};

export const isAuthenticated = (): boolean=> {
    return !!getAuthData()
}
