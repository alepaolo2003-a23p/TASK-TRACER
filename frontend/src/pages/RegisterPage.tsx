import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

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
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md card p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-[#7C5CFC] tracking-tight">Stride</h1>
          <p className="text-sm text-gray-500 dark:text-[#9494A0] mt-1">Crea tu cuenta</p>
        </div>
        {error && <p className="text-[#FF6B6B] text-sm mb-4 text-center">{error}</p>}
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
          <button type="submit" disabled={loading} className="btn-primary w-full min-h-[44px]">
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>
        <p className="text-sm text-center mt-6 text-gray-500 dark:text-[#9494A0]">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-[#7C5CFC] hover:underline font-medium">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}
