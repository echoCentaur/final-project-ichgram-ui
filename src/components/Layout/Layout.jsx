import Sidebar from './Sidebar'
import { Link } from 'react-router-dom'

export default function Layout({ children }) {
    return (
        <div className="flex min-h-screen">
            <Sidebar />

            <div className="ml-16 md:ml-64 flex-1 flex flex-col min-h-screen">
                <main className="flex-1">
                    {children}
                </main>
                <footer className="border-t border-gray-100 px-8 py-6 mt-auto">
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mb-3">
                        {['About', 'Help', 'Press', 'API', 'Jobs', 'Privacy', 'Terms', 'Language'].map(item => (
                            <span key={item} className="text-xs text-gray-400 hover:underline cursor-pointer">
                                {item}
                            </span>
                        ))}
                    </div>
                    <p className="text-xs text-gray-400">© 2024 ICHGRAM</p>
                </footer>
            </div>
        </div>
    )
}