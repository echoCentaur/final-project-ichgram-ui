import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import axios from '../../api/axios'

export default function ProfilePage() {
    const { id } = useParams()
    const { user } = useAuth()
    const navigate = useNavigate()

    const [profile, setProfile] = useState(null)
    const [posts, setPosts] = useState([])
    const [isFollowing, setIsFollowing] = useState(false)
    const [followersCount, setFollowersCount] = useState(0)
    const [loading, setLoading] = useState(true)

    const isMyProfile = (user?.id || user?._id) === id

    useEffect(() => {
        fetchProfile()
        fetchPosts()
        fetchFollowers()
    }, [id])

    const fetchProfile = async () => {
        try {
            const res = await axios.get(`/users/${id}`)
            setProfile(res.data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const fetchPosts = async () => {
        try {
            const res = await axios.get(`/posts/user/${id}`)
            setPosts(Array.isArray(res.data) ? res.data : [])
        } catch (err) {
            console.error(err)
        }
    }

    const fetchFollowers = async () => {
        try {
            const res = await axios.get(`/follow/${id}/followers`)
            const data = Array.isArray(res.data) ? res.data : []
            setFollowersCount(data.length)
            setIsFollowing(data.some(f => f.follower?._id === user?.id))
        } catch (err) {
            console.error(err)
        }
    }

    const handleFollow = async () => {
        try {
            await axios.post(`/follow/${id}`)
            fetchFollowers()
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
            <div className="max-w-3xl mx-auto pt-6 px-4">

                {/* Шапка профиля */}
                <div className="flex items-center gap-8 mb-8 bg-white p-6 rounded border border-gray-200">

                    {/* Аватар */}
                    <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                        {profile?.profile_image ? (
                            <img src={profile.profile_image} alt="avatar" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-3xl text-gray-500">
                                {profile?.username?.[0]?.toUpperCase()}
                            </div>
                        )}
                    </div>

                    {/* Инфо */}
                    <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                            <h2 className="text-xl font-semibold">{profile?.username}</h2>

                            {isMyProfile ? (
                                <Link
                                    to="/profile/edit"
                                    className="border border-gray-300 rounded px-4 py-1 text-sm font-semibold hover:bg-gray-50"
                                >
                                    Редактировать
                                </Link>
                            ) : (
                                <button
                                    onClick={handleFollow}
                                    className={`rounded px-4 py-1 text-sm font-semibold ${
                                        isFollowing
                                            ? 'border border-gray-300 hover:bg-gray-50'
                                            : 'bg-blue-500 text-white hover:bg-blue-600'
                                    }`}
                                >
                                    {isFollowing ? 'Отписаться' : 'Подписаться'}
                                </button>
                            )}
                        </div>

                        <div className="flex gap-6 mb-3">
                            <span className="text-sm"><strong>{posts.length}</strong> публикаций</span>
                            <span className="text-sm"><strong>{followersCount}</strong> подписчиков</span>
                        </div>

                        {profile?.fullName && <p className="text-sm font-semibold">{profile.fullName}</p>}
                        {profile?.bio && <p className="text-sm">{profile.bio}</p>}
                    </div>
                </div>

                <div className="border-t border-gray-300 mb-4" />

                {/* Сетка постов */}
                {posts.length === 0 ? (
                    <div className="text-center text-gray-500 py-10">
                        <p className="text-4xl mb-3">📷</p>
                        <p className="font-semibold">Нет публикаций</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-3 gap-1">
                        {posts.map(post => (
                            <Link
                                key={post._id}
                                to={`/post/${post._id}`}
                                className="aspect-square bg-gray-200 overflow-hidden cursor-pointer hover:opacity-90 block"
                            >
                                {post.image ? (
                                    <img src={post.image} alt="post" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm p-2 text-center">
                                        {post.text}
                                    </div>
                                )}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}