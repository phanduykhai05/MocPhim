export default function Sidebar() {
    return (
        <aside className="bg-gray-100 w-64 min-h-screen p-4">
            <div className="space-y-4">
                <h2 className="text-lg font-bold text-gray-900">Menu</h2>
                <nav className="space-y-2">
                    <a href="#" className="block text-gray-700 hover:text-indigo-600 py-2">
                        Dashboard
                    </a>
                    <a href="#" className="block text-gray-700 hover:text-indigo-600 py-2">
                        Analytics
                    </a>
                    <a href="#" className="block text-gray-700 hover:text-indigo-600 py-2">
                        Settings
                    </a>
                </nav>
            </div>
        </aside>
    );
}
