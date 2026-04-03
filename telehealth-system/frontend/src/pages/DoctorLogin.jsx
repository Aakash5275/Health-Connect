import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, isDemoFirebase } from '../firebase/firebaseConfig';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Stethoscope, ArrowRight, Lock, Mail } from 'lucide-react';

export default function DoctorLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Demo mode: allow README demo credentials without real Firebase
      if (isDemoFirebase && email === 'demo@telehealth.com' && password === 'demo123') {
        const demoUser = {
          uid: 'demo-doctor',
          email,
          displayName: 'Demo Doctor',
          role: 'doctor',
        };
        localStorage.setItem('demoUser', JSON.stringify(demoUser));
        localStorage.setItem('userRole', 'doctor');
        localStorage.setItem('authToken', 'demo-doctor-token');
        navigate('/doctor-dashboard');
        return;
      }

      const cred = await signInWithEmailAndPassword(auth, email, password);
      const token = await cred.user.getIdToken();
      localStorage.setItem('authToken', token);
      localStorage.setItem('userRole', 'doctor');
      navigate('/doctor-dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-brand-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-slate-200/50 rounded-full blur-[100px] -z-10 -translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-100/30 rounded-full blur-[80px] -z-10 translate-x-1/3 translate-y-1/3" />

      <Card className="max-w-md w-full p-8 relative z-10 shadow-premium border-slate-100/50 bg-gradient-to-b from-white to-slate-50/50">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-slate-100 text-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Stethoscope size={32} />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Doctor Portal</h2>
          <p className="mt-2 text-sm text-slate-600">
            Sign in to manage appointments and patient records
          </p>
        </div>

        <div className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="label">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-slate-400">
                  <Mail className="h-5 w-5" />
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-12"
                  placeholder="doctor@hospital.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="label flex justify-between">
                <span>Password</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-slate-400">
                  <Lock className="h-5 w-5" />
                </span>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-12"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full mt-6"
              isLoading={loading}
              variant="secondary"
            >
              {!loading && (
                <>
                  Sign in securely <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm border-t border-slate-200/60 pt-6">
            <p className="text-slate-500">
              Provider access is restricted to verified medical personnel.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
