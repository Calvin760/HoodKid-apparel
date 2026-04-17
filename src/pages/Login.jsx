import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      })

      const user = res.data.user
      const token = res.data.token

      // store correctly
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))

      // redirect based on role
      if (user.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/account')
      }

    } catch (err) {
      alert(err.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">

      <form onSubmit={handleLogin} className="w-full max-w-md border p-8 rounded-xl">
        <h1 className="text-2xl font-semibold mb-6">Login</h1>

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
          Login
        </button>

        <p className="text-sm text-gray-600">
          Don’t have an account? <Link to="/register" className="underline">Register</Link>
        </p>
      </form>

    </div>
  )
}

export default Login