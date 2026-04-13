import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import LoginPage from './pages/Auth/LoginPage'
import RegisterPage from './pages/Auth/RegisterPage'
import FeedPage from './pages/Feed/FeedPage'
import ProfilePage from './pages/Profile/ProfilePage'


const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth()

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-gray-500">Загрузка...</div>
        </div>
    )

    return user ? children : <Navigate to="/login" />
}


const PublicRoute = ({ children }) => {
    const { user, loading } = useAuth()

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-gray-500">Загрузка...</div>
        </div>
    )

    return !user ? children : <Navigate to="/" />
}

function AppRoutes() {
    return (
        <Routes>
            <Route path="/login" element={
                <PublicRoute><LoginPage /></PublicRoute>
            } />
            <Route path="/register" element={
                <PublicRoute><RegisterPage /></PublicRoute>
            } />
            <Route path="/" element={
                <PrivateRoute><FeedPage /></PrivateRoute>
            } />
            <Route path="/profile/:id" element={
                <PrivateRoute><ProfilePage /></PrivateRoute>
            } />
        </Routes>
    )
}

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </BrowserRouter>
    )
}

export default App
