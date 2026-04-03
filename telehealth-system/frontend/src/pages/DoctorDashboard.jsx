import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { 
  Users, Calendar as CalendarIcon, FilePlus, 
  Video, Clock, CheckCircle, Upload
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function DoctorDashboard({ user }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate fetching doctor's appointments
    setTimeout(() => {
      setAppointments([
        { id: 1, patient: "Anil Kumar", time: "09:00 AM", type: "Video", status: "Upcoming", roomId: "room-1" },
        { id: 2, patient: "Sunita Sharma", time: "10:30 AM", type: "Audio", status: "Completed", roomId: "room-2" },
        { id: 3, patient: "Ramesh Singh", time: "02:00 PM", type: "Video", status: "Upcoming", roomId: "room-3" }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const stats = [
    { label: "Today's Consultations", value: "8", icon: CalendarIcon, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Pending Prescriptions", value: "3", icon: FilePlus, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Total Patients Sent", value: "142", icon: Users, color: "text-emerald-600", bg: "bg-emerald-50" }
  ];

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
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
      <motion.section variants={itemVariants} className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Dr. {user?.displayName || 'Dashboard'}
          </h1>
          <p className="text-slate-500 mt-1">
            General Physician • Rural Health Center
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" icon={Upload}>Upload Records</Button>
          <Button icon={Video} onClick={() => navigate('/consultation/room-1')}>Start Open Room</Button>
        </div>
      </motion.section>

      {/* Stats row */}
      <motion.section variants={itemVariants} className="mb-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <Card key={idx} className="flex items-center p-6 bg-gradient-to-br from-white to-slate-50">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mr-5 ${stat.bg} ${stat.color}`}>
              <stat.icon size={28} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
              <h3 className="text-3xl font-bold text-slate-900">{stat.value}</h3>
            </div>
          </Card>
        ))}
      </motion.section>

      {/* Appointments List */}
      <motion.section variants={itemVariants}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="section-title !mb-0">Today's Schedule</h2>
        </div>
        
        <Card className="overflow-hidden p-0 border-slate-200">
          <div className="divide-y divide-slate-100">
            {appointments.map((apt) => (
              <div key={apt.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-start gap-4 mb-4 sm:mb-0">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold border border-slate-200">
                    {apt.patient.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">{apt.patient}</h4>
                    <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                      <span className="flex items-center"><Clock className="w-4 h-4 mr-1" /> {apt.time}</span>
                      <span className="flex items-center"><Video className="w-4 h-4 mr-1" /> {apt.type}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    apt.status === 'Upcoming' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                  }`}>
                    {apt.status}
                  </span>
                  
                  {apt.status === 'Upcoming' ? (
                    <Button size="sm" onClick={() => navigate(`/consultation/${apt.roomId}`)}>
                      Join Call
                    </Button>
                  ) : (
                    <Button size="sm" variant="secondary" icon={CheckCircle}>
                      View Notes
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.section>
    </motion.main>
  );
}
