import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import axios from '../../api/axios'

export default function GoogleSuccessPage() {
    const navigate = useNavigate()
    const { login } = useAuth()

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const token = params.get('token')

        if (token) {
            localStorage.setItem('token', token)

            axios.get('/users/me', {
                headers: { Authorization: `Bearer ${token}` }
            }).then(res => {
                login(res.data, token)
                navigate('/')
            }).catch(() => {
                navigate('/login')
            })
        } else {
            navigate('/login')
        }
    }, [])

    return (
        <div className="flex items-center justify-center min-h-screen">
            <p className="text-gray-500">Входим через Google...</p>
        </div>
    )
}