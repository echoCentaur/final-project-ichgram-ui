import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import axios from '../../api/axios'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const { login } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const res = await axios.post('/auth/login', { email, password })
            login(res.data.user, res.data.token)
            navigate('/')
        } catch (err) {
            setError(err.response?.data?.message || 'Ошибка входа')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="w-full max-w-sm">

                <div className="bg-white border border-gray-200 rounded p-10 mb-3">
                    <h1 className="text-4xl font-bold text-center mb-8"
                        style={{ fontFamily: 'cursive' }}>
                        ICHgram
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-2">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
                        />
                        <input
                            type="password"
                            placeholder="Пароль"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
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
                            {loading ? 'Вход...' : 'Войти'}
                        </button>
                    </form>

                    {/* Разделитель */}
                    <div className="flex items-center my-4">
                        <div className="flex-1 border-t border-gray-300"></div>
                        <span className="px-4 text-gray-500 text-sm font-semibold">ИЛИ</span>
                        <div className="flex-1 border-t border-gray-300"></div>
                    </div>

                    {/* Кнопка Google */}

                    <a href="http://localhost:8008/api/auth/google"
                    className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded py-2 text-sm font-semibold hover:bg-gray-50"
                    >
                    <img
                        src="https://www.google.com/favicon.ico"
                        alt="Google"
                        className="w-4 h-4"
                    />
                    Войти через Google
                </a>
            </div>

            <div className="bg-white border border-gray-200 rounded p-5 text-center text-sm">
                Нет аккаунта?{' '}
                <Link to="/register" className="text-blue-500 font-semibold">
                    Зарегистрироваться
                </Link>
            </div>

        </div>
</div>
)
}