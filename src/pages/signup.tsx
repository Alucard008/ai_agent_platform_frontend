// src/pages/signup.tsx
import { useState, useContext, FormEvent } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import { AuthContext } from "context/AuthContext"

export default function SignupPage() {
    const router = useRouter()
    const { signup } = useContext(AuthContext)
    const [email, setEmail] = useState("")
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setError(null)
        if (!email || !name || !password) {
            setError("All fields are required.")
            return
        }
        setLoading(true)
        try {
            await signup(email, name, password)
            router.push("/")
        } catch (err: any) {
            setError(err.message || "Signup failed")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full bg-white p-8 shadow-lg rounded-lg">
                <h1 className="text-2xl font-bold mb-6 text-center">
                    Create Your Account
                </h1>
                {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-1">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            className="input input-bordered w-full"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-1">
                            Full Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            className="input input-bordered w-full"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={loading}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium mb-1">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            className="input input-bordered w-full"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className={`btn w-full ${loading ? "btn-disabled" : "btn-primary"}`}
                        disabled={loading}
                    >
                        {loading ? "Signing up…" : "Sign up"}
                    </button>
                </form>
                <p className="mt-4 text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link href="/login" className="text-blue-600 hover:underline">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    )
}
