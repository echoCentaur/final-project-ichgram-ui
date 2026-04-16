import { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from '../../api/axios'

export default function SearchPage() {
    const [query, setQuery] = useState('')
    const [users, setUsers] = useState([])
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(false)
    const [tab, setTab] = useState('users')

    const handleSearch = async (e) => {
        const value = e.target.value
        setQuery(value)

        if (!value.trim()) {
            setUsers([])
            return
        }

        setLoading(true)
        try {
            const res = await axios.get(`/search/users?q=${value}`)
            setUsers(res.data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const fetchExplore = async () => {
        setLoading(true)
        try {
            const res = await axios.get('/search/explore')
            setPosts(res.data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleTabChange = (newTab) => {
        setTab(newTab)
        if (newTab === 'explore' && posts.length === 0) {
            fetchExplore()
        }
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-lg mx-auto pt-6 pb-10 px-4">


                <div className="bg-white border border-gray-200 rounded mb-4 p-3">
                    <input
                        type="text"
                        placeholder="Поиск пользователей..."
                        value={query}
                        onChange={handleSearch}
                        className="w-full bg-gray-100 rounded-lg px-4 py-2 text-sm outline-none"
                    />
                </div>


                <div className="flex border-b border-gray-300 mb-4">
                    <button
                        onClick={() => handleTabChange('users')}
                        className={`flex-1 py-2 text-sm font-semibold ${
                            tab === 'users' ? 'border-b-2 border-black' : 'text-gray-400'
                        }`}
                    >
                        Люди
                    </button>
                    <button
                        onClick={() => handleTabChange('explore')}
                        className={`flex-1 py-2 text-sm font-semibold ${
                            tab === 'explore' ? 'border-b-2 border-black' : 'text-gray-400'
                        }`}
                    >
                        Explore
                    </button>
                </div>


                {tab === 'users' && (
                    <div>
                        {loading && (
                            <p className="text-center text-gray-500 text-sm">Поиск...</p>
                        )}

                        {!loading && query && users.length === 0 && (
                            <p className="text-center text-gray-500 text-sm">
                                Пользователи не найдены
                            </p>
                        )}

                        {users.map(user => (
                            <Link
                                key={user._id}
                                to={`/profile/${user._id}`}
                                className="flex items-center gap-3 bg-white border border-gray-200 rounded p-3 mb-2 hover:bg-gray-50"
                            >
                                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                                    {user.profile_image ? (
                                        <img src={user.profile_image} alt="avatar"
                                             className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
                                            {user.username?.[0]?.toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold">{user.username}</p>
                                    {user.fullName && (
                                        <p className="text-xs text-gray-500">{user.fullName}</p>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                )}


                {tab === 'explore' && (
                    <div>
                        {loading && (
                            <p className="text-center text-gray-500 text-sm">Загрузка...</p>
                        )}
                        <div className="grid grid-cols-3 gap-1">
                            {posts.map(post => (
                                <div key={post._id}
                                     className="aspect-square bg-gray-200 overflow-hidden cursor-pointer hover:opacity-90"
                                >
                                    {post.image ? (
                                        <img src={post.image} alt="post"
                                             className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs p-2 text-center">
                                            {post.text}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}