// src/components/Layout.tsx
import Link from "next/link"
import { useContext } from "react"
import { AuthContext } from "context/AuthContext"

export default function Layout({ children }: { children: React.ReactNode }) {
    const { logout, userEmail } = useContext(AuthContext)
    return (
        <div className="min-h-screen flex flex-col">
            <header className="bg-blue-600 text-white px-4 py-2 flex justify-between items-center">
                <h1 className="text-xl font-bold">
                    <Link href="/">Agentic AI</Link>
                </h1>
                <nav className="space-x-4">
                    {userEmail ? (
                        <>
                            <span>{userEmail}</span>
                            <button onClick={logout} className="underline">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login">Login</Link>
                            <Link href="/signup">Sign Up</Link>
                        </>
                    )}
                </nav>
            </header>
            <main className="flex-1">{children}</main>
            <footer className="bg-gray-100 text-center p-4">
                &copy; {new Date().getFullYear()} Agentic AI
            </footer>
        </div>
    )
}
