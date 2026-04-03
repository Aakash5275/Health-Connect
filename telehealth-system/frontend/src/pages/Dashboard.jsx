import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { appointmentAPI, aiAPI } from '../services/api';
import AppointmentCard from '../components/AppointmentCard';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { 
  Calendar, Pill, FileText, Activity, 
  Lightbulb, ArrowRight, Phone
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function Dashboard({ user }) {
  const [appointments, setAppointments] = useState([]);
  const [healthTip, setHealthTip] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const appointmentsRes = await appointmentAPI.getAppointments({ 
        patientId: user.uid,
        status: 'scheduled' 
      });
      setAppointments(appointmentsRes.data.slice(0, 3));

      const tipsRes = await aiAPI.getHealthTips();
      setHealthTip(tipsRes.data.dailyTip);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Use room-1, room-2, room-3 to match DoctorDashboard appointments so both join same Jitsi room
      setAppointments([
        {
          id: '1',
          doctorName: 'Sharma',
          date: '2026-03-15',
          time: '10:00 AM',
          type: 'video',
          status: 'scheduled',
          roomId: 'room-1'
        }
      ]);
      setHealthTip('Drink at least 8 glasses of water daily to maintain optimal hydration.');
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Consult Doctor',
      description: 'Schedule a video appointment',
      icon: Calendar,
      link: '/book-appointment',
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      title: 'AI Symptoms',
      description: 'Instant health assessment',
      icon: Activity,
      link: '/symptom-checker',
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    },
    {
      title: 'Medicines',
      description: 'Find local pharmacies',
      icon: Pill,
      link: '/medicines',
      color: 'text-amber-600',
      bg: 'bg-amber-50'
    },
    {
      title: 'Health Records',
      description: 'View medical history',
      icon: FileText,
      link: '/health-records',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium">Loading your health dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.main 
      className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Welcome Section */}
      <motion.section variants={itemVariants} className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
          Welcome back, {user.displayName || user.email?.split('@')[0] || 'Patient'}
        </h1>
        <p className="text-slate-500 mt-2 text-lg">
          Manage your healthcare journey from the comfort of your home.
        </p>
      </motion.section>

      {/* Health Tip Banner */}
      {healthTip && (
        <motion.section variants={itemVariants} className="mb-10">
          <div className="bg-gradient-to-r from-primary-600 to-blue-500 rounded-3xl p-6 sm:p-8 text-white shadow-premium relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/3" />
            <div className="flex items-start gap-4 sm:gap-6 relative z-10">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm border border-white/20">
                <Lightbulb className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-white/80 text-sm font-semibold tracking-wide uppercase mb-1">Daily Health Insight</p>
                <p className="text-white text-xl sm:text-2xl font-medium leading-relaxed">{healthTip}</p>
              </div>
            </div>
          </div>
        </motion.section>
      )}

      {/* Quick Actions Grid */}
      <motion.section variants={itemVariants} className="mb-12">
        <h2 className="section-title">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {quickActions.map((action) => (
            <Link key={action.title} to={action.link}>
              <Card hoverEffect className="h-full flex flex-col group p-6 border-transparent hover:border-slate-200 transition-all">
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110", action.bg, action.color)}>
                  <action.icon className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">{action.title}</h3>
                <p className="text-slate-500 text-sm">{action.description}</p>
              </Card>
            </Link>
          ))}
        </div>
      </motion.section>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Upcoming Appointments */}
        <motion.section variants={itemVariants} className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="section-title !mb-0">Upcoming Appointments</h2>
            <Link 
              to="/book-appointment" 
              className="text-primary-600 hover:text-primary-700 font-semibold text-sm flex items-center gap-1 group bg-primary-50 px-3 py-1.5 rounded-full"
            >
              View all
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {appointments.length > 0 ? (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <AppointmentCard key={appointment.id} appointment={appointment} />
              ))}
            </div>
          ) : (
            <Card className="text-center py-16 flex flex-col items-center justify-center border-dashed">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <Calendar className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No Upcoming Appointments</h3>
              <p className="text-slate-500 mb-6 max-w-sm">
                Get the care you need. Book a video or audio consultation with our certified rural specialists.
              </p>
              <Link to="/book-appointment">
                <Button>Book Appointment</Button>
              </Link>
            </Card>
          )}
        </motion.section>

        {/* Sidebar / Emergency Contact */}
        <motion.section variants={itemVariants} className="lg:col-span-1 space-y-6">
          <Card className="bg-gradient-to-br from-red-50 to-white border-red-100 p-8 text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-100/50 rounded-full blur-3xl" />
            <div className="w-16 h-16 bg-brand-emergency/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Phone className="w-8 h-8 text-brand-emergency" />
            </div>
            <h3 className="text-xl font-bold text-red-900 mb-2">Emergency Help</h3>
            <p className="text-red-700/80 mb-6 text-sm">
              Press the button below for immediate medical assistance or ambulance services.
            </p>
            <a href="tel:102" className="block w-full">
              <Button variant="danger" className="w-full h-14 text-lg animate-pulse-slow shadow-lg shadow-red-500/30">
                Call Emergency 102
              </Button>
            </a>
          </Card>
        </motion.section>
      </div>
    </motion.main>
  );
}
