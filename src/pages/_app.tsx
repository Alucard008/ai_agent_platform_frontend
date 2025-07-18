import "../styles/global.css"
import "react-flow-renderer/dist/style.css"
import "react-flow-renderer/dist/theme-default.css"

import type { AppProps } from "next/app"
import { useRouter } from "next/router"
import { useEffect, useState, useContext } from "react"

import { AuthProvider, AuthContext } from "context/AuthContext"
import { AgentProvider } from "context/AgentContext"
import Layout from "components/Layout"

const PUBLIC_PATHS = ["/login", "/signup", "/_error"]
function InnerApp({ Component, pageProps }: AppProps) {
    const { token } = useContext(AuthContext)
    const { pathname, push } = useRouter()
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
        if (!token && !PUBLIC_PATHS.includes(pathname)) {
            push("/login")
        }
    }, [token, pathname, push])

    if (!isMounted) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        )
    }

    return <Layout><Component {...pageProps} /></Layout>
}

export default function App(props: AppProps) {
    return (
        <AuthProvider>
            <AgentProvider>
                <InnerApp {...props} />
            </AgentProvider>
        </AuthProvider>
    )
}