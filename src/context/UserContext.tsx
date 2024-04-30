import { createContext, useEffect, useState } from "react";

interface IUser {
    given_name: String,
    account_number: Number
}

type UserContent = {
    user: IUser | null,
    isLoggedIn: Boolean,
}

type UserContextValues = {
    user: IUser | null,
    isLoggedIn: Boolean,
    TryLogIn: (email_address: String, password: String) => void,
    LogOut: () => void
}

const UserContext = createContext<UserContextValues | null>(null)

const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserContent>({ user: null, isLoggedIn: false })

    const saveUser = (isLoggedIn: Boolean, user: IUser | null) => {
        if (isLoggedIn && user) {
            setUser({
                user: {
                    given_name: user.given_name,
                    account_number: user.account_number
                }, isLoggedIn: true
            })
        }
        else {
            setUser({ user: null, isLoggedIn: false })
        }
    }

    const CheckLogIn = async () => {
        const response = await fetch("http://localhost:5050/session/check", {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        })
        const data = await response.json()
        saveUser(data.result, data.user)
    }

    useEffect(() => {
        CheckLogIn()
    }, [])

    const TryLogIn = async (email_address: String, password: String) => {
        const response = await fetch("http://localhost:5050/session/login", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email_address, password })
        })
        const data = await response.json()
        saveUser(data.result, data.user)
    }

    const LogOut = async () => {
        const response = await fetch("http://localhost:5050/session/logout", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            }
        })
        const data = await response.json()
        if (data.result)
            saveUser(false, null)
    }

    return (
        <UserContext.Provider value={{ user: user.user, isLoggedIn: user.isLoggedIn, TryLogIn: TryLogIn, LogOut: LogOut }}>
            {children}
        </UserContext.Provider>
    )
}


export { UserContext, UserProvider }
export type { UserContent, IUser, UserContextValues }