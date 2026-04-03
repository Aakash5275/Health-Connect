import { useState } from 'react';
import { aiAPI } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { 
  Activity, Search, AlertTriangle, 
  Info, Sparkles, Plus, ArrowRight, RotateCcw
} from 'lucide-react';

export default function SymptomCheckerComponent() {
  const [symptoms, setSymptoms] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const commonSymptoms = [
    'Fever', 'Dry Cough', 'Headache', 'Muscle Ache',
    'Fatigue', 'Nausea', 'Dizziness', 'Sore Throat'
  ];

  const handleAddSymptom = (symptom) => {
    if (symptoms.trim()) {
      if (!symptoms.toLowerCase().includes(symptom.toLowerCase())) {
        setSymptoms(prev => `${prev}, ${symptom}`);
      }
    } else {
      setSymptoms(symptom);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!symptoms.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    setTimeout(async () => {
      try {
        const response = await aiAPI.checkSymptoms(symptoms);
        // ✅ analysis ko directly destructure karke store karo
        const { analysis, disclaimer, symptoms: sym } = response.data;
        setResult({ analysis, disclaimer, symptoms: sym });
      } catch (err) {
        console.error('API Error:', err);
        setResult({
          analysis: {
            possibleConditions: ['Viral Infection', 'Seasonal Flu'],
            severity: 'mild',
            advice: ['Rest and stay hydrated', 'Monitor your temperature', 'Take paracetamol if needed'],
            whenToSeeDoctor: ['Fever lasts more than 3 days', 'Difficulty breathing', 'Symptoms worsen']
          },
          disclaimer: 'Demo response. This is AI-generated advice and should not replace professional medical consultation.'
        });
      } finally {
        setLoading(false);
      }
    }, 1500);
  };

  const handleClear = () => {
    setSymptoms('');
    setResult(null);
    setError(null);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 }
  };

  // ✅ Severity ke hisaab se color decide karta hai
  const getSeverityStyle = (severity) => {
    if (severity === 'emergency') return 'bg-red-100 text-red-700 border border-red-200';
    if (severity === 'moderate') return 'bg-amber-100 text-amber-700 border border-amber-200';
    return 'bg-green-100 text-green-700 border border-green-200';
  };

  return (
    <motion.div
      className="max-w-3xl mx-auto space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="text-center mb-8">
        <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Activity size={32} />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">AI Symptom Checker</h1>
        <p className="text-slate-500 mt-2 text-lg">
          Describe how you are feeling, and our AI will provide instant health guidance.
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {!result && (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            className="space-y-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
          >
            <Card className="p-6 sm:p-8 bg-gradient-to-br from-white to-slate-50 border-slate-200/60 shadow-premium">
              <div className="space-y-6">
                <div>
                  <label className="label flex items-center gap-2 text-slate-700">
                    <Sparkles className="w-4 h-4 text-primary-500" />
                    What symptoms are you experiencing?
                  </label>
                  <textarea
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    placeholder="e.g., I have a mild fever, dry cough, and a headache since yesterday..."
                    className="input-field min-h-[140px] resize-none text-lg p-4 bg-white"
                    rows={4}
                  />
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-500 mb-3 uppercase tracking-wider">Common Symptoms</p>
                  <div className="flex flex-wrap gap-2">
                    {commonSymptoms.map((symptom) => (
                      <button
                        key={symptom}
                        type="button"
                        onClick={() => handleAddSymptom(symptom)}
                        className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-full text-sm font-medium hover:border-primary-300 hover:text-primary-700 hover:bg-primary-50 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" /> {symptom}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-100">
                  <Button
                    type="submit"
                    disabled={!symptoms.trim() || loading}
                    className="flex-1 h-14 text-lg"
                  >
                    {loading
                      ? 'Analyzing Symptoms...'
                      : <><Search className="w-5 h-5 mr-2" /> Analyze Symptoms</>
                    }
                  </Button>

                  {symptoms && (
                    <Button
                      type="button"
                      onClick={handleClear}
                      variant="ghost"
                      className="sm:w-auto px-6 h-14"
                    >
                      Clear
                    </Button>
                  )}
                </div>
              </div>
            </Card>

            {!loading && (
              <motion.div variants={itemVariants} className="mt-8">
                <Card className="bg-primary-50/50 border-primary-100 p-6 flex flex-col sm:flex-row items-start gap-4">
                  <div className="w-12 h-12 bg-primary-100/80 rounded-2xl flex flex-shrink-0 items-center justify-center">
                    <Info className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-primary-900 mb-1">How it works</h4>
                    <p className="text-primary-700/80 text-sm leading-relaxed">
                      Our AI model analyzes your symptoms against a vast medical database to suggest potential causes and next steps.
                      This tool is designed to help you prepare for a consultation, not to replace professional medical advice.
                    </p>
                  </div>
                </Card>
              </motion.div>
            )}
          </motion.form>
        )}

        {/* ✅ Results Section */}
        {result && (
          <motion.div
            key="results"
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
          >
            <Card className="p-0 overflow-hidden shadow-premium border-slate-200/60">
              <div className="bg-gradient-to-r from-primary-600 to-blue-600 p-6 sm:p-8 text-white relative">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-[30px] -translate-y-1/2 translate-x-1/3" />
                <h3 className="text-2xl font-bold flex items-center gap-3 relative z-10">
                  <Activity className="w-8 h-8 opacity-80" />
                  Analysis Complete
                </h3>
                <p className="mt-2 text-primary-100">Based on your reported symptoms.</p>
              </div>

              <div className="p-6 sm:p-8 space-y-6">

                {/* ✅ Severity Badge */}
                {result.analysis?.severity && (
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold capitalize ${getSeverityStyle(result.analysis.severity)}`}>
                    <AlertTriangle className="w-4 h-4" />
                    Severity: {result.analysis.severity}
                  </div>
                )}

                {/* ✅ Possible Conditions */}
                {result.analysis?.possibleConditions?.length > 0 && (
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    <h5 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary-500" /> Possible Conditions
                    </h5>
                    <ul className="space-y-2">
                      {result.analysis.possibleConditions.map((c, i) => (
                        <li key={i} className="flex items-center gap-2 text-slate-700">
                          <span className="w-2 h-2 rounded-full bg-primary-500 shrink-0" />
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* ✅ Advice */}
                {result.analysis?.advice?.length > 0 && (
                  <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100">
                    <h5 className="font-semibold text-blue-900 mb-3">Recommended Advice</h5>
                    <ul className="space-y-2">
                      {result.analysis.advice.map((a, i) => (
                        <li key={i} className="flex items-center gap-2 text-blue-800 text-sm">
                          <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0" />
                          {a}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* ✅ When to See Doctor */}
                {result.analysis?.whenToSeeDoctor?.length > 0 && (
                  <div className="bg-red-50 p-5 rounded-2xl border border-red-100">
                    <h5 className="font-semibold text-red-900 mb-3">See a Doctor If</h5>
                    <ul className="space-y-2">
                      {result.analysis.whenToSeeDoctor.map((w, i) => (
                        <li key={i} className="flex items-center gap-2 text-red-800 text-sm">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                          {w}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* ✅ Disclaimer */}
                <div className="p-5 bg-amber-50 border border-amber-200/60 rounded-2xl flex items-start gap-4">
                  <div className="bg-amber-100/80 p-2 rounded-xl shrink-0">
                    <AlertTriangle className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-amber-900 mb-1">Medical Disclaimer</h4>
                    <p className="text-sm text-amber-800 leading-relaxed">
                      {result.disclaimer || 'This is AI-generated advice and should not replace professional medical consultation.'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-100">
                  <Button
                    asChild
                    className="flex-1 h-14 text-lg bg-slate-900 hover:bg-slate-800"
                  >
                    <Link to="/book-appointment">
                    Consult a Doctor Now <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  </Button>
                  <Button
                    onClick={handleClear}
                    variant="outline"
                    className="sm:w-auto h-14 px-8"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" /> Start Over
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}