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

    const handleSubmit = async (e) => {
        e.preventDefault()
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
            setError(err.response?.data?.message || 'Ошибка создания поста')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-lg mx-auto pt-6 pb-10 px-4">
                <div className="bg-white border border-gray-200 rounded">

                    {/* Загрузка фото */}
                    <div className="border-b border-gray-200">
                        {preview ? (
                            <div className="relative">
                                <img
                                    src={preview}
                                    alt="preview"
                                    className="w-full max-h-96 object-cover"
                                />
                                <button
                                    onClick={() => { setImage(null); setPreview(null) }}
                                    className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                                >
                                    ✕
                                </button>
                            </div>
                        ) : (
                            <label className="flex flex-col items-center justify-center h-64 cursor-pointer hover:bg-gray-50">
                                <span className="text-4xl mb-2">📷</span>
                                <span className="text-sm text-gray-500">Нажмите чтобы добавить фото</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </label>
                        )}
                    </div>

                    {/* Текст поста */}
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
                            placeholder="Добавьте подпись..."
                            value={text}
                            onChange={e => setText(e.target.value)}
                            className="flex-1 text-sm resize-none outline-none min-h-20"
                            maxLength={2200}
                        />
                    </div>

                    {error && (
                        <p className="text-red-500 text-xs text-center pb-3">{error}</p>
                    )}
                </div>
            </div>
        </div>
    )
}