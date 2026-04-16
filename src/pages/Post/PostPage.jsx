import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import axios from '../../api/axios'

export default function PostPage() {
    const { id } = useParams()
    const { user } = useAuth()
    const navigate = useNavigate()

    const [post, setPost] = useState(null)
    const [comments, setComments] = useState([])
    const [commentText, setCommentText] = useState('')
    const [liked, setLiked] = useState(false)
    const [likesCount, setLikesCount] = useState(0)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchPost()
        fetchComments()
        fetchLikes()
    }, [id])

    const fetchPost = async () => {
        try {
            const res = await axios.get(`/posts/${id}`)
            setPost(res.data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const fetchComments = async () => {
        try {
            const res = await axios.get(`/comments/${id}`)
            setComments(Array.isArray(res.data) ? res.data : [])
        } catch (err) {
            console.error(err)
        }
    }

    const fetchLikes = async () => {
        try {
            const res = await axios.get(`/likes/${id}`)
            const likes = Array.isArray(res.data) ? res.data : []
            setLikesCount(likes.length)
            setLiked(likes.some(l =>
                l.user?._id === user?.id ||
                l.user?._id === user?._id ||
                l.user === user?.id
            ))
        } catch (err) {
            console.error(err)
        }
    }

    const handleLike = async () => {
        try {
            await axios.post(`/likes/${id}`)
            fetchLikes()
        } catch (err) {
            console.error(err)
        }
    }

    const handleComment = async (e) => {
        e.preventDefault()
        if (!commentText.trim()) return
        try {
            await axios.post(`/comments/${id}`, { text: commentText })
            setCommentText('')
            fetchComments()
        } catch (err) {
            console.error(err)
        }
    }

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm('Delete comment?')) return
        try {
            await axios.delete(`/comments/${commentId}`)
            fetchComments()
        } catch (err) {
            console.error(err)
        }
    }

    const handleDeletePost = async () => {
        if (!window.confirm('Delete post?')) return
        try {
            await axios.delete(`/posts/${id}`)
            navigate(`/profile/${user?.id || user?._id}`)
        } catch (err) {
            console.error(err)
        }
    }

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <p className="text-gray-400">Loading...</p>
        </div>
    )

    if (!post) return (
        <div className="flex items-center justify-center min-h-screen">
            <p className="text-gray-400">Post not found</p>
        </div>
    )

    const currentUserId = user?.id || user?._id
    const isOwner = post.author?._id === currentUserId

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-2xl mx-auto pt-6 pb-10 px-4">

                <button onClick={() => navigate(-1)}
                        className="text-sm text-gray-500 hover:text-gray-800 mb-4 flex items-center gap-1">
                    ← Go back
                </button>

                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">


                    <div className="flex items-center justify-between p-3">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                                {post.author?.profile_image ? (
                                    <img src={post.author.profile_image} className="w-full h-full object-cover" alt="" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
                                        {post.author?.username?.[0]?.toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <Link to={`/profile/${post.author?._id}`}
                                  className="text-sm font-semibold hover:underline">
                                {post.author?.username}
                            </Link>
                        </div>
                        {isOwner && (
                            <button onClick={handleDeletePost}
                                    className="text-red-400 hover:text-red-600 text-sm">
                                Delete post
                            </button>
                        )}
                    </div>

                    {/* Фото */}
                    {post.image && (
                        <img src={post.image} alt="post" className="w-full" />
                    )}

                    {/* Действия */}
                    <div className="p-3">
                        <div className="flex items-center gap-2 mb-2">
                            <button onClick={handleLike}
                                    className="text-2xl hover:scale-110 transition-transform">
                                {liked ? '❤️' : '🤍'}
                            </button>
                            <span className="text-sm font-semibold">{likesCount}</span>
                        </div>
                        {post.text && (
                            <p className="text-sm mb-2">
                                <span className="font-semibold mr-1">{post.author?.username}</span>
                                {post.text}
                            </p>
                        )}
                        <p className="text-xs text-gray-400">
                            {new Date(post.createdAt).toLocaleDateString('ru-RU')}
                        </p>
                    </div>

                    {/* Комментарии */}
                    <div className="border-t border-gray-100 px-3 py-2 max-h-60 overflow-y-auto">
                        {comments.length === 0 ? (
                            <p className="text-xs text-gray-400 text-center py-4">There are no comments yet</p>
                        ) : (
                            comments.map(c => {
                                const isCommentOwner =
                                    c.user?._id === currentUserId ||
                                    c.user === currentUserId
                                return (
                                    <div key={c._id} className="flex items-start gap-2 mb-3">
                                        <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden flex-shrink-0 mt-0.5">
                                            {c.user?.profile_image ? (
                                                <img src={c.user.profile_image} className="w-full h-full object-cover" alt="" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
                                                    {c.user?.username?.[0]?.toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm">
                                                <span className="font-semibold mr-1">{c.user?.username}</span>
                                                {c.text}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-0.5">
                                                {new Date(c.createdAt).toLocaleDateString('ru-RU')}
                                            </p>
                                        </div>
                                        {isCommentOwner && (
                                            <button
                                                onClick={() => handleDeleteComment(c._id)}
                                                className="text-gray-300 hover:text-red-400 text-xs flex-shrink-0 mt-1"
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                )
                            })
                        )}
                    </div>

                    {/* Форма комментария */}
                    <form onSubmit={handleComment}
                          className="border-t border-gray-100 flex items-center gap-2 px-3 py-2">
                        <input
                            type="text"
                            placeholder="Add comment..."
                            value={commentText}
                            onChange={e => setCommentText(e.target.value)}
                            className="flex-1 text-sm outline-none py-1"
                        />
                        <button type="submit"
                                disabled={!commentText.trim()}
                                className="text-blue-500 font-semibold text-sm disabled:opacity-40">
                            Send comment
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}