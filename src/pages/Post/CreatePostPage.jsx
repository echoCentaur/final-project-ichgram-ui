import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import axios from '../../api/axios'

export default function CreatePostPage() {
    const [text, setText] = useState('')
    const [image, setImage] = useState(null)
    const [preview, setPreview] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const navigate = useNavigate()
    const { user } = useAuth()

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setImage(file)
            setPreview(URL.createObjectURL(file))
        }
    }

    const handleSubmit = async () => {
        if (!text.trim() && !image) {
            setError('Add photo or text')
            return
        }
        setError('')
        setLoading(true)
        try {
            const formData = new FormData()
            formData.append('text', text)
            if (image) formData.append('image', image)
            await axios.post('/posts', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            navigate(`/profile/${user.id}`)
        } catch (err) {
            setError(err.response?.data?.message || 'Error creating post')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-lg mx-auto pt-6 pb-10 px-4">

                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-semibold">New Post</h2>
                    <button
                        onClick={handleSubmit}
                        disabled={loading || (!text.trim() && !image)}
                        className="text-blue-500 font-semibold text-sm disabled:opacity-40 hover:text-blue-700"
                    >
                        {loading ? 'Sharing...' : 'Share'}
                    </button>
                </div>

                <div className="bg-white border border-gray-200 rounded overflow-hidden">

                    <div className="border-b border-gray-200">
                        {preview ? (
                            <div className="relative">
                                <img src={preview} alt="preview" className="w-full max-h-96 object-cover" />
                                <button
                                    onClick={() => { setImage(null); setPreview(null) }}
                                    className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm"
                                >
                                    ✕
                                </button>
                            </div>
                        ) : (
                            <label className="flex flex-col items-center justify-center h-64 cursor-pointer hover:bg-gray-50 transition">
                                <span className="text-sm font-semibold text-gray-600">Click to add photo</span>
                                <span className="text-xs text-gray-400 mt-1">PNG, JPG, GIF</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </label>
                        )}
                    </div>

                    <div className="flex items-start p-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden mr-3 flex-shrink-0">
                            {user?.profile_image ? (
                                <img src={user.profile_image} alt="avatar" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">
                                    {user?.username?.[0]?.toUpperCase()}
                                </div>
                            )}
                        </div>
                        <textarea
                            placeholder="Add description..."
                            value={text}
                            onChange={e => setText(e.target.value)}
                            className="flex-1 text-sm resize-none outline-none min-h-24 pt-1"
                            maxLength={2200}
                        />
                        <span className="text-xs text-gray-300 self-end ml-2">{text.length}/2200</span>
                    </div>

                    <div className="px-3 pb-3">
                        {error && <p className="text-red-500 text-xs text-center mb-2">{error}</p>}
                        <button
                            onClick={handleSubmit}
                            disabled={loading || (!text.trim() && !image)}
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg py-2 text-sm disabled:opacity-40 transition"
                        >
                            {loading ? 'Sharing...' : 'Share'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}