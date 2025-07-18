// src/context/AuthContext.tsx
import React, { createContext, useState, ReactNode, useEffect } from "react"
import Router from "next/router"
import { API_BASE } from "../utils/constants"

export interface AuthContextType {
    token: string | null
    userEmail: string | null
    setToken: (t: string | null) => void
    setUserEmail: (e: string | null) => void
    login: (email: string, password: string) => Promise<void>
    signup: (email: string, name: string, password: string) => Promise<void>
    logout: () => void
}

export const AuthContext = createContext<AuthContextType>({
    token: null,
    userEmail: null,
    setToken: () => { },
    setUserEmail: () => { },
    login: async () => { },
    signup: async () => { },
    logout: () => { },
})



export function AuthProvider({ children }: { children: ReactNode }) {
    const isBrowser = typeof window !== "undefined"

    // synchronously bootstrap from localStorage
    const [tok, _setTok] = useState<string | null>(
        () => (isBrowser ? localStorage.getItem("token") : null)
    )
    const [email, _setEmail] = useState<string | null>(
        () => (isBrowser ? localStorage.getItem("userEmail") : null)
    )

    const persist = (newTok: string | null, newEmail: string | null) => {
        if (newTok) {
            localStorage.setItem("token", newTok)
            _setTok(newTok)
        } else {
            localStorage.removeItem("token")
            _setTok(null)
        }
        if (newEmail) {
            localStorage.setItem("userEmail", newEmail)
            _setEmail(newEmail)
        } else {
            localStorage.removeItem("userEmail")
            _setEmail(null)
        }
    }

    const setToken = (t: string | null) => persist(t, email)
    const setUserEmail = (e: string | null) => persist(tok, e)

    const login = async (email: string, password: string) => {
        const res = await fetch(`${API_BASE}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        })
        if (!res.ok) throw new Error(await res.text() || "Login failed")
        const { access_token } = await res.json()
        persist(access_token, email)
        Router.push("/")
    }

    const signup = async (email: string, name: string, password: string) => {
        const res = await fetch(`${API_BASE}/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, name, password }),
        })
        if (!res.ok) throw new Error(await res.text() || "Signup failed")
        const { access_token } = await res.json()
        persist(access_token, email)
        Router.push("/")
    }

    const logout = () => {
        persist(null, null)
        Router.push("/login")
    }

    useEffect(() => {
        const savedToken = localStorage.getItem("token")
        const savedEmail = localStorage.getItem("userEmail")
        console.debug("AuthProvider loaded from LS:", { savedToken, savedEmail })
        if (savedToken) _setTok(savedToken)
        if (savedEmail) _setEmail(savedEmail)
    }, [])

    return (
        <AuthContext.Provider
            value={{
                token: tok,
                userEmail: email,
                setToken,
                setUserEmail,
                login,
                signup,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}
