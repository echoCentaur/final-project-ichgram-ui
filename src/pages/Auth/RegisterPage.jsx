import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import axios from '../../api/axios'

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

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="w-full max-w-sm">

                <div className="bg-white border border-gray-200 rounded p-10 mb-3">
                    <h1 className="text-4xl font-bold text-center mb-2"
                        style={{ fontFamily: 'cursive' }}>
                        ICHgram
                    </h1>
                    <p className="text-gray-500 text-center text-sm font-semibold mb-6">
                        Регистрируйся, чтобы видеть фото друзей
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-2">
                        <input
                            name="email"
                            type="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
                        />
                        <input
                            name="fullName"
                            type="text"
                            placeholder="Полное имя"
                            value={form.fullName}
                            onChange={handleChange}
                            className="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
                        />
                        <input
                            name="username"
                            type="text"
                            placeholder="Имя пользователя"
                            value={form.username}
                            onChange={handleChange}
                            className="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
                        />
                        <input
                            name="password"
                            type="password"
                            placeholder="Пароль"
                            value={form.password}
                            onChange={handleChange}
                            className="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
                        />

                        {error && (
                            <p className="text-red-500 text-xs text-center">{error}</p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded py-2 text-sm mt-2 disabled:opacity-50"
                        >
                            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
                        </button>
                    </form>
                </div>

                <div className="bg-white border border-gray-200 rounded p-5 text-center text-sm">
                    Уже есть аккаунт?{' '}
                    <Link to="/login" className="text-blue-500 font-semibold">
                        Войти
                    </Link>
                </div>

            </div>
        </div>
    )
}