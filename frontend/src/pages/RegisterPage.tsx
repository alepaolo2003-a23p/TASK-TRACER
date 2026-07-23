import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Logo from '../components/Logo';

export default function RegisterPage() {
  const { register } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(username, password, email);
    } catch (err: any) {
      setError(err.response?.data?.error || err.response?.data?.errors?.username || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-16">
        <div className="w-full max-w-sm">
          <div className="mb-10">
            <Logo className="h-8 w-auto mb-6" />
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Crear cuenta</h1>
            <p className="text-sm text-foreground-muted mt-1">Regístrate para empezar a organizar tus tareas</p>
          </div>

          {error && (
            <p className="text-sm text-[#EF4444] bg-[#FEF2F2] dark:bg-[rgba(69,10,10,0.4)] dark:text-[#FCA5A5] px-3 py-2 rounded-[6px] mb-4">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Usuario</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required className="input" placeholder="Elige un nombre de usuario" />
            </div>
            <div>
              <label className="label">Correo electrónico</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="input" placeholder="tucorreo@ejemplo.com" />
            </div>
            <div>
              <label className="label">Contraseña</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="input" placeholder="Mínimo 6 caracteres" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
          </form>

          <p className="text-sm text-center mt-6 text-foreground-muted">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-foreground font-medium hover:underline">Inicia sesión</Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 bg-surface-muted border-l items-center justify-center px-8">
        <div className="max-w-xs text-center">
          <Logo className="h-10 w-auto mx-auto mb-6 opacity-80" />
          <h2 className="text-lg font-semibold text-foreground mb-2">Empieza hoy</h2>
          <p className="text-sm text-foreground-muted leading-relaxed">
            Crea tu cuenta y comienza a gestionar tus proyectos con una herramienta simple y potente.
          </p>
          <div className="mt-8 space-y-3">
            <div className="flex items-center gap-3 text-sm text-foreground-muted">
              <span className="w-5 h-5 rounded-full bg-[#10B981]/10 flex items-center justify-center text-xs text-[#10B981] font-medium">✓</span>
              Sin límite de tareas
            </div>
            <div className="flex items-center gap-3 text-sm text-foreground-muted">
              <span className="w-5 h-5 rounded-full bg-[#3B82F6]/10 flex items-center justify-center text-xs text-[#3B82F6] font-medium">●</span>
              Categorías personalizadas
            </div>
            <div className="flex items-center gap-3 text-sm text-foreground-muted">
              <span className="w-5 h-5 rounded-full bg-[#F59E0B]/10 flex items-center justify-center text-xs text-[#F59E0B] font-medium">☀</span>
              Modo claro y oscuro
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
