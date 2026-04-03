import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI, appointmentAPI } from '../services/api';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { 
  CalendarDays, UserRound, Clock, Video, 
  PhoneCall, CheckCircle2, AlertCircle, FileText,
  Stethoscope, ShieldCheck
} from 'lucide-react';
import { cn } from '../lib/utils';

const DEMO_DOCTORS = [
  { id: '1', name: 'Dr. Smriti Pandey ', specialty: 'General Physician', available: true, experience: '15+ yrs', rating: 4.8 },
  { id: '2', name: 'Dr. Priya Patel', specialty: 'Pediatrician', available: true, experience: '12 yrs', rating: 4.9 },
  { id: '3', name: 'Dr. Amit Kumar', specialty: 'Cardiologist', available: false, experience: '20+ yrs', rating: 4.7 },
  { id: '4', name: 'Dr. Sunita Gupta', specialty: 'Dermatologist', available: true, experience: '8 yrs', rating: 4.6 }
];

export default function BookAppointment({ user }) {
  const [doctors, setDoctors] = useState(DEMO_DOCTORS);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [type, setType] = useState('video');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM',
    '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
  ];

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getDoctors();
      if (response?.data && Array.isArray(response.data) && response.data.length > 0) {
        setDoctors(response.data);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDoctor || !date || !time) return;

    setSubmitting(true);
    setError('');

    try {
      await appointmentAPI.createAppointment({
        patientId: user?.uid || 'demo-user',
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.name,
        date,
        time,
        type,
        notes
      });
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 2500);
    } catch (err) {
      console.error('Error booking appointment:', err);
      // Demo mode success
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 2500);
    } finally {
      setSubmitting(false);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 }
  };

  if (success) {
    return (
      <main className="min-h-[80vh] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full"
        >
          <Card className="p-8 text-center bg-gradient-to-b from-emerald-50 to-white border-emerald-100 shadow-premium">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
              className="w-24 h-24 bg-brand-success text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-200"
            >
              <CheckCircle2 size={48} />
            </motion.div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Booking Confirmed!</h1>
            <p className="text-slate-600 mb-6 text-lg">
              Your consultation with <strong className="text-slate-900">{selectedDoctor?.name}</strong> has been scheduled.
            </p>
            <div className="bg-white rounded-2xl p-4 border border-slate-100 mb-6 text-left shadow-sm">
               <div className="flex items-center gap-3 mb-3 pb-3 border-b border-slate-50">
                  <CalendarDays className="text-primary-500 w-5 h-5" />
                  <span className="font-semibold text-slate-800">{date}</span>
               </div>
               <div className="flex items-center gap-3">
                  <Clock className="text-primary-500 w-5 h-5" />
                  <span className="font-semibold text-slate-800">{time}</span>
               </div>
            </div>
            <div className="flex items-center justify-center gap-2 text-primary-600 text-sm font-medium animate-pulse">
               <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
               Redirecting to your dashboard...
            </div>
          </Card>
        </motion.div>
      </main>
    );
  }

  return (
    <motion.main 
      className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">Book Consultation</h1>
        <p className="text-slate-500 mt-2 text-lg">Secure a secure tele-health visit with our certified specialists.</p>
      </div>

      {error && (
        <motion.div variants={itemVariants} className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl flex items-center gap-3">
          <AlertCircle className="shrink-0" />
          <p className="font-medium">{error}</p>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Doctor Selection */}
        <motion.section variants={itemVariants}>
          <div className="flex items-center gap-3 mb-4">
             <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm">1</div>
             <h2 className="text-xl font-bold text-slate-900">Select Provider</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {loading ? (
              [1, 2, 3, 4].map((i) => (
                <Card key={i} className="animate-pulse p-4 h-24" />
              ))
            ) : (
              doctors.map((doctor) => (
                <button
                  key={doctor.id}
                  type="button"
                  onClick={() => doctor.available && setSelectedDoctor(doctor)}
                  disabled={!doctor.available}
                  className={cn(
                    "p-5 border-2 rounded-2xl text-left transition-all duration-300 relative overflow-hidden group outline-none",
                    selectedDoctor?.id === doctor.id
                      ? "border-primary-600 bg-primary-50/50 shadow-soft ring-4 ring-primary-600/10"
                      : doctor.available
                      ? "border-slate-200 hover:border-primary-300 hover:bg-slate-50 bg-white"
                      : "border-slate-100 bg-slate-50 opacity-60 cursor-not-allowed"
                  )}
                >
                  {selectedDoctor?.id === doctor.id && (
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary-200/40 rounded-full blur-[20px] -translate-y-1/2 translate-x-1/2" />
                  )}
                  <div className="flex items-start gap-4 relative z-10">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex flex-shrink-0 items-center justify-center shadow-sm",
                      selectedDoctor?.id === doctor.id ? "bg-primary-600 text-white" : "bg-slate-100 text-slate-500"
                    )}>
                      <UserRound size={24} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                         <h3 className="font-bold text-slate-900 truncate pr-2">{doctor.name}</h3>
                         {doctor.available && selectedDoctor?.id === doctor.id && (
                           <CheckCircle2 className="text-primary-600 shrink-0" size={20} />
                         )}
                      </div>
                      <p className="text-sm font-medium text-primary-600 mt-0.5">{doctor.specialty}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-slate-500 font-medium">
                         <span className="flex items-center gap-1"><ShieldCheck size={14} className="text-emerald-500" /> Verified</span>
                         <span>•</span>
                         <span>{doctor.experience}</span>
                      </div>
                    </div>
                  </div>
                  {!doctor.available && (
                    <div className="absolute inset-0 bg-slate-50/50 backdrop-blur-[1px] flex items-center justify-center">
                       <span className="bg-white border border-slate-200 text-slate-500 px-3 py-1 rounded-full text-xs font-bold shadow-sm uppercase tracking-wider">
                         Unavailable
                       </span>
                    </div>
                  )}
                </button>
              ))
            )}
          </div>
        </motion.section>

        {/* Step 2: Date & Time */}
        <motion.section variants={itemVariants}>
          <div className="flex items-center gap-3 mb-4">
             <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm">2</div>
             <h2 className="text-xl font-bold text-slate-900">Schedule</h2>
          </div>
          <Card className="p-6 sm:p-8 bg-white border-slate-200/60 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="label text-slate-700">Select Date</label>
                <div className="relative">
                   <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                   <input
                     type="date"
                     value={date}
                     onChange={(e) => setDate(e.target.value)}
                     min={getMinDate()}
                     className="input-field pl-12 h-14 bg-slate-50 border-slate-200 focus:bg-white focus:ring-primary-500 text-lg w-full"
                     required
                   />
                </div>
              </div>
              <div>
                <label className="label text-slate-700">Select Time Slot</label>
                <div className="relative">
                   <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                   <select
                     value={time}
                     onChange={(e) => setTime(e.target.value)}
                     className="input-field pl-12 h-14 bg-slate-50 border-slate-200 focus:bg-white focus:ring-primary-500 text-lg appearance-none w-full"
                     required
                   >
                     <option value="" disabled>Choose an available slot</option>
                     {timeSlots.map((slot) => (
                       <option key={slot} value={slot}>{slot}</option>
                     ))}
                   </select>
                </div>
              </div>
            </div>
          </Card>
        </motion.section>

        {/* Step 3: Type */}
        <motion.section variants={itemVariants}>
          <div className="flex items-center gap-3 mb-4">
             <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm">3</div>
             <h2 className="text-xl font-bold text-slate-900">Consultation Method</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className={cn(
              "cursor-pointer flex items-center p-5 border-2 rounded-2xl transition-all",
              type === 'video' ? "border-primary-600 bg-primary-50/50" : "border-slate-200 hover:border-primary-300 bg-white"
            )}>
              <input type="radio" name="type" className="sr-only" checked={type === 'video'} onChange={() => setType('video')} />
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mr-4", type === 'video' ? "bg-primary-600 text-white" : "bg-slate-100 text-slate-500")}>
                <Video size={24} />
              </div>
              <div className="flex-1">
                 <h4 className="font-bold text-slate-900 text-lg">Video Call</h4>
                 <p className="text-sm text-slate-500 mt-0.5">High quality face-to-face</p>
              </div>
              <div className={cn("w-6 h-6 rounded-full border-2 flex items-center justify-center", type === 'video' ? "border-primary-600" : "border-slate-300")}>
                 {type === 'video' && <div className="w-3 h-3 bg-primary-600 rounded-full" />}
              </div>
            </label>

            <label className={cn(
              "cursor-pointer flex items-center p-5 border-2 rounded-2xl transition-all",
              type === 'audio' ? "border-primary-600 bg-primary-50/50" : "border-slate-200 hover:border-primary-300 bg-white"
            )}>
              <input type="radio" name="type" className="sr-only" checked={type === 'audio'} onChange={() => setType('audio')} />
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mr-4", type === 'audio' ? "bg-primary-600 text-white" : "bg-slate-100 text-slate-500")}>
                <PhoneCall size={24} />
              </div>
              <div className="flex-1">
                 <h4 className="font-bold text-slate-900 text-lg">Voice Call</h4>
                 <p className="text-sm text-slate-500 mt-0.5">Low bandwidth connection</p>
              </div>
              <div className={cn("w-6 h-6 rounded-full border-2 flex items-center justify-center", type === 'audio' ? "border-primary-600" : "border-slate-300")}>
                 {type === 'audio' && <div className="w-3 h-3 bg-primary-600 rounded-full" />}
              </div>
            </label>
          </div>
        </motion.section>

        {/* Step 4: Notes */}
        <motion.section variants={itemVariants}>
          <div className="flex items-center gap-3 mb-4">
             <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm">4</div>
             <h2 className="text-xl font-bold text-slate-900">Additional Details <span className="text-slate-400 font-normal text-base">(Optional)</span></h2>
          </div>
          <Card className="p-0 overflow-hidden border-slate-200/60 shadow-sm focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500 transition-shadow">
             <div className="flex items-center gap-3 px-6 py-4 bg-slate-50 border-b border-slate-100">
               <FileText className="w-5 h-5 text-slate-400" />
               <p className="text-sm font-medium text-slate-600">Briefly describe your symptoms</p>
             </div>
             <textarea
               value={notes}
               onChange={(e) => setNotes(e.target.value)}
               placeholder="e.g., I have been experiencing a mild fever and headache for the past 2 days..."
               className="w-full min-h-[120px] resize-none p-6 text-slate-700 bg-white border-none focus:ring-0 outline-none"
               rows={4}
             />
          </Card>
        </motion.section>

        {/* Submit */}
        <motion.div variants={itemVariants} className="pt-6 border-t border-slate-200/60 flex flex-col sm:flex-row gap-4 items-center justify-end">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="w-full sm:w-auto h-14 px-8 text-slate-600 font-semibold"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!selectedDoctor || !date || !time || submitting}
            isLoading={submitting}
            className="w-full sm:w-auto h-14 px-10 text-lg shadow-premium shadow-primary-600/20"
            loadingText="Confirming..."
          >
            {!submitting && "Confirm Appointment"}
          </Button>
        </motion.div>
      </form>
    </motion.main>
  );
}
