import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { cn } from '../lib/utils';
import { 
  Video, Activity, FileText, Pill, MapPin, AlertCircle, 
  ChevronRight, Shield, Award, HeartHandshake, Phone, Globe, Star, Users, HeartPulse
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const features = [
    { icon: Video, title: "Consult Doctor", desc: "Live video & audio calls with certified professionals.", color: "text-blue-600", bg: "bg-blue-50 border border-blue-100" },
    { icon: Activity, title: "AI Symptom Checker", desc: "Get instant AI-driven health assessments.", color: "text-purple-600", bg: "bg-purple-50 border border-purple-100" },
    { icon: FileText, title: "Health Records", desc: "Securely store and access your medical history.", color: "text-emerald-600", bg: "bg-emerald-50 border border-emerald-100" },
    { icon: Pill, title: "Medicine Finder", desc: "Locate prescribed medicines at nearby pharmacies.", color: "text-amber-600", bg: "bg-amber-50 border border-amber-100" },
    { icon: MapPin, title: "Nearby Centers", desc: "Find government approved rural health centers.", color: "text-indigo-600", bg: "bg-indigo-50 border border-indigo-100" },
    { icon: AlertCircle, title: "Emergency Help", desc: "One-tap access to ambulance and urgent care.", color: "text-red-600", bg: "bg-red-50 border border-red-100" }
  ];

  const steps = [
    { number: "01", title: "Create an Account", desc: "Sign up securely using just your mobile number or email." },
    { number: "02", title: "Check Symptoms or Book", desc: "Use our AI tool to check symptoms or directly schedule a doctor." },
    { number: "03", title: "Consult Online", desc: "Join a secure video or audio call with a certified medical professional." },
    { number: "04", title: "Get Prescription", desc: "Receive your digital prescription and find medicines locally." }
  ];

  return (
    <div className="min-h-screen bg-white overflow-hidden relative">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-primary-50/80 to-transparent -z-10" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-100/40 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-100/40 rounded-full blur-[100px] -z-10 -translate-x-1/2 translate-y-1/2 pointer-events-none" />

      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-32 pb-20 max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          
          {/* Text Content */}
          <motion.div 
            className="flex-1 text-center lg:text-left"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 border border-primary-100 text-primary-700 text-sm font-medium mb-6 animate-fade-in shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
              </span>
              Now serving thousands of villages
            </motion.div>
            
            <motion.h1 variants={fadeIn} className="text-5xl lg:text-7xl font-extrabold text-slate-900 tracking-tight mb-6 leading-[1.1]">
              Healthcare for <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-600 drop-shadow-sm">Every Village</span>
            </motion.h1>
            
            <motion.p variants={fadeIn} className="text-lg text-slate-600 mb-8 max-w-xl mx-auto lg:mx-0 text-balance leading-relaxed">
              SwasthyaConnect bridges the gap between rural communities and premium healthcare. Get instant access to certified doctors, AI diagnostics, and digital prescriptions—even on low bandwidth networks.
            </motion.p>
            
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" onClick={() => navigate('/login')} className="group h-14 px-8 text-lg shadow-premium hover:shadow-lg hover:-translate-y-0.5 transition-all">
                Start Consultation
                <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/symptom-checker')} className="h-14 px-8 text-lg border-slate-200 hover:bg-slate-50 text-slate-700">
                Check Symptoms
              </Button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div variants={fadeIn} className="mt-12 flex flex-wrap items-center justify-center lg:justify-start gap-8 border-t border-slate-100 pt-6">
              <div className="flex items-center gap-2.5">
                <Shield className="h-5 w-5 text-emerald-600" />
                <span className="text-sm font-medium text-slate-600">HIPAA Compliant</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Award className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-slate-600">Certified Doctors</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Globe className="h-5 w-5 text-indigo-600" />
                <span className="text-sm font-medium text-slate-600">Works on 2G/3G</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Hero Visual showing floating cards */}
          <motion.div 
            className="flex-1 relative w-full h-[550px] hidden lg:block"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Main Video Call Card */}
            <motion.div 
              animate={{ y: [0, -15, 0] }} 
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="absolute top-10 right-10 w-80 bg-white/90 backdrop-blur-xl p-4 rounded-3xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-slate-100 z-20"
            >
              <div className="aspect-video bg-slate-900 rounded-2xl relative overflow-hidden mb-4 shadow-inner">
                <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=600&h=400" alt="Doctor Consultation" className="object-cover w-full h-full opacity-80 mix-blend-screen" />
                <div className="absolute inset-0 bg-blue-500/5 mix-blend-overlay"></div>
                <div className="absolute top-3 left-3 bg-black/40 backdrop-blur px-2 py-1 rounded-md border border-white/20 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_#ef4444]" />
                  <span className="text-[10px] font-bold text-white tracking-widest">LIVE</span>
                </div>
                <div className="absolute bottom-3 left-3 flex gap-2">
                  <div className="bg-red-500 hover:bg-red-600 p-2 rounded-full cursor-pointer transition-colors backdrop-blur-md shadow-sm"><Video className="h-4 w-4 text-white" /></div>
                </div>
              </div>
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-primary-600 font-bold border border-blue-100 shadow-sm">Dr</div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">Dr. Smriti Pandey </p>
                    <p className="text-xs text-emerald-600 font-medium">Ongoing session</p>
                  </div>
                </div>
                <Phone className="w-5 h-5 text-emerald-500" />
              </div>
            </motion.div>

            {/* AI Checker Card */}
            <motion.div 
              animate={{ y: [0, 15, 0] }} 
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-20 left-4 w-64 bg-white/95 backdrop-blur-xl p-5 rounded-3xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-slate-100 z-30"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-purple-50 rounded-lg border border-purple-100"><Activity className="h-4 w-4 text-purple-600" /></div>
                  <span className="font-semibold text-sm text-slate-800">AI Triage</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-1 bg-emerald-50 text-emerald-600 rounded-md border border-emerald-100 uppercase tracking-wider">Low Risk</span>
              </div>
              <p className="text-sm text-slate-600 mb-4 font-medium leading-relaxed">Mild fever and headache reported.</p>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner border border-slate-200/50">
                <motion.div initial={{ width: 0 }} animate={{ width: "35%" }} transition={{ duration: 1.5, delay: 0.5 }} className="h-full bg-emerald-500 rounded-full" />
              </div>
            </motion.div>

            {/* Prescription Prompt Card */}
            <motion.div 
               animate={{ y: [0, -10, 0] }} 
               transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 0.5 }}
               className="absolute top-1/2 -right-6 w-48 bg-white/90 backdrop-blur-xl p-4 rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-slate-100 z-10"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-amber-50 rounded-md border border-amber-100"><Pill className="w-4 h-4 text-amber-600" /></div>
                <span className="text-sm font-bold text-slate-800 tracking-wide">Rx Ready</span>
              </div>
              <div className="space-y-2">
                <div className="h-1.5 bg-slate-100 rounded-full w-full relative overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-200 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full w-2/3 relative overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-200 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                </div>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* Overview / Impact Stats Section with horizontal scroll */}
      <section className="bg-slate-50 py-16 relative overflow-hidden border-y border-slate-100">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] mix-blend-overlay"></div>
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="mb-8 flex items-center justify-between gap-4">
            <h2 className="text-xl md:text-2xl font-semibold text-slate-800 tracking-tight">
              Real impact across rural communities
            </h2>
            <span className="hidden md:inline-flex text-[11px] uppercase tracking-[0.2em] text-slate-500 font-medium">
              Scroll to explore
            </span>
          </div>

          <motion.div
            className="flex md:grid md:grid-cols-4 gap-6 md:gap-8 overflow-x-auto md:overflow-visible pb-2 snap-x snap-mandatory hide-scrollbars"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
          >
            {[
              { value: '12k+', label: 'Remote consultations completed' },
              { value: '750+', label: 'Verified rural-first doctors' },
              { value: '120+', label: 'PHCs & health centres connected' },
              { value: '92%', label: 'Patients report faster care access' },
              { value: '< 3 min', label: 'Median wait time to connect' },
              { value: '8+', label: 'Indian languages supported' },
            ].map((stat, idx) => (
              <motion.div
                key={stat.label}
                variants={fadeIn}
                className="min-w-[200px] md:min-w-0 snap-center"
              >
                <div className="h-full text-center md:text-left border border-slate-200/60 rounded-2xl px-6 py-6 bg-white shadow-sm hover:shadow-md transition-shadow">
                  <p className="text-xs font-bold tracking-[0.18em] text-primary-600 uppercase mb-2">
                    {idx === 0 && 'PATIENTS'}
                    {idx === 1 && 'DOCTORS'}
                    {idx === 2 && 'INFRASTRUCTURE'}
                    {idx === 3 && 'OUTCOMES'}
                    {idx === 4 && 'SPEED'}
                    {idx === 5 && 'ACCESS'}
                  </p>
                  <h4 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-2">
                    {stat.value}
                  </h4>
                  <p className="text-slate-600 font-medium text-sm leading-relaxed">
                    {stat.label}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">How SwasthyaConnect Works</h2>
            <p className="text-lg text-slate-600">A seamless, guided health experience tailored for both patients and healthcare providers.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 relative">
            {steps.map((step, idx) => (
              <div key={idx} className="relative group">
                {/* Connection line between steps (desktop only) */}
                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute top-[2rem] left-1/2 w-full h-[2px] bg-slate-100 group-hover:bg-primary-200 transition-colors" />
                )}
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-slate-50 shadow-sm border border-slate-100 flex items-center justify-center text-xl font-bold text-primary-600 mb-6 group-hover:-translate-y-2 transition-transform duration-300 group-hover:shadow-[0_10px_30px_-10px_rgba(0,87,255,0.2)] group-hover:border-primary-200">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                  <p className="text-slate-600 leading-relaxed text-balance">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-slate-50 py-24 relative z-10 border-y border-slate-100">
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Comprehensive Care Ecosystem</h2>
            <p className="text-lg text-slate-600">Everything you need to confidently manage local healthcare from a single dashboard.</p>
          </div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {features.map((feature, idx) => (
              <motion.div key={idx} variants={fadeIn} className="h-full">
                <Card hoverEffect className="h-full border-slate-200/60 bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:border-slate-200 group">
                  <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-inner relative overflow-hidden", feature.bg, feature.color)}>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <feature.icon className="h-7 w-7 relative z-10" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Portals Showcase */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="text-left text-slate-900">
              <h2 className="text-3xl lg:text-4xl font-extrabold mb-6 tracking-tight text-slate-900">Built for Patients & Healthcare Providers</h2>
              <p className="text-slate-600 text-lg mb-10 leading-relaxed max-w-lg">
                Dedicated interfaces cater to unique workflows. Whether you're seeking care or providing it, SwasthyaConnect adapts to your needs seamlessly.
              </p>

              <div className="space-y-8">
                <div className="flex gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 shadow-sm">
                    <Users className="text-primary-600 w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 mb-2">Patient Portal</h4>
                    <p className="text-slate-600 leading-relaxed">Schedule consultations, view your health records, use AI symptoms checker, and order medications securely.</p>
                  </div>
                </div>
                <div className="border-t border-slate-100" />
                <div className="flex gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 shadow-sm">
                    <Shield className="text-emerald-600 w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 mb-2">Doctor Portal</h4>
                    <p className="text-slate-600 leading-relaxed">Manage your secure patient queue, update digital records immediately after calls, and handle e-prescriptions.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-100/40 to-slate-50/20 z-10 rounded-3xl" />
              <img src="https://images.unsplash.com/photo-1576091160550-2173ff9e5ee5?auto=format&fit=crop&q=80&w=800&h=600" alt="Doctor assisting patient" className="rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-200 aspect-[4/3] object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-slate-50 border-y border-slate-100 relative z-10">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <div className="mb-8 flex justify-center text-amber-500 gap-1.5 drop-shadow-sm">
            <Star className="fill-current w-6 h-6" /><Star className="fill-current w-6 h-6" /><Star className="fill-current w-6 h-6" /><Star className="fill-current w-6 h-6" /><Star className="fill-current w-6 h-6" />
          </div>
          <h3 className="text-2xl md:text-4xl font-extrabold text-slate-800 mb-10 leading-relaxed">
            "SwasthyaConnect completely changed how we handle emergencies. A video consultation with a certified pediatrician saved us an overnight trip to the city hospital."
          </h3>
          <div className="flex items-center justify-center gap-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 border-2 border-primary-100 overflow-hidden shadow-sm">
              <img src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=150&h=150" alt="User" className="transition-all" />
            </div>
            <div className="text-left">
              <h5 className="font-bold text-slate-900 text-lg">Ramesh Kumar</h5>
              <p className="text-sm font-medium text-slate-500">Village Resident, Maharashtra</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-50/80 rounded-full blur-[100px] -z-10 translate-x-1/3 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-50/80 rounded-full blur-[80px] -z-10 -translate-x-1/3 translate-y-1/2" />
        <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">Ready to prioritize your health?</h2>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
            Join thousands of patients and doctors who are transforming the future of remote healthcare today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="h-14 px-10 text-lg shadow-premium hover:shadow-xl hover:-translate-y-0.5 transition-all" onClick={() => navigate('/login')}>
              Get Started for Free
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-10 text-lg border-slate-200 hover:bg-slate-50 text-slate-700" onClick={() => navigate('/symptom-checker')}>
              Try Features
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 text-slate-500 py-12 border-t border-slate-200">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8 pb-8 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-sm">
                <HeartPulse className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">SwasthyaConnect</span>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm font-medium">
              <a href="#" className="hover:text-primary-600 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary-600 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-primary-600 transition-colors">Help Center</a>
              <a href="#" className="hover:text-primary-600 transition-colors">Contact Us</a>
            </div>
          </div>
          <div className="text-center text-sm">
            <p>© 2026 SwasthyaConnect Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}