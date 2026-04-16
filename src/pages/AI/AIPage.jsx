import { useState, useRef, useEffect } from 'react'
import { Bot, Send } from 'lucide-react'
import axios from '../../api/axios'

export default function AIPage() {
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: 'Привет! Я AI ассистент ICHgram 🤖 Помогу написать красивый пост, придумаю хештеги или просто поболтаю!'
        }
    ])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const bottomRef = useRef(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const sendMessage = async () => {
        if (!input.trim() || loading) return

        const userMessage = { role: 'user', content: input }
        setMessages(prev => [...prev, userMessage])
        setInput('')
        setLoading(true)

        try {
            const history = messages.map(m => ({
                role: m.role,
                content: m.content
            }))

            const res = await axios.post('/ai/chat', {
                message: input,
                history
            })

            setMessages(prev => [...prev, {
                role: 'assistant',
                content: res.data.reply
            }])
        } catch (err) {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Извини, AI сейчас недоступен 😔 Попробуй позже.'
            }])
        } finally {
            setLoading(false)
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            sendMessage()
        }
    }

    return (
        <div className="flex flex-col h-screen bg-gray-50">


            <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                    <Bot size={20} className="text-white" />
                </div>
                <div>
                    <p className="font-semibold text-sm">ICHgram AI</p>
                    <p className="text-xs text-gray-500">Powered by Ollama</p>
                </div>
            </div>


            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'assistant' && (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center mr-2 flex-shrink-0 mt-1">
                                <Bot size={14} className="text-white" />
                            </div>
                        )}
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl text-sm ${
                            msg.role === 'user'
                                ? 'bg-blue-500 text-white rounded-br-none'
                                : 'bg-white border border-gray-200 rounded-bl-none'
                        }`}>
                            {msg.content}
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="flex justify-start">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center mr-2 flex-shrink-0">
                            <Bot size={14} className="text-white" />
                        </div>
                        <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-none px-4 py-2">
                            <div className="flex gap-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    </div>
                )}

                <div ref={bottomRef} />
            </div>


            <div className="px-4 py-2 flex gap-2 overflow-x-auto">
                {['Напиши подпись к фото', 'Придумай хештеги', 'Идеи для поста'].map(hint => (
                    <button
                        key={hint}
                        onClick={() => setInput(hint)}
                        className="flex-shrink-0 text-xs bg-white border border-gray-200 rounded-full px-3 py-1 hover:bg-gray-50"
                    >
                        {hint}
                    </button>
                ))}
            </div>


            <div className="bg-white border-t border-gray-200 px-4 py-3 flex items-end gap-3">
                <textarea
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Напишите сообщение..."
                    className="flex-1 bg-gray-100 rounded-2xl px-4 py-2 text-sm resize-none outline-none max-h-32"
                    rows={1}
                />
                <button
                    onClick={sendMessage}
                    disabled={!input.trim() || loading}
                    className="w-10 h-10 bg-blue-500 hover:bg-blue-600 disabled:opacity-40 rounded-full flex items-center justify-center flex-shrink-0"
                >
                    <Send size={16} className="text-white" />
                </button>
            </div>
        </div>
    )
}