import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'

const Register = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    const handleRegister = async (e) => {
        e.preventDefault()

        try {
            await axios.post('http://localhost:5000/api/auth/register', {
                name,
                email,
                password
            })

            navigate('/login')

        } catch (err) {
            alert(err.response?.data?.message || 'Register failed')
        }
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
                    Already have an account? <Link to="/login" className="underline">Login</Link>
                </p>
            </form>

        </div>
    )
}

export default Register