import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from '../../api/axios'

export default function ExplorePage() {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchPosts()
    }, [])

    const fetchPosts = async () => {
        try {
            const res = await axios.get('/search/explore')
            setPosts(Array.isArray(res.data) ? res.data : [])
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <p className="text-gray-500">Loading...</p>
        </div>
    )

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-3xl mx-auto pt-6 px-4">
                <h2 className="text-lg font-semibold mb-4">Explore</h2>

                {posts.length === 0 ? (
                    <div className="text-center text-gray-500 py-10">
                        <p className="text-4xl mb-3">🔍</p>
                        <p>No posts</p>
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
                                    <img
                                        src={post.image}
                                        alt="post"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs p-2 text-center">
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