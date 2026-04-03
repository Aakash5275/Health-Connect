import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Phone, 
  MapPin, 
  Siren,
  AlertCircle,
  Heart,
  Ambulance,
  Hospital,
  Users,
  Clock,
  Navigation,
  ChevronRight,
  Shield,
  BookOpen,
  PhoneCall,
  Activity,
  Droplets,
  Thermometer,
  HeartPulse
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { cn } from '../lib/utils';

export default function EmergencyPage() {
  const [loading, setLoading] = useState(true);
  const [nearbyHospitals, setNearbyHospitals] = useState([]);
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [firstAidTips, setFirstAidTips] = useState([]);

  useEffect(() => {
    fetchEmergencyData();
  }, []);

  const fetchEmergencyData = async () => {
    try {
      // Simulating API calls
      setNearbyHospitals([
        {
          id: 1,
          name: 'Lt Gen Shivdev Singh Civil Hospital',
          distance: '0 km (Nabha)',
          eta: '3 mins',
          beds: 20,
          emergency: true,
          phone: '01765-000001',
          address: 'Guru Nanak Pura, Nabha, 147201',
          rating: 4.7
        },
        {
          id: 2,
          name: 'Sawhney Hospital & Maternity Home',
          distance: '~1-2 km (Nabha)',
          eta: '5 mins',
          beds: 12,
          emergency: true,
          phone: '01765-000002',
          address: 'Munshian Street, Nabha, 147201',
          rating: 4.5
        },
        {
          id: 3,
          name: 'Goyal Healthcare Hospital',
          distance: '~1 km (Nabha)',
          eta: '4 mins',
          beds: 10,
          emergency: true,
          phone: '01765-000003',
          address: 'College Road, Nabha, 147201',
          rating: 4.4
        },
        {
          id: 4,
          name: 'Tara Hospital',
          distance: '~2 km (Nabha)',
          eta: '7 mins',
          beds: 8,
          emergency: true,
          phone: '01765-000004',
          address: 'Circular Road, Nabha, 147201',
          rating: 4.3
        },
        {
          id: 5,
          name: 'Aneja Children & Maternity Hospital',
          distance: '~3 km (Nabha)',
          eta: '9 mins',
          beds: 6,
          emergency: true,
          phone: '01765-000005',
          address: 'Radha Swamy Marg, Nabha, 147201',
          rating: 4.4
        },
        {
          id: 6,
          name: 'Sukhmani Orthopaedic & General Hospital',
          distance: '~2 km (Nabha)',
          eta: '7 mins',
          beds: 10,
          emergency: true,
          phone: '01765-000006',
          address: 'Circular Road, Nabha, 147201',
          rating: 4.2
        },
        {
          id: 7,
          name: 'Bansal Hospital & Laparoscopic Centre',
          distance: '~2 km (Nabha)',
          eta: '7 mins',
          beds: 8,
          emergency: true,
          phone: '01765-000007',
          address: 'Circular Road, Nabha, 147201',
          rating: 4.1
        },
        {
          id: 8,
          name: 'Community Health Centre (CHC)',
          distance: '~16–18 km (Bhawanigarh)',
          eta: '25 mins',
          beds: 15,
          emergency: true,
          phone: '01779-000001',
          address: 'NH 7, Bhawanigarh, 148026',
          rating: 4.0
        },
        {
          id: 9,
          name: 'Gupta Hospital & Heart Centre',
          distance: '~16 km (Bhawanigarh)',
          eta: '23 mins',
          beds: 12,
          emergency: true,
          phone: '01779-000002',
          address: 'NH 64, Bhawanigarh, 148026',
          rating: 4.3
        }
      ]);

      setEmergencyContacts([
        { name: 'National Emergency', number: '112', icon: Phone, color: 'text-red-600', bg: 'bg-red-50' },
        { name: 'Ambulance', number: '102', icon: Ambulance, color: 'text-blue-600', bg: 'bg-blue-50' },
        { name: 'Fire Station', number: '101', icon: Siren, color: 'text-orange-600', bg: 'bg-orange-50' },
        { name: 'Poison Control', number: '1800-123-4567', icon: AlertCircle, color: 'text-purple-600', bg: 'bg-purple-50' }
      ]);

      setFirstAidTips([
        { 
          title: 'Bleeding', 
          tip: 'Apply firm pressure with clean cloth. Elevate if possible.',
          icon: Droplets,
          color: 'text-red-600'
        },
        { 
          title: 'Burns', 
          tip: 'Cool with running water for 10-15 minutes. Do not apply ice.',
          icon: Thermometer,
          color: 'text-orange-600'
        },
        { 
          title: 'Heart Attack', 
          tip: 'Keep person calm. Loosen clothing. Seek immediate help.',
          icon: HeartPulse,
          color: 'text-pink-600'
        },
        { 
          title: 'Choking', 
          tip: 'Perform Heimlich maneuver. Call emergency if unsuccessful.',
          icon: AlertCircle,
          color: 'text-purple-600'
        }
      ]);
    } catch (error) {
      console.error('Error fetching emergency data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGetDirections = (hospitalName, address, e) => {
    if (e) {
      e.stopPropagation();
    }

    const fullAddress = address ? `${hospitalName}, ${address}` : hospitalName;
    const searchQuery = encodeURIComponent(fullAddress);
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${searchQuery}`;

    window.open(googleMapsUrl, '_blank', 'noopener,noreferrer');
  };

  const quickActions = [
    {
      title: 'Call Ambulance',
      description: 'Emergency medical transport',
      icon: Ambulance,
      action: () => window.location.href = 'tel:102',
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      title: 'Find Hospital',
      description: 'Nearby medical facilities',
      icon: Hospital,
      link: '/hospitals',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50'
    },
    {
      title: 'First Aid',
      description: 'Emergency procedures',
      icon: BookOpen,
      link: '/first-aid',
      color: 'text-amber-600',
      bg: 'bg-amber-50'
    },
    {
      title: 'Emergency Contacts',
      description: 'Important numbers',
      icon: Users,
      link: '/emergency-contacts',
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        staggerChildren: 0.1 
      } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.5, 
        ease: "easeOut" 
      } 
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium">Loading emergency services...</p>
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
      {/* Emergency Header */}
      <motion.section variants={itemVariants} className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center">
            <Siren className="w-8 h-8 text-[var(--color-emergency-red)]" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Emergency <span className="text-[var(--color-emergency-red)]">Services</span>
            </h1>
            <p className="text-slate-500 mt-1 text-lg">
              Immediate medical assistance when every second counts.
            </p>
          </div>
        </div>
      </motion.section>

      {/* SOS Emergency Banner */}
      <motion.section variants={itemVariants} className="mb-10">
        <div className="bg-gradient-to-r from-red-600 to-red-500 rounded-3xl p-8 text-white shadow-premium relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/3 animate-pulse" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-[40px] translate-y-1/3 -translate-x-1/4" />
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border-2 border-white/30 animate-pulse">
                <PhoneCall className="w-10 h-10 text-white" />
              </div>
              <div>
                <p className="text-white/80 text-sm font-semibold tracking-wide uppercase mb-2">Immediate Assistance</p>
                <h2 className="text-3xl md:text-4xl font-bold mb-2">Need Help Right Now?</h2>
                <p className="text-white/90 text-lg">Press the SOS button for instant emergency response</p>
              </div>
            </div>
            
            <a href="tel:112" className="block">
              <Button 
                variant="danger" 
                className="h-20 px-10 text-2xl font-black shadow-2xl shadow-red-900/50 hover:scale-105 transition-transform bg-white text-red-600 hover:bg-white/90"
              >
                SOS
              </Button>
            </a>
          </div>
        </div>
      </motion.section>

      {/* Quick Actions Grid */}
      <motion.section variants={itemVariants} className="mb-12">
        <h2 className="section-title">Emergency Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {quickActions.map((action) => (
            action.link ? (
              <Link key={action.title} to={action.link}>
                <Card hoverEffect className="h-full flex flex-col group p-6 border-transparent hover:border-slate-200 transition-all">
                  <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110", action.bg, action.color)}>
                    <action.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{action.title}</h3>
                  <p className="text-slate-500 text-sm">{action.description}</p>
                </Card>
              </Link>
            ) : (
              <button key={action.title} onClick={action.action} className="text-left">
                <Card hoverEffect className="h-full flex flex-col group p-6 border-transparent hover:border-slate-200 transition-all w-full">
                  <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110", action.bg, action.color)}>
                    <action.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{action.title}</h3>
                  <p className="text-slate-500 text-sm">{action.description}</p>
                </Card>
              </button>
            )
          ))}
        </div>
      </motion.section>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Nearby Hospitals */}
        <motion.section variants={itemVariants} className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="section-title !mb-0">Nearby Hospitals</h2>
            <Link 
              to="/hospitals" 
              className="text-primary-600 hover:text-primary-700 font-semibold text-sm flex items-center gap-1 group bg-primary-50 px-3 py-1.5 rounded-full"
            >
              View all
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {nearbyHospitals.length > 0 ? (
            <div className="space-y-4">
              {nearbyHospitals.map((hospital) => (
                <Card key={hospital.id} className="p-6 hover:shadow-lg transition-all border-l-4 border-l-red-500">
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                        <Hospital className="w-7 h-7 text-[var(--color-emergency-red)]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-1">{hospital.name}</h3>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 mb-2">
                          <span className="flex items-center gap-1">
                            <MapPin size={14} /> {hospital.distance}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={14} /> ETA: {hospital.eta}
                          </span>
                          <span className="flex items-center gap-1 text-emerald-600">
                            <Heart size={14} /> {hospital.beds} beds available
                          </span>
                        </div>
                        <p className="text-sm text-slate-400">{hospital.address}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 md:flex-col lg:flex-row">
                      <a href={`tel:${hospital.phone}`}>
                        <Button variant="outline" size="sm" className="w-full md:w-auto gap-2">
                          <Phone size={16} />
                          Call
                        </Button>
                      </a>
                      <Button
                        variant="primary"
                        size="sm"
                        className="w-full md:w-auto gap-2"
                        onClick={(e) => handleGetDirections(hospital.name, hospital.address, e)}
                      >
                        <Navigation size={16} />
                        Directions
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="text-center py-16 flex flex-col items-center justify-center border-dashed">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <Hospital className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No Hospitals Found</h3>
              <p className="text-slate-500 mb-6 max-w-sm">
                We couldn't find any hospitals near your location. Try enabling location services.
              </p>
              <Button>Refresh Location</Button>
            </Card>
          )}
        </motion.section>

        {/* Sidebar - Emergency Contacts & First Aid */}
        <motion.section variants={itemVariants} className="lg:col-span-1 space-y-6">
          {/* Emergency Contacts */}
          <Card className="p-6 border-red-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Phone className="w-5 h-5 text-[var(--color-emergency-red)]" />
              Emergency Contacts
            </h3>
            <div className="space-y-3">
              {emergencyContacts.map((contact, index) => (
                <a
                  key={index}
                  href={`tel:${contact.number}`}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", contact.bg)}>
                      <contact.icon className={cn("w-5 h-5", contact.color)} />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{contact.name}</p>
                      <p className="text-sm text-slate-500">{contact.number}</p>
                    </div>
                  </div>
                  <PhoneCall size={18} className="text-slate-400 group-hover:text-[var(--color-emergency-red)] transition-colors" />
                </a>
              ))}
            </div>
          </Card>

          {/* First Aid Tips */}
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-white border-blue-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              First Aid Tips
            </h3>
            <div className="space-y-4">
              {firstAidTips.map((tip, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className={cn("w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-white", tip.color)}>
                    <tip.icon size={16} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{tip.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{tip.tip}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link 
              to="/first-aid" 
              className="mt-4 text-sm text-blue-600 font-medium flex items-center gap-1 hover:gap-2 transition-all"
            >
              View all first aid guides
              <ChevronRight size={14} />
            </Link>
          </Card>

          {/* Emergency Preparedness Card */}
          <Card className="bg-gradient-to-br from-red-50 to-white border-red-100 p-6 text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-100/50 rounded-full blur-3xl" />
            <div className="w-16 h-16 bg-[var(--color-emergency-red)]/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <AlertCircle className="w-8 h-8 text-[var(--color-emergency-red)]" />
            </div>
            <h3 className="text-xl font-bold text-red-900 mb-2">Emergency Preparedness</h3>
            <p className="text-red-700/80 mb-6 text-sm">
              Keep an emergency kit ready. Store important medical information and emergency contacts.
            </p>
            <Link to="/emergency-kit">
              <Button variant="danger" className="w-full shadow-lg shadow-red-500/30">
                View Emergency Kit
              </Button>
            </Link>
          </Card>
        </motion.section>
      </div>

      {/* Emergency Instructions Banner */}
      <motion.section variants={itemVariants} className="mt-8">
        <Card className="bg-slate-50 p-6 border-slate-200">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">In case of emergency:</h4>
                <p className="text-sm text-slate-500 mt-1">
                  Stay calm. Call emergency services immediately. Provide your exact location and describe the situation clearly.
                </p>
              </div>
            </div>
            <div className="flex gap-2 md:ml-auto">
              <a href="tel:112">
                <Button variant="danger" size="sm" className="gap-2">
                  <Phone size={16} />
                  Call 112
                </Button>
              </a>
              <Button variant="outline" size="sm" className="gap-2">
                Share Location
                <Navigation size={16} />
              </Button>
            </div>
          </div>
        </Card>
      </motion.section>
    </motion.main>
  );
}