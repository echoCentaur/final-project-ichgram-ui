import { Link } from 'react-router-dom'
import phonesImg from '../../assets/phones.png'

export default function NotFound() {
    return (
        <div className="flex min-h-screen bg-gray-50 items-center justify-center px-4">
            <div className="flex items-center w-full max-w-3xl" style={{ gap: '40px' }}>

                {/* Картинка телефонов — слева */}
                <div className="hidden lg:block flex-1">
                    <img
                        src={phonesImg}
                        alt="ICHgram phones"
                        className="w-full object-contain"
                    />
                </div>

                {/* Текст справа */}
                <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        Oops! Page Not Found<br />(404 Error)
                    </h1>
                    <p className="text-gray-500 text-sm mb-2">
                        We're sorry, but the page you're looking for doesn't seem to exist.
                    </p>
                    <p className="text-gray-500 text-sm mb-2">
                        If you typed the URL manually, please double-check the spelling.
                    </p>
                    <p className="text-gray-500 text-sm mb-8">
                        If you clicked on a link, it may be outdated or broken.
                    </p>
                    <Link to="/"
                          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg transition inline-block">
                        ← На главную
                    </Link>
                </div>

            </div>
        </div>
    )
}