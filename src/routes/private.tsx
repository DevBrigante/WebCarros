/* eslint-disable @typescript-eslint/no-explicit-any */

import { ReactNode, useContext } from "react";
import { AuthContext } from '../contexts/authContext'
import { Navigate } from "react-router-dom";

interface PrivateProps {
    children: ReactNode;
}

export const Private = ({ children }: PrivateProps): any => {

    const { signed, loadingAuth } = useContext(AuthContext);

    if (loadingAuth) {
        return <></>
    }

    if (!signed) {
        return <Navigate to="/login" />
    }

    return children;
}