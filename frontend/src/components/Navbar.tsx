import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const navLinks = [
  { path: '/', label: 'Dashboard' },
  { path: '/kanban', label: 'Kanban' },
  { path: '/categories', label: 'Categories' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-b dark:border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
            TaskTracker
          </Link>
          <div className="flex gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200'
                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={toggleDarkMode} className="p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700" title="Toggle dark mode">
            {darkMode ? '☀️' : '🌙'}
          </button>
          <span className="text-sm text-gray-600 dark:text-gray-300">{user?.username}</span>
          <button onClick={logout} className="text-sm text-red-600 hover:text-red-800 dark:text-red-400">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
