import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, isDemoFirebase } from './firebase/firebaseConfig';
import { AnimatePresence } from 'framer-motion';

// Pages
import Home from './pages/Home.jsx';
import LoginSelection from './pages/LoginSelection.jsx';
import PatientLogin from './pages/PatientLogin.jsx';
import DoctorLogin from './pages/DoctorLogin.jsx';
import PatientSignup from './pages/PatientSignup.jsx';
import DoctorSignup from './pages/DoctorSignup.jsx';
import Dashboard from './pages/Dashboard.jsx';
import DoctorDashboard from './pages/DoctorDashboard.jsx';
import BookAppointment from './pages/BookAppointment.jsx';
import HealthRecords from './pages/HealthRecords.jsx';
import Medicines from './pages/Medicines.jsx';
import Consultation from './pages/Consultation.jsx';
import VideoCallTest from './pages/VideoCallTest.jsx';
import SymptomChecker from './pages/SymptomChecker.jsx';
import Emergency from './pages/Emergency.jsx';

// Components
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/routing/ProtectedRoute.jsx';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null); // 'patient' or 'doctor'

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      // Primary: Firebase-authenticated user
      if (currentUser) {
        setUser(currentUser);
        const role = localStorage.getItem('userRole') || 'patient';
        setUserRole(role);
      } else if (isDemoFirebase) {
        // Demo fallback: use locally stored fake user if present
        const storedDemo = localStorage.getItem('demoUser');
        if (storedDemo) {
          const demoUser = JSON.parse(storedDemo);
          setUser(demoUser);
          const role = localStorage.getItem('userRole') || demoUser.role || 'patient';
          setUserRole(role);
        } else {
          setUser(null);
          setUserRole(null);
        }
      } else {
        setUser(null);
        setUserRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-brand-background flex flex-col font-sans">
        <Navbar user={user} userRole={userRole} />
        
        <main className="flex-grow flex flex-col pt-20"> {/* pt-20 to account for fixed navbar */}
          <AnimatePresence mode="wait">
            <Routes>
              {/* Public Routes */}
              <Route path="/home" element={<Home />} />
              
              {/* Auth Routes */}
              <Route 
                path="/login" 
                element={user ? <Navigate to={userRole === 'doctor' ? "/doctor-dashboard" : "/dashboard"} /> : <LoginSelection />} 
              />
              <Route 
                path="/signup/patient"
                element={user ? <Navigate to="/dashboard" /> : <PatientSignup />}
              />
              <Route 
                path="/signup/doctor"
                element={user ? <Navigate to="/doctor-dashboard" /> : <DoctorSignup />}
              />
              <Route 
                path="/login/patient" 
                element={user ? <Navigate to="/dashboard" /> : <PatientLogin />} 
              />
              <Route 
                path="/login/doctor" 
                element={user ? <Navigate to="/doctor-dashboard" /> : <DoctorLogin />} 
              />

              {/* Protected Patient Routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute user={user} userRole={userRole} allowedRoles={['patient']}>
                    <Dashboard user={user} />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/book-appointment" 
                element={
                  <ProtectedRoute user={user} userRole={userRole} allowedRoles={['patient']}>
                    <BookAppointment user={user} />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/health-records" 
                element={
                  <ProtectedRoute user={user} userRole={userRole} allowedRoles={['patient']}>
                    <HealthRecords user={user} />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/medicines" 
                element={
                  <ProtectedRoute user={user} userRole={userRole} allowedRoles={['patient']}>
                    <Medicines />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/symptom-checker" 
                element={
                  <ProtectedRoute user={user} userRole={userRole} allowedRoles={['patient']}>
                    <SymptomChecker />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/emergency" 
                element={
                  <ProtectedRoute user={user} userRole={userRole} allowedRoles={['patient']}>
                    <Emergency />
                  </ProtectedRoute>
                } 
              />

              {/* Protected Doctor Routes */}
              <Route 
                path="/doctor-dashboard" 
                element={
                  <ProtectedRoute user={user} userRole={userRole} allowedRoles={['doctor']}>
                    <DoctorDashboard user={user} />
                  </ProtectedRoute>
                } 
              />

              {/* Shared Protected Routes */}
              <Route 
                path="/consultation/:roomId" 
                element={
                  <ProtectedRoute user={user} userRole={userRole} allowedRoles={['patient', 'doctor']}>
                    <Consultation user={user} />
                  </ProtectedRoute>
                } 
              />

              {/* Video Test Route (for manual video-call testing) */}
              <Route path="/test/video-call" element={<VideoCallTest />} />
              
              {/* Fallback */}
              <Route 
                path="/" 
                element={<Navigate to="/home" />} 
              />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </Router>
  );
}

export default App;
