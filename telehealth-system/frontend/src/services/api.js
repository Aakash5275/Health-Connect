import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// User API calls
export const userAPI = {
  getUsers: () => api.get('/users'),
  getDoctors: () => api.get('/users/doctors'),
  getUserById: (id) => api.get(`/users/${id}`),
  createUser: (data) => api.post('/users', data),
  updateUser: (id, data) => api.put(`/users/${id}`, data)
};

// Appointment API calls
export const appointmentAPI = {
  getAppointments: (params) => api.get('/appointments', { params }),
  getAppointmentById: (id) => api.get(`/appointments/${id}`),
  createAppointment: (data) => api.post('/appointments', data),
  updateAppointment: (id, data) => api.put(`/appointments/${id}`, data),
  cancelAppointment: (id) => api.delete(`/appointments/${id}/cancel`)
};

// Health Records API calls
export const recordAPI = {
  getRecords: (params) => api.get('/records', { params }),
  getRecordById: (id) => api.get(`/records/${id}`),
  createRecord: (data) => api.post('/records', data),
  updateRecord: (id, data) => api.put(`/records/${id}`, data),
  getPrescriptions: (patientId) => api.get('/records/prescriptions', { params: { patientId } })
};

// Medicine API calls
export const medicineAPI = {
  getMedicines: (params) => api.get('/medicines', { params }),
  searchMedicines: (query) => api.get('/medicines/search', { params: { query } }),
  getPharmacies: () => api.get('/medicines/pharmacies'),
  getMedicineById: (id) => api.get(`/medicines/${id}`),
  addMedicine: (data) => api.post('/medicines', data),
  updateMedicine: (id, data) => api.put(`/medicines/${id}`, data)
};

// AI API calls
export const aiAPI = {
  checkSymptoms: (symptoms) => api.post('/symptom-check', { symptoms }),
  getHealthTips: () => api.get('/health-tips')
};

// Health check
export const healthCheck = () => api.get('/health');

export default api;
