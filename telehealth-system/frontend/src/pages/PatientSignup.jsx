import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, isDemoFirebase } from '../firebase/firebaseConfig';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { LogIn, ArrowRight, Lock, Mail, User as UserIcon } from 'lucide-react';

export default function PatientSignup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      // In demo mode we don't actually create Firebase users; just show how it would work
      if (isDemoFirebase) {
        const demoUser = {
          uid: 'demo-patient-signup',
          email,
          displayName: name,
          role: 'patient',
        };
        localStorage.setItem('demoUser', JSON.stringify(demoUser));
        localStorage.setItem('userRole', 'patient');
        localStorage.setItem('authToken', 'demo-patient-token');
        navigate('/dashboard');
        return;
      }

      const cred = await createUserWithEmailAndPassword(auth, email, password);

      if (name) {
        await updateProfile(cred.user, { displayName: name });
      }

      const token = await cred.user.getIdToken();
      localStorage.setItem('authToken', token);
      localStorage.setItem('userRole', 'patient');
      navigate('/dashboard');
    } catch (err) {
      console.error('Patient signup error:', err);
      let message = 'Failed to create account. ';
      if (err.code === 'auth/email-already-in-use') {
        message += 'This email is already registered. Please log in instead.';
      } else if (err.code === 'auth/invalid-email') {
        message += 'Please enter a valid email address.';
      } else if (err.code === 'auth/weak-password') {
        message += 'Password is too weak. Please use a stronger password.';
      } else {
        message += err.message || 'Please try again.';
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-brand-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-100/50 rounded-full blur-[100px] -z-10 translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-100/30 rounded-full blur-[80px] -z-10 -translate-x-1/3 translate-y-1/3" />

      <Card className="max-w-md w-full p-8 relative z-10 shadow-premium border-slate-100/50">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <LogIn size={32} />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Create Patient Account</h2>
          <p className="mt-2 text-sm text-slate-600">
            Sign up to securely manage your appointments and health records.
          </p>
        </div>

        <div className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label htmlFor="name" className="label">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-slate-400">
                  <UserIcon className="h-5 w-5" />
                </span>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field pl-12"
                  placeholder="Your full name"
                />
              </div>
            </div>

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
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="label">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-slate-400">
                  <Lock className="h-5 w-5" />
                </span>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-12"
                  placeholder="Create a password"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="label">
                Confirm Password
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-slate-400">
                  <Lock className="h-5 w-5" />
                </span>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-field pl-12"
                  placeholder="Re-enter your password"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full mt-6"
              isLoading={loading}
            >
              {!loading && (
                <>
                  Create account <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}

