import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { User, Stethoscope, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LoginSelection() {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-100/50 rounded-full blur-[100px] -z-10 translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-100/50 rounded-full blur-[80px] -z-10 -translate-x-1/3 translate-y-1/3" />

      <motion.div 
        className="max-w-3xl w-full text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <span className="inline-block px-3 py-1 bg-white border border-slate-200 rounded-full text-sm font-medium text-slate-600 mb-4 shadow-sm">
          Welcome to Rural TeleHealth
        </span>
        <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">Select your portal</h1>
        <p className="text-slate-600 text-lg max-w-lg mx-auto">
          Choose how you want to access the platform. Patients can book consultations, while doctors manage their schedules.
        </p>
      </motion.div>

      <motion.div 
        className="grid md:grid-cols-2 gap-6 w-full max-w-4xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <Card 
            hoverEffect 
            className="h-full cursor-pointer flex flex-col items-center text-center p-10 group border-2 border-transparent hover:border-primary-200 transition-all duration-300"
            onClick={() => navigate('/login/patient')}
          >
            <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-100 transition-all duration-300">
              <User size={36} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Patient Portal</h2>
            <p className="text-slate-600 mb-4 max-w-xs text-balance">
              Book consultations, check symptoms, and manage your health records securely.
            </p>
            <div className="flex flex-col gap-3 w-full mt-auto">
              <Button className="w-full group-hover:bg-primary-700" onClick={(e) => {
                e.stopPropagation();
                navigate('/signup/patient');
              }}>
                Create Patient Account <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/login/patient');
                }}
              >
                Login as Patient
              </Button>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card 
            hoverEffect 
            className="h-full cursor-pointer flex flex-col items-center text-center p-10 group border-2 border-transparent hover:border-slate-300 transition-all duration-300 bg-gradient-to-b from-slate-50 to-white"
            onClick={() => navigate('/login/doctor')}
          >
            <div className="w-20 h-20 bg-slate-100 text-slate-700 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-slate-200 transition-all duration-300">
              <Stethoscope size={36} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Doctor Portal</h2>
            <p className="text-slate-600 mb-4 max-w-xs text-balance">
              Manage appointments, view patient records, and conduct video consultations.
            </p>
            <div className="flex flex-col gap-3 w-full mt-auto">
              <Button
                variant="secondary"
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/signup/doctor');
                }}
              >
                Create Doctor Account <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/login/doctor');
                }}
              >
                Login as Doctor
              </Button>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
