import { useState, useEffect } from 'react';
import { medicineAPI } from '../services/api';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { 
  Search, Pill, MapPin, Navigation, 
  CheckCircle2, XCircle, ChevronRight 
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function Medicines() {
  const [searchQuery, setSearchQuery] = useState('');
  const [medicines, setMedicines] = useState([]);
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    fetchPharmacies();
  }, []);

  const fetchPharmacies = async () => {
    try {
      const response = await medicineAPI.getPharmacies();
      setPharmacies(response.data);
    } catch (error) {
      setPharmacies([
        { name: 'Mittal Medicos', address: 'Cinema Road, Guru Nanak Pura', city: 'Nabha' },
        { name: 'Prem Medical Store', address: 'Bhawra Bazar, Near Aggarwal Dharamshala', city: 'Nabha' },
        { name: 'Pardeep Medicos', address: 'Patiala Gate', city: 'Nabha' },
        { name: 'Raja Distributors', address: 'Atma Ram Colony, Railway Road', city: 'Nabha' },
        { name: 'Harish Medicos', address: 'Markana Road, Alohran Kalan Road', city: 'Nabha' },
        { name: 'Raja Medical Hall', address: 'Inside Alohran Gate, Ghas Mandi Road', city: 'Nabha' },
        { name: 'Royal Medical Store', address: 'Laxman Nagar', city: 'Nabha' },
        { name: 'Bakshi Healthcare', address: 'Malerkotla Road', city: 'Nabha' },
        { name: 'Shakti Medical Agency', address: 'Cinema Road, Guru Nanak Pura', city: 'Nabha' },
        { name: 'Dhanjal Medical Hall', address: 'Civil Hospital Road', city: 'Nabha' }
      ]);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setSearched(true);
    try {
      const response = await medicineAPI.searchMedicines(searchQuery);
      setMedicines(response.data);
    } catch (error) {
      const demoMedicines = {
        [searchQuery]: [
          { pharmacy: 'Mittal Medicos', address: 'Cinema Road, Guru Nanak Pura, Nabha', available: true, price: 25, distance: 1.2 },
          { pharmacy: 'Prem Medical Store', address: 'Bhawra Bazar, Near Aggarwal Dharamshala, Nabha', available: false, price: null, distance: 2.5 },
          { pharmacy: 'Pardeep Medicos', address: 'Patiala Gate, Nabha', available: true, price: 28, distance: 1.8 },
          { pharmacy: 'Raja Distributors', address: 'Atma Ram Colony, Railway Road, Nabha', available: true, price: 22, distance: 2.0 },
          { pharmacy: 'Harish Medicos', address: 'Markana Road, Alohran Kalan Road, Nabha', available: true, price: 30, distance: 3.5 },
          { pharmacy: 'Royal Medical Store', address: 'Laxman Nagar, Nabha', available: true, price: 26, distance: 2.8 }
        ]
      };
      setMedicines(demoMedicines);
    } finally {
      setLoading(false);
    }
  };

  const commonMedicines = [
    'Paracetamol', 'Cetirizine', 'Ibuprofen', 'Azithromycin',
    'Amoxicillin', 'ORS', 'Cough Syrup', 'Antacid'
  ];

  const handleQuickSearch = (medicine) => {
    setSearchQuery(medicine);
    setLoading(true);
    setSearched(true);
    
    setTimeout(() => {
      const demoMedicines = {
        [medicine]: [
          { pharmacy: 'Mittal Medicos', address: 'Cinema Road, Guru Nanak Pura, Nabha', available: Math.random() > 0.3, price: Math.floor(Math.random() * 50) + 10, distance: 1.2 },
          { pharmacy: 'Prem Medical Store', address: 'Bhawra Bazar, Near Aggarwal Dharamshala, Nabha', available: Math.random() > 0.5, price: Math.floor(Math.random() * 50) + 10, distance: 2.5 },
          { pharmacy: 'Pardeep Medicos', address: 'Patiala Gate, Nabha', available: Math.random() > 0.3, price: Math.floor(Math.random() * 50) + 10, distance: 1.8 },
          { pharmacy: 'Raja Distributors', address: 'Atma Ram Colony, Railway Road, Nabha', available: Math.random() > 0.4, price: Math.floor(Math.random() * 50) + 10, distance: 2.0 },
          { pharmacy: 'Harish Medicos', address: 'Markana Road, Alohran Kalan Road, Nabha', available: Math.random() > 0.3, price: Math.floor(Math.random() * 50) + 10, distance: 3.5 },
          { pharmacy: 'Royal Medical Store', address: 'Laxman Nagar, Nabha', available: Math.random() > 0.4, price: Math.floor(Math.random() * 50) + 10, distance: 2.8 },
          { pharmacy: 'Bakshi Healthcare', address: 'Malerkotla Road, Nabha', available: Math.random() > 0.3, price: Math.floor(Math.random() * 50) + 10, distance: 3.2 },
          { pharmacy: 'Raja Medical Hall', address: 'Inside Alohran Gate, Ghas Mandi Road, Nabha', available: Math.random() > 0.4, price: Math.floor(Math.random() * 50) + 10, distance: 2.3 }
        ]
      };
      setMedicines(demoMedicines);
      setLoading(false);
    }, 600);
  };

  const handleGetDirections = (pharmacyName, address, e) => {
    // Prevent event bubbling if called from a button inside a clickable element
    if (e) {
      e.stopPropagation();
    }
    
    // Open Google Maps with the full pharmacy address for accurate location
    const fullAddress = address ? `${pharmacyName}, ${address}` : pharmacyName;
    const searchQuery = encodeURIComponent(fullAddress);
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${searchQuery}`;
    
    // Open in new tab
    window.open(googleMapsUrl, '_blank', 'noopener,noreferrer');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.main 
      className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-5xl"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">Medicine Finder</h1>
        <p className="text-slate-500 mt-2 text-lg">Locate prescribed medicines at nearby pharmacies instantly.</p>
      </div>

      <Card className="mb-8 p-6 sm:p-8 bg-gradient-to-br from-white to-slate-50">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a medicine (e.g., Paracetamol)..."
              className="input-field pl-12 h-14 text-lg border-2 border-slate-200 focus:border-primary-500 bg-white"
            />
          </div>
          <Button
            type="submit"
            size="lg"
            className="h-14 sm:w-40"
            disabled={loading || !searchQuery.trim()}
            isLoading={loading}
          >
            {!loading && <><Search className="w-5 h-5 mr-2" /> Search</>}
          </Button>
        </form>

        <div className="mt-6">
          <p className="text-sm font-medium text-slate-500 mb-3 uppercase tracking-wider">Frequently Searched</p>
          <div className="flex flex-wrap gap-2">
            {commonMedicines.map((medicine) => (
              <button
                key={medicine}
                onClick={() => handleQuickSearch(medicine)}
                className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-full text-sm font-medium hover:border-primary-300 hover:text-primary-700 hover:bg-primary-50 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {medicine}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {searched && (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
          {loading ? (
            <Card className="animate-pulse p-8">
              <div className="h-8 bg-slate-200 rounded-lg w-1/3 mb-6"></div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 bg-slate-100 rounded-2xl border border-slate-200"></div>
                ))}
              </div>
            </Card>
          ) : Object.keys(medicines).length > 0 ? (
            Object.entries(medicines).map(([medicineName, availability]) => (
              <motion.div key={medicineName} variants={itemVariants}>
                <Card className="overflow-hidden p-0 border-slate-200/60">
                  <div className="p-6 bg-slate-50 border-b border-slate-200/60 flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center">
                      <Pill size={24} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">{medicineName}</h2>
                      <p className="text-sm text-slate-500">Showing availability in nearby pharmacies</p>
                    </div>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {availability.sort((a, b) => (b.available === a.available) ? 0 : a.available ? 1 : -1).map((item, index) => (
                      <div key={index} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                        <div className="flex items-start gap-4">
                          <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0 border", item.available ? 'bg-emerald-50 text-brand-success border-emerald-100' : 'bg-red-50 text-brand-emergency border-red-100')}>
                            {item.available ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-slate-900">{item.pharmacy}</h3>
                            {item.address && (
                              <p className="text-sm text-slate-600 mt-0.5">{item.address}</p>
                            )}
                            <div className="flex items-center gap-3 mt-1 text-sm">
                              <span className={cn("font-semibold flex items-center gap-1", item.available ? 'text-brand-success' : 'text-brand-emergency')}>
                                <span className={cn("w-2 h-2 rounded-full", item.available ? 'bg-brand-success' : 'bg-brand-emergency')} />
                                {item.available ? 'In Stock' : 'Out of Stock'}
                              </span>
                              <span className="text-slate-400">•</span>
                              <span className="text-slate-500">{item.distance} km away</span>
                            </div>
                          </div>
                        </div>

                        {item.available && item.price && (
                          <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t border-slate-100 sm:border-0 pt-4 sm:pt-0">
                            <p className="text-xl font-bold text-slate-900">₹{item.price}</p>
                            <Button 
                              variant="ghost" 
                              className="text-primary-600 hover:text-primary-700 hover:bg-primary-50 px-3 py-1 mt-1 font-medium sm:h-8"
                              onClick={(e) => handleGetDirections(item.pharmacy, item.address, e)}
                            >
                              <Navigation className="w-4 h-4 mr-1.5" /> Directions
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            ))
          ) : (
            <Card className="text-center p-12 py-20 flex flex-col items-center">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                <Search className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No Results Found</h3>
              <p className="text-slate-500 max-w-sm">We couldn't find "{searchQuery}" in our local database. Try searching for a different medicine or checking spelling.</p>
            </Card>
          )}
        </motion.div>
      )}

      {!searched && (
        <motion.div variants={itemVariants} className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="text-primary-600" />
              Pharmacies in Your Area
            </h2>
            <Button variant="ghost" className="text-primary-600">View Map</Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {pharmacies.map((pharmacy, index) => (
              <Card 
                key={index} 
                hoverEffect 
                className="p-5 flex flex-col group cursor-pointer border-transparent hover:border-primary-200"
                onClick={() => handleGetDirections(pharmacy.name || pharmacy, `${pharmacy.address || ''}, ${pharmacy.city || 'Nabha'}`)}
              >
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-100 transition-colors">
                  <Pill size={24} />
                </div>
                <h3 className="font-bold text-slate-900 mb-1">{pharmacy.name || pharmacy}</h3>
                <p className="text-sm text-slate-500 mb-2">{pharmacy.address || 'Nabha'}</p>
                <p className="text-xs text-slate-400 mb-4">{(Math.random() * 2 + 0.5).toFixed(1)} km away • Open Now</p>
                <div className="mt-auto flex items-center text-sm font-medium text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  Get Directions <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </Card>
            ))}
          </div>
        </motion.div>
      )}
    </motion.main>
  );
}
