import { useState, useEffect } from 'react';
import { recordAPI } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { 
  FileText, HeartPulse, Pill, Stethoscope, 
  Download, Activity, Calendar
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function HealthRecords({ user }) {
  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const response = await recordAPI.getRecords({ patientId: user?.uid });
      setRecords(response.data);
    } catch (error) {
      setRecords([
        {
          id: '1',
          date: '2026-03-10',
          doctorName: 'Dr. Smriti Pandey',
          diagnosis: 'Viral Fever',
          prescription: [
            { medicine: 'Paracetamol 500mg', dosage: '1 tablet', frequency: 'Twice daily', duration: '5 days' },
            { medicine: 'Vitamin C', dosage: '1 tablet', frequency: 'Once daily', duration: '10 days' }
          ],
          vitals: { temperature: '101°F', bp: '120/80', pulse: '88 bpm' },
          notes: 'Rest advised. Drink plenty of fluids. Follow up if fever persists.'
        },
        {
          id: '2',
          date: '2026-02-15',
          doctorName: 'Dr. Priya Patel',
          diagnosis: 'Seasonal Allergies',
          prescription: [
            { medicine: 'Cetirizine 10mg', dosage: '1 tablet', frequency: 'Once daily', duration: '7 days' }
          ],
          vitals: { temperature: '98.6°F', bp: '118/76', pulse: '72 bpm' },
          notes: 'Avoid dust exposure. Use mask outdoors.'
        },
        {
          id: '3',
          date: '2026-01-20',
          doctorName: 'Dr. Amit Kumar',
          diagnosis: 'Routine Checkup',
          prescription: [],
          vitals: { temperature: '98.4°F', bp: '120/82', pulse: '76 bpm' },
          notes: 'All vitals normal. Continue healthy lifestyle.'
        }
      ]);
      setSelectedRecord({
        id: '1',
        date: '2026-03-10',
        doctorName: 'Dr. Smriti Pandey ',
        diagnosis: 'Viral Fever',
        prescription: [
          { medicine: 'Paracetamol 500mg', dosage: '1 tablet', frequency: 'Twice daily', duration: '5 days' },
          { medicine: 'Vitamin C', dosage: '1 tablet', frequency: 'Once daily', duration: '10 days' }
        ],
        vitals: { temperature: '101°F', bp: '120/80', pulse: '88 bpm' },
        notes: 'Rest advised. Drink plenty of fluids. Follow up if fever persists.'
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const filteredRecords = records.filter(record => {
    if (activeTab === 'all') return true;
    if (activeTab === 'prescriptions') return record.prescription?.length > 0;
    if (activeTab === 'checkups') return record.diagnosis === 'Routine Checkup';
    return true;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <main className="container mx-auto px-4 max-w-6xl py-8">
        <div className="animate-pulse space-y-6 flex flex-col items-center pt-20">
           <div className="w-12 h-12 border-4 border-slate-200 border-t-primary-600 rounded-full animate-spin"></div>
        </div>
      </main>
    );
  }

  return (
    <motion.main 
      className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">Health Records</h1>
        <p className="text-slate-500 mt-2 text-lg">Securely view your medical history, prescriptions, and reports.</p>
      </div>

      <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        {['all', 'prescriptions', 'checkups'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300",
              activeTab === tab
                ? "bg-slate-800 text-white shadow-md shadow-slate-900/20"
                : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
            )}
          >
            {tab === 'all' && 'All Records'}
            {tab === 'prescriptions' && 'Prescriptions'}
            {tab === 'checkups' && 'Routine Checkups'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - List */}
        <div className="lg:col-span-1 space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredRecords.map((record) => (
              <motion.div 
                key={record.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <button
                  onClick={() => setSelectedRecord(record)}
                  className={cn(
                    "w-full text-left p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden group",
                    selectedRecord?.id === record.id
                      ? "bg-primary-600 border-primary-600 shadow-premium"
                      : "bg-white border-slate-200 hover:border-primary-200 hover:shadow-soft"
                  )}
                >
                  {selectedRecord?.id === record.id && (
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-[20px] -translate-y-1/2 translate-x-1/2" />
                  )}
                  
                  <div className="flex flex-col gap-3 relative z-10">
                    <div className="flex items-start justify-between">
                      <div className={cn("p-2 rounded-xl", selectedRecord?.id === record.id ? "bg-white/20 text-white" : "bg-primary-50 text-primary-600")}>
                        <FileText size={20} />
                      </div>
                      {record.prescription?.length > 0 && (
                        <span className={cn("px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-1", 
                          selectedRecord?.id === record.id ? "bg-white/20 text-white" : "bg-emerald-50 text-brand-success border border-emerald-100"
                        )}>
                          <Pill size={12} /> {record.prescription.length} meds
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className={cn("font-bold text-lg leading-tight mb-1", selectedRecord?.id === record.id ? "text-white" : "text-slate-900")}>
                        {record.diagnosis}
                      </h3>
                      <p className={cn("text-sm font-medium mb-1 flex items-center gap-1.5", selectedRecord?.id === record.id ? "text-primary-100" : "text-slate-600")}>
                        <Stethoscope size={14} /> {record.doctorName}
                      </p>
                      <p className={cn("text-xs flex items-center gap-1.5", selectedRecord?.id === record.id ? "text-primary-200" : "text-slate-400")}>
                        <Calendar size={12} /> {formatDate(record.date)}
                      </p>
                    </div>
                  </div>
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Right Column - Details */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {selectedRecord ? (
              <motion.div
                key={selectedRecord.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-0 overflow-hidden border-slate-200/60 shadow-soft relative">
                  {/* Decorative Background */}
                  <div className="absolute top-0 right-0 w-full h-48 bg-gradient-to-br from-primary-50 to-white -z-10" />

                  {/* Header */}
                  <div className="p-8 border-b border-slate-100">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                      <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-4 border border-blue-100">
                          <CheckCircleIcon className="w-4 h-4" /> Consultation Completed
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">{selectedRecord.diagnosis}</h2>
                        <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-600">
                          <span className="flex items-center gap-1.5"><Stethoscope size={16} className="text-primary-500" /> {selectedRecord.doctorName}</span>
                          <span className="text-slate-300">•</span>
                          <span className="flex items-center gap-1.5"><Calendar size={16} className="text-primary-500" /> {formatDate(selectedRecord.date)}</span>
                        </div>
                      </div>
                      <Button variant="secondary" icon={Download}>Download</Button>
                    </div>
                  </div>

                  <div className="p-8 space-y-10">
                    {/* Vitals Section */}
                    {selectedRecord.vitals && (
                      <section>
                        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                          <HeartPulse className="text-red-500 w-5 h-5" /> Patient Vitals
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="bg-gradient-to-br from-rose-50 to-white border border-rose-100 p-5 rounded-2xl flex items-center gap-4">
                            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center">
                              <ThermometerIcon className="w-6 h-6" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-500">Temp</p>
                              <p className="text-xl font-bold text-slate-900">{selectedRecord.vitals.temperature}</p>
                            </div>
                          </div>
                          
                          <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 p-5 rounded-2xl flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                              <Activity className="w-6 h-6" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-500">Blood Pressure</p>
                              <p className="text-xl font-bold text-slate-900">{selectedRecord.vitals.bp}</p>
                            </div>
                          </div>

                          <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 p-5 rounded-2xl flex items-center gap-4">
                            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
                              <HeartPulse className="w-6 h-6" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-500">Pulse Rate</p>
                              <p className="text-xl font-bold text-slate-900">{selectedRecord.vitals.pulse}</p>
                            </div>
                          </div>
                        </div>
                      </section>
                    )}

                    {/* Prescription Section */}
                    {selectedRecord.prescription?.length > 0 && (
                      <section>
                        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                          <Pill className="text-primary-500 w-5 h-5" /> Prescribed Medicines
                        </h3>
                        <div className="border border-slate-200/60 rounded-2xl overflow-hidden bg-white">
                          <table className="w-full text-left">
                            <thead className="bg-slate-50/80 border-b border-slate-200/60">
                              <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Medicine</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Schedule</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Duration</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {selectedRecord.prescription.map((med, idx) => (
                                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                  <td className="px-6 py-4">
                                    <p className="font-bold text-slate-900">{med.medicine}</p>
                                    <p className="text-sm text-slate-500">{med.dosage}</p>
                                  </td>
                                  <td className="px-6 py-4 text-slate-700 font-medium">{med.frequency}</td>
                                  <td className="px-6 py-4"><span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-md text-sm font-medium">{med.duration}</span></td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </section>
                    )}

                    {/* Doctor's Notes */}
                    {selectedRecord.notes && (
                      <section>
                        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                          <Stethoscope className="text-purple-500 w-5 h-5" /> Physician's Notes
                        </h3>
                        <div className="bg-purple-50/50 border border-purple-100 rounded-2xl p-6 relative">
                          <div className="absolute top-0 left-0 w-1.5 h-full bg-purple-400 rounded-l-2xl" />
                          <p className="text-slate-700 leading-relaxed italic">"{selectedRecord.notes}"</p>
                        </div>
                      </section>
                    )}
                  </div>
                </Card>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </motion.main>
  );
}

// Minimal Icons for unsupported lucide variants
function CheckCircleIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function ThermometerIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  );
}
