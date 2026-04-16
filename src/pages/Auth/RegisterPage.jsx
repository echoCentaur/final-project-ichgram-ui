import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import axios from '../../api/axios'
import bannerImg from '../../assets/banner.png'

export default function RegisterPage() {
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
        fullName: ''
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const { login } = useAuth()
    const navigate = useNavigate()

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            const res = await axios.post('/auth/register', form)
            login(res.data.user, res.data.token)
            navigate('/')
        } catch (err) {
            setError(err.response?.data?.message || 'Ошибка регистрации')
        } finally {
            setLoading(false)
        }
    }

    const inputStyle = {
        width: '268px',
        height: '32px',
        borderRadius: '4px',
        border: '1px solid #dbdbdb',
        background: '#fafafa',
        padding: '0 10px',
        fontSize: '13px',
        outline: 'none',
        boxSizing: 'border-box',
    }

    const btnStyle = {
        width: '268px',
        height: '32px',
        borderRadius: '8px',
        background: 'rgba(0, 149, 246, 1)',
        border: 'none',
        color: 'white',
        fontWeight: '600',
        fontSize: '14px',
        cursor: 'pointer',
        opacity: loading ? 0.5 : 1,
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="w-full max-w-sm">

                <div className="bg-white border border-gray-200 rounded mb-3"
                     style={{ padding: '32px 40px' }}>

                    <img src={bannerImg} alt="ICHgram" className="w-full mb-2 object-contain" />
                    <p className="text-gray-500 text-center text-sm font-semibold mb-6">
                        Sign up to see Photos and Videos from your friends
                    </p>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-2 items-center">
                        <input
                            name="email"
                            type="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={handleChange}
                            style={inputStyle}
                        />
                        <input
                            name="fullName"
                            type="text"
                            placeholder="Full Name"
                            value={form.fullName}
                            onChange={handleChange}
                            style={inputStyle}
                        />
                        <input
                            name="username"
                            type="text"
                            placeholder="User Name"
                            value={form.username}
                            onChange={handleChange}
                            style={inputStyle}
                        />
                        <input
                            name="password"
                            type="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={handleChange}
                            style={inputStyle}
                        />

                        {error && (
                            <p className="text-red-500 text-xs text-center">{error}</p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            style={btnStyle}
                        >
                            {loading ? 'Signing up...' : 'Sign up'}
                        </button>
                    </form>
                </div>

                <div className="bg-white border border-gray-200 rounded p-5 text-center text-sm">
                    Have an account?{' '}
                    <Link to="/login" className="text-blue-500 font-semibold hover:underline">
                        Sign Up
                    </Link>
                </div>
            </div>
        </div>
    )
}