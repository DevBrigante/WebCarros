import { createContext, ReactNode, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../services/firebaseConnection'

interface Childrenprops {
    children: ReactNode;
}

type AuthContextData = {
    signed: boolean;
    loadingAuth: boolean;
    handleInfoUser: ({ name, email, uid }: UserProps) => void;
    user: UserProps | null;
}

interface UserProps {
    uid: string;
    email: string | null;
    name: string | null;
}

export const AuthContext = createContext({} as AuthContextData) //eslint-disable-line

const AuthProvider = ({ children }: Childrenprops) => {

    const [user, setUser] = useState<UserProps | null>(null); // Informando que começamos sem nenhum usuário logado
    const [loadingAuth, setLoadingAuth] = useState<boolean>(true) // Carregando até verificar se tem usuário logado ou não

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser({
                    uid: user.uid,
                    name: user.displayName,
                    email: user.email
                })

            } else {
                setUser(null);
            }

            setLoadingAuth(false);
        })

        return () => unsub && unsub(); // Verificando para não retornar undefined 

    }, [])

    const handleInfoUser = ({ name, email, uid }: UserProps) => {
        setUser({
            name,
            email,
            uid
        })
    }

    return (
        <AuthContext.Provider value={{ signed: !!user, loadingAuth, handleInfoUser, user }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider