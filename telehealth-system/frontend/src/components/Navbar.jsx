import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth, isDemoFirebase } from '../firebase/firebaseConfig';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HeartPulse, Menu, X, LogOut, User, 
  Stethoscope, Calendar, FileText, Pill, AlertCircle, Activity
} from 'lucide-react';
import { Button } from './ui/Button';
import { cn } from '../lib/utils';

export default function Navbar({ user, userRole }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [hoveredLink, setHoveredLink] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      if (!isDemoFirebase) {
        await signOut(auth);
      }
      localStorage.removeItem('userRole'); // Clear role cache
      localStorage.removeItem('demoUser');
      localStorage.removeItem('authToken');
      navigate('/home');
      setIsOpen(false);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const navLinks = [
    { name: 'Overview', path: '/home', icon: Activity, public: true },
    { name: 'Consult Doctor', path: '/book-appointment', icon: Stethoscope, roles: ['patient'] },
    { name: 'AI Symptoms', path: '/symptom-checker', icon: Activity, roles: ['patient'] },
    { name: 'Health Records', path: '/health-records', icon: FileText, roles: ['patient', 'doctor'] },
    { name: 'Medicines', path: '/medicines', icon: Pill, roles: ['patient'] },
    { name: 'Appointments', path: '/doctor-dashboard', icon: Calendar, roles: ['doctor'] },
    { name: 'Emergency', path: '/emergency', icon: AlertCircle, roles: ['patient'] },
  ];

  const visibleLinks = navLinks.filter(link => 
    link.public || (user && link.roles?.includes(userRole))
  );

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out",
        scrolled 
          ? "bg-white/70 backdrop-blur-2xl border-b border-slate-200/50 shadow-[0_4px_30px_rgba(0,0,0,0.03)] py-3" 
          : "bg-transparent py-6"
      )}
    >
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <div className="flex justify-between items-center">
          
          {/* Logo */}
          <Link 
            to={user ? (userRole === 'doctor' ? '/doctor-dashboard' : '/dashboard') : '/home'} 
            className="flex items-center gap-3 group outline-none"
          >
            <motion.div 
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white shadow-lg shadow-primary-500/20 group-hover:shadow-primary-500/40 transition-all duration-500 ease-out"
            >
              <HeartPulse className="h-6 w-6" strokeWidth={2.5} />
            </motion.div>
            <span className="text-xl tracking-tight font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
              Rural TeleHealth
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div 
            className="hidden lg:flex items-center relative rounded-full bg-slate-500/5 backdrop-blur-md p-1.5 border border-slate-200/50"
            onMouseLeave={() => setHoveredLink(null)}
          >
            {visibleLinks.map((link) => {
              const isActive = location.pathname.startsWith(link.path);
              const isHovered = hoveredLink === link.path;
              
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onMouseEnter={() => setHoveredLink(link.path)}
                  className={cn(
                    "relative px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 z-10",
                    isActive || isHovered
                      ? "text-slate-900" 
                      : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  <span className="relative z-20 mix-blend-multiply">{link.name}</span>
                  
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-white rounded-full shadow-sm border border-slate-200/50 z-0"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  
                  {isHovered && !isActive && (
                    <motion.div
                      layoutId="hoverTab"
                      className="absolute inset-0 bg-slate-100/80 rounded-full z-0"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => navigate('/test/video-call')}
                className="shadow-sm border-slate-200/80 hover:border-slate-300 bg-white"
              >
                Join Video Call
              </Button>
            </motion.div>
            
            {user ? (
              <div className="flex items-center gap-3">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link to={userRole === 'doctor' ? '/doctor-dashboard' : '/dashboard'}>
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300">
                      <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
                        <User className="h-3.5 w-3.5 text-slate-600" />
                      </div>
                      <span>{userRole === 'doctor' ? 'Dr. Account' : 'Patient'}</span>
                    </div>
                  </Link>
                </motion.div>
                <div className="h-6 w-px bg-slate-200"></div>
                <button 
                  onClick={handleLogout} 
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors duration-200"
                  aria-label="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login/patient" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-2">
                  Patient Login
                </Link>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button 
                    size="sm" 
                    onClick={() => navigate('/login/doctor')} 
                    className="shadow-md shadow-primary-500/20"
                  >
                    Doctor Login
                  </Button>
                </motion.div>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="relative p-2 rounded-full text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors focus:outline-none"
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-5 w-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ opacity: 0, rotate: 90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: -90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-5 w-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: '100vh' }}
            exit={{ opacity: 0, height: 0, transition: { duration: 0.3 } }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden fixed top-[72px] left-0 right-0 bg-white/95 backdrop-blur-2xl border-t border-slate-200/50 overflow-y-auto z-40"
          >
            <div className="px-6 py-8 space-y-6 flex flex-col min-h-full pb-24">
              <motion.div 
                className="space-y-2"
                initial="hidden"
                animate="visible"
                variants={{
                  visible: {
                    transition: {
                      staggerChildren: 0.05
                    }
                  }
                }}
              >
                {visibleLinks.map((link) => {
                  const isActive = location.pathname.startsWith(link.path);
                  return (
                    <motion.div
                      key={link.name}
                      variants={{
                        hidden: { opacity: 0, x: -20 },
                        visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
                      }}
                    >
                      <Link
                        to={link.path}
                        className={cn(
                          "flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 font-medium",
                          isActive 
                            ? "bg-primary-50 text-primary-700 shadow-sm border border-primary-100/50" 
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        )}
                        onClick={() => setIsOpen(false)}
                      >
                        <div className={cn(
                          "p-2 rounded-xl",
                          isActive ? "bg-white text-primary-600 shadow-sm" : "bg-slate-100 text-slate-500"
                        )}>
                          <link.icon className="h-5 w-5" />
                        </div>
                        {link.name}
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.div>

              <div className="mt-auto pt-8 border-t border-slate-200/50">
                <motion.div 
                  className="flex flex-col gap-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  {user ? (
                    <>
                      <Link
                        to={userRole === 'doctor' ? '/doctor-dashboard' : '/dashboard'}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-between px-5 py-4 rounded-2xl bg-white border border-slate-200 shadow-sm text-slate-800 font-medium"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center border border-primary-100">
                            <User className="h-5 w-5 text-primary-600" />
                          </div>
                          <div>
                            <span className="block text-xs text-slate-500 uppercase tracking-wider font-semibold">Account</span>
                            <span className="block text-sm">{userRole === 'doctor' ? 'Dr. Account' : 'Patient Dashboard'}</span>
                          </div>
                        </div>
                      </Link>
                      <Button variant="ghost" onClick={handleLogout} className="w-full justify-center text-red-600 hover:bg-red-50 hover:text-red-700 h-12 rounded-xl">
                        <LogOut className="h-5 w-5 mr-2" />
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="secondary"
                        onClick={() => { navigate('/test/video-call'); setIsOpen(false); }}
                        className="w-full justify-center h-12 rounded-xl shadow-sm bg-white"
                      >
                        Join Video Call
                      </Button>
                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <Button variant="ghost" onClick={() => { navigate('/login/patient'); setIsOpen(false); }} className="w-full justify-center h-12 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700">
                          Patient Login
                        </Button>
                        <Button onClick={() => { navigate('/login/doctor'); setIsOpen(false); }} className="w-full justify-center h-12 rounded-xl shadow-md border border-primary-600 text-white bg-primary-600 hover:bg-primary-700">
                          Doctor Login
                        </Button>
                      </div>
                    </>
                  )}
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
