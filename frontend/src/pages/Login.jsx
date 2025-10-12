import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function Login() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : { ...formData, role: 'admin' };

      const response = await axios.post(`${API}${endpoint}`, payload);
      
      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate('/admin');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-800/50 backdrop-blur-sm border-cyan-500/20">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">
            {isLogin ? 'Admin Login' : 'Create Admin Account'}
          </CardTitle>
          <CardDescription className="text-gray-400">
            {isLogin ? 'Sign in to access the scheduler' : 'Register a new admin account'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <Label htmlFor="name" className="text-gray-300">Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-gray-900/50 border-gray-700 text-white"
                  required
                  data-testid="name-input"
                />
              </div>
            )}
            
            <div>
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-gray-900/50 border-gray-700 text-white"
                required
                data-testid="email-input"
              />
            </div>
            
            <div>
              <Label htmlFor="password" className="text-gray-300">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="bg-gray-900/50 border-gray-700 text-white"
                required
                data-testid="password-input"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-2 rounded-lg text-sm" data-testid="error-message">
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white"
              disabled={loading}
              data-testid="submit-button"
            >
              {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-cyan-400 hover:text-cyan-300 text-sm"
                data-testid="toggle-auth-mode"
              >
                {isLogin ? "Don't have an account? Register" : 'Already have an account? Sign in'}
              </button>
            </div>

            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="text-gray-400 hover:text-gray-300 text-sm"
                data-testid="back-home-button"
              >
                ← Back to Home
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
