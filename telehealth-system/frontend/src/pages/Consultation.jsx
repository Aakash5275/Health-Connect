import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import VideoCall from '../components/VideoCall';
import { appointmentAPI } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { 
  Video, Clock, PhoneOff, CheckCircle2, 
  Lightbulb, FileText, Pill, CalendarCheck, ShieldAlert
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function Consultation({ user }) {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [callEnded, setCallEnded] = useState(false);
  
  // Determine user role from localStorage or user object
  const userRole = localStorage.getItem('userRole') || user?.role || 'patient';
  const displayName = user?.displayName || user?.email?.split('@')[0] || (userRole === 'doctor' ? 'Doctor' : 'Patient');

  useEffect(() => {
    fetchAppointment();
  }, [roomId]);

  const fetchAppointment = async () => {
    try {
      setAppointment({
        id: '1',
        doctorName: userRole === 'doctor' ? displayName : 'Dr. Smriti Pandey',
        patientName: userRole === 'patient' ? displayName : 'Patient',
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'video',
        roomId: roomId
      });
    } catch (error) {
      console.error('Error fetching appointment:', error);
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  };

  const handleLeaveCall = () => {
    setCallEnded(true);
  };

  const handleReturnToDashboard = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 border-x border-slate-800">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Video className="w-8 h-8 text-primary-500 animate-pulse" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight mb-2">Preparing secure consultation room</h2>
            <p className="text-slate-400 text-sm">Establishing an encrypted P2P connection...</p>
          </div>
        </div>
      </div>
    );
  }

  if (callEnded) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-brand-background px-4 py-8 relative overflow-hidden">
        {/* Background Blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-100/40 rounded-full blur-[100px] -z-10 translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-100/30 rounded-full blur-[80px] -z-10 -translate-x-1/3 translate-y-1/3" />

        <motion.div 
          className="max-w-md w-full"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="p-8 text-center shadow-premium border-slate-100/50 bg-white/80 backdrop-blur-xl">
            <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-emerald-100">
              <CheckCircle2 size={40} />
            </div>
            
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Consultation Completed</h1>
            <p className="text-slate-500 mb-8 leading-relaxed">
              Your session with <strong className="text-slate-800 font-semibold">{appointment?.doctorName}</strong> has ended securely. 
              The doctor will update your health records and prescriptions shortly.
            </p>

            <div className="bg-slate-50 rounded-2xl p-5 mb-8 border border-slate-100 text-left">
              <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider">Next Steps</h3>
              <ul className="space-y-4">
                {[
                  { icon: FileText, text: "Check your health records for the digital prescription.", color: "text-blue-500", bg: "bg-blue-50" },
                  { icon: Pill, text: "Find and order prescribed medicines at nearby pharmacies.", color: "text-indigo-500", bg: "bg-indigo-50" },
                  { icon: CalendarCheck, text: "Schedule a follow-up appointment if recommended.", color: "text-emerald-500", bg: "bg-emerald-50" }
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className={cn("w-8 h-8 rounded-full flex shrink-0 items-center justify-center mt-0.5", item.bg, item.color)}>
                      <item.icon size={16} />
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed">{item.text}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              <Button onClick={handleReturnToDashboard} className="w-full h-14 text-lg">
                Return to Dashboard
              </Button>
              <Button variant="outline" onClick={() => navigate('/health-records')} className="w-full h-14 border-slate-200">
                View Health Records
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col relative overflow-hidden">
      {/* Dynamic Background for Video Room */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800/40 via-slate-950 to-slate-950 -z-10" />

      {/* Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/60 px-4 py-3 sm:py-4 sticky top-0 z-50 h-16 sm:h-20"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between h-full">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-600/20 text-primary-400 rounded-xl flex items-center justify-center border border-primary-500/20 shadow-[0_0_15px_rgba(0,87,255,0.2)]">
              <Video className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-white font-bold text-sm sm:text-base tracking-wide">Secure Consultation</h1>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </div>
              <p className="text-slate-400 text-xs sm:text-sm">{appointment?.doctorName}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            <div className="hidden md:flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700/50 text-slate-300 text-sm font-medium">
              <Clock className="w-4 h-4 text-primary-400" />
              <span>Session active • {appointment?.time}</span>
            </div>
            <Button
              variant="danger"
              size="sm"
              onClick={handleLeaveCall}
              className="px-4 sm:px-6 shadow-lg shadow-red-600/20 h-9 sm:h-10 text-xs sm:text-sm font-bold tracking-wide"
            >
              <PhoneOff className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">End Session</span>
              <span className="sm:hidden">End</span>
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row relative z-10 p-2 sm:p-4 gap-4 max-w-[1600px] w-full mx-auto min-h-[calc(100vh-64px)] sm:min-h-[calc(100vh-80px)]">
        
        {/* Video Call Area */}
        <motion.div 
          className="flex-1 w-full rounded-2xl sm:rounded-[2rem] overflow-hidden bg-black relative border border-slate-800/60 shadow-2xl aspect-video lg:aspect-auto lg:h-full"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <VideoCall
            roomId={roomId}
            userName={displayName}
            userRole={userRole}
            onLeave={handleLeaveCall}
          />

          <div className="absolute top-4 left-4 z-20 bg-black/40 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full flex items-center gap-2">
             <ShieldAlert size={14} className="text-emerald-400" />
             <span className="text-xs font-medium text-white tracking-wider">END-TO-END ENCRYPTED</span>
          </div>
        </motion.div>

        {/* Sidebar Panel (Desktop & Tablet) */}
        <motion.div 
          className="hidden lg:flex w-80 lg:w-96 flex-col gap-4 h-full shrink-0"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-slate-900/80 backdrop-blur-xl border-slate-800/80 p-6 flex-1 shadow-2xl">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2 text-lg border-b border-slate-800 pb-4">
              <Lightbulb className="w-5 h-5 text-amber-400" />
              Consultation Guide
            </h3>
            <ul className="space-y-4">
              {[
                "Ensure you are in a quiet, well-lit room for clear visibility.",
                "Have your previous medical prescriptions and reports handy.",
                "Clearly mention all symptoms, no matter how small.",
                "Ask the doctor to repeat instructions if the audio drops.",
                "Do not leave the call until the doctor confirms the session is over."
              ].map((tip, idx) => (
                <li key={idx} className="flex items-start gap-3 bg-slate-800/30 p-3 rounded-xl border border-slate-700/30">
                  <div className="w-6 h-6 rounded-full bg-primary-900/50 text-primary-400 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs border border-primary-800">
                    {idx + 1}
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">{tip}</p>
                </li>
              ))}
            </ul>
          </Card>
          
          <Card className="bg-slate-900/80 backdrop-blur-xl border-slate-800/80 p-5 shadow-2xl shrink-0">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                   <div className="w-3 h-3 bg-brand-success rounded-full" />
                </div>
                <div>
                   <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Network Status</p>
                   <p className="text-white font-bold text-sm">Excellent Connection</p>
                </div>
             </div>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
