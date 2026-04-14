import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import axios from '../../api/axios'

export default function FeedPage() {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        fetchPosts()
    }, [])

    const fetchPosts = async () => {
        try {
            const res = await axios.get('/posts')
            setPosts(res.data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const handleLike = async (postId) => {
        try {
            await axios.post(`/likes/${postId}`)
            fetchPosts()
        } catch (err) {
            console.error(err)
        }
    }

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <p className="text-gray-500">Загрузка...</p>
        </div>
    )

    return (
        <div className="bg-gray-50 min-h-screen">

            {/* NAV */}
            <nav className="bg-white border-b border-gray-200 fixed top-0 w-full z-10">
                <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
                    <h1 className="text-2xl font-bold" style={{ fontFamily: 'cursive' }}>
                        ICHgram
                    </h1>
                    <div className="flex items-center gap-4">
                        <Link
                            to={`/profile/${user?.id}`}
                            className="text-sm font-semibold hover:text-gray-500"
                        >
                            {user?.username}
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="text-sm text-red-500 hover:text-red-600"
                        >
                            Выйти
                        </button>
                    </div>
                </div>
            </nav>

            {/* Content */}
            <div className="max-w-lg mx-auto pt-20 pb-10 px-4">

                {posts.length === 0 ? (
                    <div className="text-center text-gray-500 mt-10">
                        <p>Постов пока нет</p>
                        <p className="text-sm mt-2">Создайте первый пост!</p>
                    </div>
                ) : (
                    posts.map(post => (
                        <div key={post._id} className="bg-white border border-gray-200 rounded mb-4">

                            {/* post header */}
                            <div className="flex items-center p-3">
                                <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden mr-3">
                                    {post.author?.profile_image ? (
                                        <img
                                            src={post.author.profile_image}
                                            alt="avatar"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">
                                            {post.author?.username?.[0]?.toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <Link
                                    to={`/profile/${post.author?._id}`}
                                    className="text-sm font-semibold hover:underline"
                                >
                                    {post.author?.username}
                                </Link>
                            </div>

                            {/* Post photo */}
                            {post.image && (
                                <img
                                    src={post.image}
                                    alt="post"
                                    className="w-full"
                                />
                            )}

                            {/* Buttons */}
                            <div className="p-3">
                                <button
                                    onClick={() => handleLike(post._id)}
                                    className="text-2xl hover:opacity-70"
                                >
                                    🤍
                                </button>

                                {/* Post text */}
                                {post.text && (
                                    <p className="text-sm mt-2">
                                        <span className="font-semibold mr-1">
                                            {post.author?.username}
                                        </span>
                                        {post.text}
                                    </p>
                                )}

                                <p className="text-gray-400 text-xs mt-1">
                                    {new Date(post.createdAt).toLocaleDateString()}
                                </p>
                            </div>

                        </div>
                    ))
                )}
            </div>
        </div>
    )
}