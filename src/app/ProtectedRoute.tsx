import React, {FC, ReactElement} from 'react'
import {useSelector} from "react-redux";
import {RootState} from "./store";
import { Navigate } from "react-router-dom";

interface IProtectedRouteProps {
    children: ReactElement;
}

// Protected Routes if the user is not logged, redirect they to Login page
const ProtectedRoute: FC<IProtectedRouteProps> = ({ children }) => {
    const { isLogged } = useSelector((state: RootState) => state.authentication);

    if (!isLogged) return <Navigate to="/login" />;

    return children
}

export default ProtectedRoute
