import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Home, Search, PlusSquare, User, LogOut, Compass, Bot } from 'lucide-react'

export default function Sidebar() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const isActive = (path) => location.pathname === path

    return (
        <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 flex flex-col p-4 z-10">

            {/* Логотип */}
            <Link to="/" className="text-2xl font-bold mb-8 mt-4 px-3"
                  style={{ fontFamily: 'cursive' }}>
                ICHgram
            </Link>

            {/* Навигация */}
            <nav className="flex flex-col gap-1 flex-1">
                <Link to="/"
                      className={`flex items-center gap-4 px-3 py-3 rounded-lg hover:bg-gray-50 ${
                          isActive('/') ? 'font-bold' : ''
                      }`}>
                    <Home size={24} />
                    <span className="text-sm">Главная</span>
                </Link>

                <Link to="/search"
                      className={`flex items-center gap-4 px-3 py-3 rounded-lg hover:bg-gray-50 ${
                          isActive('/search') ? 'font-bold' : ''
                      }`}>
                    <Search size={24} />
                    <span className="text-sm">Поиск</span>
                </Link>

                <Link to="/explore"
                      className={`flex items-center gap-4 px-3 py-3 rounded-lg hover:bg-gray-50 ${
                          isActive('/explore') ? 'font-bold' : ''
                      }`}>
                    <Compass size={24} />
                    <span className="text-sm">Explore</span>
                </Link>

                <Link to="/ai"
                      className={`flex items-center gap-4 px-3 py-3 rounded-lg hover:bg-gray-50 ${
                          isActive('/ai') ? 'font-bold' : ''
                      }`}>
                    <Bot size={24} />
                    <span className="text-sm">AI Чат</span>
                </Link>

                <Link to="/create"
                      className={`flex items-center gap-4 px-3 py-3 rounded-lg hover:bg-gray-50 ${
                          isActive('/create') ? 'font-bold' : ''
                      }`}>
                    <PlusSquare size={24} />
                    <span className="text-sm">Создать</span>
                </Link>

                <Link to={`/profile/${user?.id}`}
                      className={`flex items-center gap-4 px-3 py-3 rounded-lg hover:bg-gray-50 ${
                          location.pathname.includes('/profile') ? 'font-bold' : ''
                      }`}>
                    <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden">
                        {user?.profile_image ? (
                            <img src={user.profile_image} alt="avatar"
                                 className="w-full h-full object-cover" />
                        ) : (
                            <User size={24} />
                        )}
                    </div>
                    <span className="text-sm">Профиль</span>
                </Link>
            </nav>

            {/* Выход */}
            <button
                onClick={handleLogout}
                className="flex items-center gap-4 px-3 py-3 rounded-lg hover:bg-gray-50 text-left w-full mb-4"
            >
                <LogOut size={24} />
                <span className="text-sm">Выйти</span>
            </button>
        </div>
    )
}