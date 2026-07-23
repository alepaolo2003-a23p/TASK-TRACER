import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const navItems = [
  {
    section: 'Navegación',
    items: [
      { path: '/', label: 'Tareas', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
    ],
  },
  {
    section: 'Etiquetas',
    items: [
      { path: '/categories', label: 'Administrar etiquetas', icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z' },
    ],
  },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const location = useLocation();

  return (
    <aside className="fixed top-0 left-0 h-screen w-[256px] bg-surface-muted border-r flex flex-col z-50">
      <div className="px-6 pt-6 pb-4">
        <Link to="/" className="flex items-center gap-2">
          <img src="/stride-logo.png" alt="Stride" className="h-7 w-auto" />
        </Link>
      </div>

      <div className="px-4 mb-4">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-subtle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Buscar tareas...  ⌘K"
            className="w-full pl-9 pr-3 py-2 text-sm bg-background border rounded-[6px] text-foreground placeholder-subtle focus:ring-1 focus:ring-ring focus:border-ring outline-none transition-shadow duration-150"
          />
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-6 overflow-y-auto">
        {navItems.map((section) => (
          <div key={section.section}>
            <p className="text-micro text-foreground-muted uppercase px-2 mb-1.5">{section.section}</p>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-2 py-2 rounded-[6px] text-sm font-medium transition-colors duration-150 ${
                      isActive
                        ? 'bg-foreground/10 text-foreground'
                        : 'text-foreground-muted hover:text-foreground hover:bg-foreground/5'
                    }`}
                  >
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                    </svg>
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="px-3 py-4 border-t mt-auto">
        <div className="flex items-center justify-between px-2 py-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-full bg-foreground/10 flex items-center justify-center text-xs font-medium text-foreground flex-shrink-0">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm text-foreground font-medium truncate">{user?.username}</span>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={toggleDarkMode} className="p-1.5 rounded-md hover:bg-foreground/5 transition-colors" title="Cambiar tema">
              {darkMode ? (
                <svg className="w-4 h-4 text-foreground-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-foreground-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            <button onClick={logout} className="p-1.5 rounded-md hover:bg-foreground/5 transition-colors" title="Cerrar sesión">
              <svg className="w-4 h-4 text-foreground-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
