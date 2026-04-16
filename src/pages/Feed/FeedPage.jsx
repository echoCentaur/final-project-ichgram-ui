import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import axios from '../../api/axios'
import bannerImg from '../../assets/banner.png'

export default function FeedPage() {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const { user } = useAuth()

    useEffect(() => {
        fetchPosts()
    }, [])

    const fetchPosts = async () => {
        try {
            const res = await axios.get('/posts')
            setPosts(Array.isArray(res.data) ? res.data : [])
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
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
            <p className="text-gray-400">Загрузка...</p>
        </div>
    )

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-2xl mx-auto pt-6 pb-10 px-4">

                <div className="flex items-center justify-between mb-6">
                    <img src={bannerImg} alt="ICHgram" className="h-8 object-contain" />
                    <Link to="/create"
                          className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-lg font-semibold transition">
                        + Пост
                    </Link>
                </div>

                {posts.length === 0 ? (
                    <div className="text-center text-gray-400 mt-20">
                        <p className="text-4xl mb-4">📸</p>
                        <p className="font-semibold text-lg">Постов пока нет</p>
                        <p className="text-sm mt-2">Создайте первый пост!</p>
                        <Link to="/create"
                              className="inline-block mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-blue-600 transition">
                            Создать пост
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-3">
                        {posts.map(post => (
                            <div key={post._id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition">

                                {post.image ? (
                                    <Link to={`/post/${post._id}`}>
                                        {post.image ? (
                                            <div className="aspect-square overflow-hidden">
                                                <img src={post.image} alt="post" className="w-full h-full object-cover" />
                                            </div>
                                        ) : (
                                            <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">
                                                <p className="text-gray-500 text-xs text-center line-clamp-4">{post.text}</p>
                                            </div>
                                        )}
                                    </Link>
                                ) : (
                                    <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">
                                        <p className="text-gray-500 text-xs text-center line-clamp-4">{post.text}</p>
                                    </div>
                                )}

                                <div className="p-2">
                                    <div className="flex items-center gap-1.5 mb-1.5">
                                        <div className="w-5 h-5 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                                            {post.author?.profile_image ? (
                                                <img src={post.author.profile_image} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">
                                                    {post.author?.username?.[0]?.toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                        <Link to={`/profile/${post.author?._id}`}
                                              className="text-xs font-semibold hover:underline truncate">
                                            {post.author?.username}
                                        </Link>
                                    </div>

                                    {post.text && post.image && (
                                        <p className="text-xs text-gray-600 line-clamp-2 mb-1.5">{post.text}</p>
                                    )}

                                    <div className="flex items-center justify-between">
                                        <button
                                            onClick={() => handleLike(post._id)}
                                            className="text-base hover:scale-110 transition-transform"
                                        >
                                            🤍
                                        </button>
                                        <p className="text-gray-400 text-xs">
                                            {new Date(post.createdAt).toLocaleDateString('ru-RU', {
                                                day: 'numeric', month: 'short'
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}