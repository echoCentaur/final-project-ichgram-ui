import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import axios from '../../api/axios'

export default function EditProfilePage() {
    const { user, login } = useAuth()
    const navigate = useNavigate()

    const [form, setForm] = useState({
        username: user?.username || '',
        fullName: user?.fullName || '',
        bio: user?.bio || '',
    })
    const [image, setImage] = useState(null)
    const [preview, setPreview] = useState(user?.profile_image || null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setImage(file)
            setPreview(URL.createObjectURL(file))
        }
    }

    const handleSubmit = async () => {
        setError('')
        setLoading(true)
        try {
            const formData = new FormData()
            formData.append('username', form.username)
            formData.append('fullName', form.fullName)
            formData.append('bio', form.bio)
            if (image) formData.append('profile_image', image)

            const res = await axios.put('/users/update', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })

            const token = localStorage.getItem('token')
            login(res.data, token)
            navigate(`/profile/${user.id}`)
        } catch (err) {
            setError(err.response?.data?.message || 'Ошибка обновления профиля')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-lg mx-auto pt-6 pb-10 px-4">

                <div className="flex items-center justify-between mb-6">
                    <button onClick={() => navigate(-1)} className="text-sm text-gray-500 hover:text-gray-800">
                        ← Назад
                    </button>
                    <h2 className="text-base font-semibold">Редактировать профиль</h2>
                    <button onClick={handleSubmit} disabled={loading}
                            className="text-blue-500 font-semibold text-sm disabled:opacity-40">
                        {loading ? 'Сохранение...' : 'Сохранить'}
                    </button>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">

                    {/* Аватар */}
                    <div className="flex flex-col items-center py-6 border-b border-gray-100">
                        <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden mb-3">
                            {preview ? (
                                <img src={preview} className="w-full h-full object-cover" alt="" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-2xl text-gray-400">
                                    {user?.username?.[0]?.toUpperCase()}
                                </div>
                            )}
                        </div>
                        <label className="text-blue-500 text-sm font-semibold cursor-pointer hover:text-blue-700">
                            Изменить фото
                            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                        </label>
                    </div>

                    {/* Поля */}
                    <div className="divide-y divide-gray-100">
                        {[
                            { label: 'Имя пользователя', name: 'username', placeholder: 'username' },
                            { label: 'Полное имя', name: 'fullName', placeholder: 'Полное имя' },
                        ].map(field => (
                            <div key={field.name} className="flex items-center px-4 py-3 gap-4">
                                <span className="text-sm text-gray-500 w-32 flex-shrink-0">{field.label}</span>
                                <input
                                    type="text"
                                    name={field.name}
                                    value={form[field.name]}
                                    onChange={handleChange}
                                    placeholder={field.placeholder}
                                    className="flex-1 text-sm outline-none"
                                />
                            </div>
                        ))}
                        <div className="flex items-start px-4 py-3 gap-4">
                            <span className="text-sm text-gray-500 w-32 flex-shrink-0 pt-1">О себе</span>
                            <textarea
                                name="bio"
                                value={form.bio}
                                onChange={handleChange}
                                placeholder="Расскажите о себе..."
                                rows={3}
                                className="flex-1 text-sm outline-none resize-none"
                                maxLength={150}
                            />
                        </div>
                    </div>
                </div>

                {error && <p className="text-red-500 text-xs text-center mt-3">{error}</p>}
            </div>
        </div>
    )
}