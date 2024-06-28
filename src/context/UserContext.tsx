import { checkAuth, login, logout } from "@/lib/server_service";
import { createContext, useEffect, useState } from "react";

interface IUser {
    given_name: String,
    family_name: String,
    account_number: Number
}

type UserContent = {
    user: IUser | null,
    isLoggedIn: Boolean,
    isAuthRequestEnd: Boolean,
}

type UserContextValues = {
    user: IUser | null,
    isLoggedIn: Boolean,
    isAuthRequestEnd: Boolean,
    TryLogIn: (email_address: String, password: String) => void,
    LogOut: () => void,
    saveUser: (isLoggedIn: Boolean, user: IUser | null) => void
}

const UserContext = createContext<UserContextValues | null>(null)

const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserContent>({ user: null, isLoggedIn: false, isAuthRequestEnd: false })

    const saveUser = (isLoggedIn: Boolean, user: IUser | null) => {
        if (isLoggedIn && user) {
            setUser({
                user: {
                    account_number: user.account_number,
                    given_name: user.given_name,
                    family_name: user.family_name,
                }, isLoggedIn: true, isAuthRequestEnd: true
            })
        }
        else {
            setUser({ user: null, isLoggedIn: false, isAuthRequestEnd: true })
        }
    }

    useEffect(() => {
        checkAuth().then((data) => {
            saveUser(data.result, data.user)
        })
    }, [])

    const tryLogin = async (email_address: String, password: String) => {
        login(email_address, password).then((data) => {
            saveUser(data.result, data.user)
        })
    }

    const tryLogout = async () => {
        logout().then(() => {
            saveUser(false, null)
        })
    }

    return (
        <UserContext.Provider value={{ user: user.user, isLoggedIn: user.isLoggedIn, isAuthRequestEnd: user.isAuthRequestEnd, TryLogIn: tryLogin, LogOut: tryLogout, saveUser: saveUser }}>
            {children}
        </UserContext.Provider>
    )
}


export { UserContext, UserProvider }
export type { UserContent, IUser, UserContextValues }