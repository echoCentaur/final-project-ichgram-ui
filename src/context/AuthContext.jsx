import { createContext, useContext, useState, useEffect } from 'react'
import axios from '../api/axios'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    // Нормализует пользователя — добавляет поле id если есть только _id
    const normalizeUser = (userData) => {
        if (!userData) return null
        return {
            ...userData,
            id: userData.id || userData._id
        }
    }

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token) {
            axios.get('/users/me')
                .then(res => setUser(normalizeUser(res.data)))
                .catch(() => localStorage.removeItem('token'))
                .finally(() => setLoading(false))
        } else {
            setLoading(false)
        }
    }, [])

    const login = (userData, token) => {
        localStorage.setItem('token', token)
        setUser(normalizeUser(userData))
    }

    const logout = () => {
        localStorage.removeItem('token')
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)