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
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md card p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-[#7C5CFC] tracking-tight">Stride</h1>
          <p className="text-sm text-gray-500 dark:text-[#9494A0] mt-1">Inicia sesión en tu cuenta</p>
        </div>
        {error && <p className="text-[#FF6B6B] text-sm mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Usuario</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required className="input" placeholder="Tu nombre de usuario" />
          </div>
          <div>
            <label className="label">Contraseña</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="input" placeholder="Tu contraseña" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full min-h-[44px]">
            {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>
        </form>
        <p className="text-sm text-center mt-6 text-gray-500 dark:text-[#9494A0]">
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="text-[#7C5CFC] hover:underline font-medium">Registrarse</Link>
        </p>
      </div>
    </div>
  );
}
