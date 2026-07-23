import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
    } catch {
      setError('Credenciales inválidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center px-8 lg:px-16">
        <div className="w-full max-w-sm">
          <div className="mb-10">
            <img src="/stride-logo.png" alt="Stride" className="h-8 w-auto mb-6" />
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Inicia sesión</h1>
            <p className="text-sm text-foreground-muted mt-1">Ingresa tus credenciales para continuar</p>
          </div>

          {error && (
            <p className="text-sm text-[#EF4444] bg-[#FEF2F2] dark:bg-[rgba(69,10,10,0.4)] dark:text-[#FCA5A5] px-3 py-2 rounded-[6px] mb-4">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Usuario</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required className="input" placeholder="Tu nombre de usuario" />
            </div>
            <div>
              <label className="label">Contraseña</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="input" placeholder="Tu contraseña" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </form>

          <p className="text-sm text-center mt-6 text-foreground-muted">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-foreground font-medium hover:underline">Registrarse</Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 bg-surface-muted border-l items-center justify-center px-8">
        <div className="max-w-xs text-center">
          <img src="/stride-logo.png" alt="Stride" className="h-10 w-auto mx-auto mb-6 opacity-80" />
          <h2 className="text-lg font-semibold text-foreground mb-2">Organiza tu trabajo</h2>
          <p className="text-sm text-foreground-muted leading-relaxed">
            Gestiona tus tareas con tablero Kanban, vista de lista y calendario. Todo sincronizado en la nube.
          </p>
          <div className="mt-8 space-y-3">
            <div className="flex items-center gap-3 text-sm text-foreground-muted">
              <span className="w-5 h-5 rounded-full bg-[#10B981]/10 flex items-center justify-center text-xs text-[#10B981] font-medium">✓</span>
              Tareas completadas: <span className="text-foreground font-medium">12</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-foreground-muted">
              <span className="w-5 h-5 rounded-full bg-[#3B82F6]/10 flex items-center justify-center text-xs text-[#3B82F6] font-medium">●</span>
              En progreso: <span className="text-foreground font-medium">5</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-foreground-muted">
              <span className="w-5 h-5 rounded-full bg-[#F59E0B]/10 flex items-center justify-center text-xs text-[#F59E0B] font-medium">🔥</span>
              Racha actual: <span className="text-foreground font-medium">7 días</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
