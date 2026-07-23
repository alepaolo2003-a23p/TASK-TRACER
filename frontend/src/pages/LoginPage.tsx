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
      setError('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md card p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-[#7C5CFC] tracking-tight">Stride</h1>
          <p className="text-sm text-gray-500 dark:text-[#9494A0] mt-1">Sign in to your account</p>
        </div>
        {error && <p className="text-[#FF6B6B] text-sm mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Username</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required className="input" />
          </div>
          <div>
            <label className="label">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="input" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full min-h-[44px]">
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <p className="text-sm text-center mt-6 text-gray-500 dark:text-[#9494A0]">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#7C5CFC] hover:underline font-medium">Register</Link>
        </p>
      </div>
    </div>
  );
}
