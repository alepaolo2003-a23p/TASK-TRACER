import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const navLinks = [
  { path: '/', label: 'Tablero' },
  { path: '/kanban', label: 'Kanban' },
  { path: '/categories', label: 'Categorías' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-[#0F0F14]/80 backdrop-blur-lg border-b dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-xl font-extrabold text-[#7C5CFC] tracking-tight">
            Stride
          </Link>
          <div className="hidden md:flex gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                  location.pathname === link.path
                    ? 'bg-[#7C5CFC]/10 text-[#7C5CFC] dark:text-[#7C5CFC]'
                    : 'text-gray-600 hover:text-gray-900 dark:text-[#9494A0] dark:hover:text-[#F2F2F5] hover:bg-gray-100 dark:hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={toggleDarkMode} className="btn-ghost p-2 text-lg" title="Cambiar tema">
            {darkMode ? '☀️' : '🌙'}
          </button>
          <span className="hidden sm:block text-sm text-gray-600 dark:text-[#9494A0]">{user?.username}</span>
          <button onClick={logout} className="btn-ghost text-red-500 hover:text-red-600 dark:text-[#FF6B6B] dark:hover:text-[#FF6B6B]/80">
            Cerrar sesión
          </button>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden btn-ghost p-2" aria-label="Menú">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>
      {mobileOpen && (
        <div className="md:hidden border-t dark:border-gray-800 bg-white dark:bg-[#1A1A22] px-4 py-3 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                location.pathname === link.path
                  ? 'bg-[#7C5CFC]/10 text-[#7C5CFC]'
                  : 'text-gray-600 dark:text-[#9494A0] hover:bg-gray-100 dark:hover:bg-white/5'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
