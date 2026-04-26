import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import Loading from '../components/Loading'

const API_URL = import.meta.env.VITE_API_URL

const Register = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    const handleRegister = async (e) => {
        e.preventDefault()

        if (loading) return

        setLoading(true)

        try {
            const { data } = await axios.post(
                `${API_URL}/api/auth/register`,
                {
                    name,
                    email,
                    password
                }
            )

            toast.success(data.message || "Account created successfully")

            setTimeout(() => {
                navigate('/login')
            }, 1200)

        } catch (err) {
            toast.error(err.response?.data?.message || 'Register failed')
        } finally {
            setLoading(false)
        }
    }

    // ✅ SAME LOADING STYLE AS LOGIN
    if (loading) {
        return <Loading />
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-6">

            <form onSubmit={handleRegister} className="w-full max-w-md border p-8 rounded-xl">
                <h1 className="text-2xl font-semibold mb-6">Create Account</h1>

                <input
                    type="text"
                    placeholder="Name"
                    className="w-full border p-3 mb-4"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />

                <input
                    type="email"
                    placeholder="Email"
                    className="w-full border p-3 mb-4"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    className="w-full border p-3 mb-6"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button className="w-full bg-black text-white py-3 mb-4">
                    Register
                </button>

                <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="underline">
                        Login
                    </Link>
                </p>
            </form>

        </div>
    )
}

export default Register