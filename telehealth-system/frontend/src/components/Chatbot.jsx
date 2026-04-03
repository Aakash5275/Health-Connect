import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, HeartPulse, Stethoscope, Pill, AlertCircle } from 'lucide-react';

const SwasthyaBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Namaste! I am your Swasthya Assistant. How can I help you with our TeleHealth services today?", sender: 'bot' }
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Frequently Asked Questions Logic
  const botLogic = (userInput) => {
    const query = userInput.toLowerCase();
    
    if (query.includes("video") || query.includes("call") || query.includes("consult") || query.includes("schedule") || query.includes("meeting") || query.includes("book") || query.includes("appointment")) {
      return "You can schedule a meeting, book an appointment, or start a Video Consultation by going to the 'Consult Doctor' tab. We use Jitsi Meet for HD, encrypted calls!";
    } 
    if (query.includes("language") || query.includes("translate") || query.includes("hindi") || query.includes("marathi") || query.includes("urdu") || query.includes("english")) {
      return "You can easily change the language of the entire website! Just use the dropdown menu in the top Navigation Bar. We support English, Hindi, Marathi, and Urdu.";
    }
    if (query.includes("medicine") || query.includes("pharmacy") || query.includes("stock")) {
      return "Check the 'Medicines' tab to search for availability. You can see real-time stock at local pharmacies like Sharma Pharmacy.";
    } 
    if (query.includes("emergency") || query.includes("serious")) {
      return "🚨 If this is a life-threatening emergency, please call 102 immediately. You can also use our 'Emergency' tab to find the nearest hospital.";
    } 
    if (query.includes("record") || query.includes("report") || query.includes("prescription")) {
      return "Your Digital Health Records are stored securely. You can view past prescriptions and doctor notes in the 'Health Records' section.";
    }
    if (query.includes("symptom") || query.includes("ai") || query.includes("check")) {
      return "Our AI Symptom Checker provides a preliminary assessment. Go to the 'AI Symptoms' tab and describe how you feel.";
    }
    if (query === "hi" || query === "hello" || query.includes("namaste") || query === "hey") {
      return "Namaste! I am your Swasthya Assistant. How can I help you today? I can answer questions about Appointments, Medicines, or Video Consultations.";
    }
    if (query.includes("cost") || query.includes("fee") || query.includes("pay") || query.includes("price") || query.includes("free")) {
      return "Many of our basic services and AI checkups are free! For specialized doctor consultations, the fee depends on the doctor's experience. You will see the consultation fee before booking an appointment.";
    }
    if (query.includes("time") || query.includes("hour") || query.includes("open") || query.includes("close")) {
      return "Our platform is accessible 24/7. However, doctor availability for video calls depends on their individual schedules. You can check available time slots in the 'Consult Doctor' section.";
    }
    if (query.includes("login") || query.includes("sign up") || query.includes("register") || query.includes("account") || query.includes("password")) {
      return "To use features like Video Calls and Health Records, you must create a Patient Account. Click 'Patient Login' in the top right corner. If you forgot your password, you can reset it on the login page.";
    }
    if (query.includes("doctor") || query.includes("specialist") || query.includes("gynecologist") || query.includes("pediatrician") || query.includes("physician")) {
      return "We have a variety of verified specialists including General Physicians, Pediatricians, and Gynecologists available. Please navigate to 'Consult Doctor' to browse our specialists.";
    }
    if (query.includes("privacy") || query.includes("secure") || query.includes("safe") || query.includes("data")) {
      return "Your privacy is our top priority! All health records are securely stored and encrypted. Video calls are strictly confidential and use encrypted WebRTC connections.";
    }
    if (query.includes("not working") || query.includes("broken") || query.includes("bug") || query.includes("support")) {
      return "I'm sorry you are experiencing issues! Try refreshing the page or checking your internet connection. For technical support, please dial our toll-free helpdesk.";
    }
    
    return "I'm sorry, I didn't quite get that. You can ask me about: Appointments, Video Calls, Medicines, Costs, Hours, Accounts, Emergency help, Changing Languages, or Health Records.";
  };

  const handleSend = (text = input) => {
    if (!text.trim()) return;
    
    const userMsg = { id: Date.now(), text, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput("");

    // Simulate bot thinking
    setTimeout(() => {
      const response = botLogic(text);
      setMessages(prev => [...prev, { id: Date.now() + 1, text: response, sender: 'bot' }]);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[1000] font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="bg-white w-[350px] sm:w-[400px] h-[500px] rounded-3xl shadow-2xl border border-slate-200 flex flex-col mb-4 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-white">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-xl">
                    <HeartPulse size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">Swasthya Assistant</h3>
                    <p className="text-[10px] text-blue-100 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span> Online | Rural Access
                    </p>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Chat Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                    m.sender === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-none shadow-md' 
                      : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none shadow-sm'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick FAQ Buttons */}
            <div className="p-3 bg-white border-t border-slate-100">
              <p className="text-[10px] text-slate-400 font-bold uppercase mb-2 ml-1">Common Questions</p>
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {[
                  { label: 'Video Call', icon: Stethoscope },
                  { label: 'Medicines', icon: Pill },
                  { label: 'Emergency', icon: AlertCircle },
                  { label: 'Records', icon: HeartPulse }
                ].map((item) => (
                  <button 
                    key={item.label}
                    onClick={() => handleSend(item.label)}
                    className="flex items-center gap-1 whitespace-nowrap px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-full text-[11px] font-semibold transition-colors border border-blue-100"
                  >
                    <item.icon size={12} />
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Area */}
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="p-3 bg-white border-t border-slate-100 flex gap-2"
            >
              <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button type="submit" className="bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700 transition-colors shadow-md">
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-blue-600 rounded-2xl shadow-xl shadow-blue-500/30 flex items-center justify-center text-white hover:bg-blue-700 transition-all duration-300 relative group"
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-white rounded-full"></span>
        )}
      </motion.button>
    </div>
  );
};

export default SwasthyaBot;
