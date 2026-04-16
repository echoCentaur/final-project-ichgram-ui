import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Home, Search, PlusSquare, User, LogOut, Compass, Bot, X } from 'lucide-react'
import axios from '../../api/axios'
import bannerImg from '../../assets/banner.png'

export default function Sidebar() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const [searchOpen, setSearchOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [searchLoading, setSearchLoading] = useState(false)

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const isActive = (path) => location.pathname === path

    const handleSearch = async (q) => {
        setSearchQuery(q)
        if (!q.trim()) { setSearchResults([]); return }
        setSearchLoading(true)
        try {
            const res = await axios.get(`/search/users?q=${q}`)
            setSearchResults(Array.isArray(res.data) ? res.data : [])
        } catch (err) {
            console.error(err)
        } finally {
            setSearchLoading(false)
        }
    }

    const handleSearchClick = () => setSearchOpen(true)

    const handleSearchClose = () => {
        setSearchOpen(false)
        setSearchQuery('')
        setSearchResults([])
    }


    const isNarrow = searchOpen

    return (
        <>
            <div className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 flex flex-col p-4 z-20 transition-all duration-300
                w-16 md:${isNarrow ? 'w-20' : 'w-64'}`}>


                <Link to="/" className="mb-8 mt-2 px-1 block">
                    <img
                        src={bannerImg}
                        alt="ICHgram"
                        className={`object-contain hidden md:block ${isNarrow ? 'h-8' : 'h-10'}`}
                    />

                    <img
                        src={bannerImg}
                        alt="ICHgram"
                        className="object-contain block md:hidden h-6 w-6"
                    />
                </Link>


                <nav className="flex flex-col gap-1 flex-1">
                    <Link to="/"
                          className={`flex items-center gap-4 px-3 py-3 rounded-lg hover:bg-gray-50 ${isActive('/') ? 'font-bold' : ''}`}>
                        <Home size={24} className="flex-shrink-0" />
                        <span className={`text-sm hidden ${!isNarrow ? 'md:inline' : ''}`}>Home</span>
                    </Link>

                    <button
                        onClick={handleSearchClick}
                        className={`flex items-center gap-4 px-3 py-3 rounded-lg hover:bg-gray-50 w-full text-left ${searchOpen ? 'font-bold' : ''}`}>
                        <Search size={24} className="flex-shrink-0" />
                        <span className={`text-sm hidden ${!isNarrow ? 'md:inline' : ''}`}>Search</span>
                    </button>

                    <Link to="/explore"
                          className={`flex items-center gap-4 px-3 py-3 rounded-lg hover:bg-gray-50 ${isActive('/explore') ? 'font-bold' : ''}`}>
                        <Compass size={24} className="flex-shrink-0" />
                        <span className={`text-sm hidden ${!isNarrow ? 'md:inline' : ''}`}>Explore</span>
                    </Link>

                    <Link to="/ai"
                          className={`flex items-center gap-4 px-3 py-3 rounded-lg hover:bg-gray-50 ${isActive('/ai') ? 'font-bold' : ''}`}>
                        <Bot size={24} className="flex-shrink-0" />
                        <span className={`text-sm hidden ${!isNarrow ? 'md:inline' : ''}`}>AI Chat</span>
                    </Link>

                    <Link to="/create"
                          className={`flex items-center gap-4 px-3 py-3 rounded-lg hover:bg-gray-50 ${isActive('/create') ? 'font-bold' : ''}`}>
                        <PlusSquare size={24} className="flex-shrink-0" />
                        <span className={`text-sm hidden ${!isNarrow ? 'md:inline' : ''}`}>Create</span>
                    </Link>

                    <Link to={`/profile/${user?.id}`}
                          className={`flex items-center gap-4 px-3 py-3 rounded-lg hover:bg-gray-50 ${location.pathname.includes('/profile') ? 'font-bold' : ''}`}>
                        <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                            {user?.profile_image ? (
                                <img src={user.profile_image} alt="avatar" className="w-full h-full object-cover" />
                            ) : (
                                <User size={24} />
                            )}
                        </div>
                        <span className={`text-sm hidden ${!isNarrow ? 'md:inline' : ''}`}>Profile</span>
                    </Link>
                </nav>


                <button
                    onClick={handleLogout}
                    className="flex items-center gap-4 px-3 py-3 rounded-lg hover:bg-gray-50 text-left w-full mb-2">
                    <LogOut size={24} className="flex-shrink-0" />
                    <span className={`text-sm hidden ${!isNarrow ? 'md:inline' : ''}`}>Log out</span>
                </button>
            </div>


            {searchOpen && (
                <div className="fixed left-16 md:left-20 top-0 h-full w-72 md:w-80 bg-white border-r border-gray-200 z-10 shadow-lg">

                    <div className="flex items-center justify-between p-6 border-b border-gray-100">
                        <h2 className="text-xl font-bold">Search</h2>
                        <button onClick={handleSearchClose} className="text-gray-400 hover:text-gray-600">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="px-4 py-3">
                        <div className="relative">
                            <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={e => handleSearch(e.target.value)}
                                autoFocus
                                className="w-full bg-gray-100 rounded-lg pl-9 pr-4 py-2 text-sm outline-none"
                            />
                        </div>
                    </div>

                    <div className="overflow-y-auto">
                        {searchLoading && (
                            <p className="text-center text-gray-400 text-sm py-4">Searching...</p>
                        )}
                        {!searchLoading && searchQuery && searchResults.length === 0 && (
                            <p className="text-center text-gray-400 text-sm py-8">Not found</p>
                        )}
                        {!searchLoading && !searchQuery && (
                            <p className="text-center text-gray-400 text-sm py-8">Type name or username</p>
                        )}
                        {searchResults.map(u => (
                            <Link
                                key={u._id}
                                to={`/profile/${u._id}`}
                                onClick={handleSearchClose}
                                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition"
                            >
                                <div className="w-11 h-11 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                                    {u.profile_image ? (
                                        <img src={u.profile_image} className="w-full h-full object-cover" alt="" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-500 font-semibold">
                                            {u.username?.[0]?.toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold">{u.username}</p>
                                    {u.fullName && <p className="text-xs text-gray-500">{u.fullName}</p>}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </>
    )
}