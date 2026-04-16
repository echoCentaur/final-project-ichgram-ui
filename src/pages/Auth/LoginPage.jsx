import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import axios from '../../api/axios'
import phonesImg from '../../assets/phones.png'
import bannerImg from '../../assets/banner.png'

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
        <div className="flex min-h-screen bg-gray-50 items-center justify-center px-4">
            <div className="flex items-center w-full max-w-3xl" style={{ gap: '40px' }}>

                {/* Картинка телефонов — слева */}
                <div className="hidden lg:block flex-1">
                    <img
                        src={phonesImg}
                        alt="ICHgram phones"
                        className="w-full object-contain"
                    />
                </div>

                {/* Форма — справа */}
                <div className="flex-shrink-0">
                    <div className="bg-white border border-gray-200 rounded mb-3"
                         style={{ padding: '32px 40px' }}>

                        <img src={bannerImg} alt="ICHgram" className="w-full mb-6 object-contain" />

                        <form onSubmit={handleSubmit} className="flex flex-col gap-2 items-center">
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                style={inputStyle}
                            />
                            <input
                                type="password"
                                placeholder="Passwort"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                style={inputStyle}
                            />
                            {error && <p className="text-red-500 text-xs text-center">{error}</p>}
                            <button
                                type="submit"
                                disabled={loading}
                                style={btnStyle}
                            >
                                {loading ? 'Logging up...' : 'Log In'}
                            </button>
                        </form>

                        <div className="flex items-center my-4" style={{ width: '268px' }}>
                            <div className="flex-1 border-t border-gray-300" />
                            <span className="px-4 text-xs text-gray-500 font-semibold">OR</span>
                            <div className="flex-1 border-t border-gray-300" />
                        </div>

                        <a href="https://ichgram.katzenkoenig.lol/api/auth/google"
                           className="flex items-center justify-center gap-2 text-blue-900 font-semibold text-sm hover:opacity-80 transition"
                           style={{ width: '268px' }}>
                            <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="" />
                            Log in an Google
                        </a>
                    </div>

                    <div className="bg-white border border-gray-200 rounded p-5 text-center text-sm"
                         style={{ width: '348px' }}>
                        Don't have an account?{' '}
                        <Link to="/register" className="text-blue-500 font-semibold hover:underline">
                            Sign up
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    )
}