# TeleHealth Access System

A full-stack web application for remote healthcare access designed for rural communities. This hackathon project enables patients to consult doctors remotely via video calls, check medicine availability at nearby pharmacies, access health records, and get AI-powered symptom assessments.

## Features

- **🎥 Video Consultations** - Face-to-face doctor consultations using Jitsi Meet with HD video/audio
- **Patient Authentication** - Secure login using Firebase Authentication
- **Digital Health Records** - View previous consultations, prescriptions, and medical history
- **Medicine Availability** - Search medicines and check stock at nearby pharmacies
- **AI Symptom Checker** - OpenAI-powered preliminary health assessment
- **Progressive Web App** - Works offline with cached health records

### Video Call Features
- ✅ HD video and audio quality
- ✅ Screen sharing for better diagnosis
- ✅ Text chat during consultations
- ✅ Device selection (camera/mic/speaker)
- ✅ End-to-end encryption
- ✅ Mobile responsive
- ✅ Recording capability (with consent)
- ✅ Multi-participant support

## Tech Stack

### Frontend
- React + Vite
- Tailwind CSS
- Firebase Client SDK
- React Router
- Axios
- Jitsi Meet SDK
- PWA (Service Worker)

### Backend
- Node.js + Express
- Firebase Admin SDK
- Cloud Firestore
- OpenAI API

## Project Structure

```
telehealth-system/
│
├── server/                 # Backend API
│   ├── config/
│   │   └── firebase.js     # Firebase Admin configuration
│   ├── controllers/        # Route handlers
│   │   ├── userController.js
│   │   ├── appointmentController.js
│   │   ├── recordController.js
│   │   ├── medicineController.js
│   │   └── aiController.js
│   ├── routes/             # API routes
│   │   ├── users.js
│   │   ├── appointments.js
│   │   ├── records.js
│   │   ├── medicines.js
│   │   └── ai.js
│   ├── index.js            # Server entry point
│   └── package.json
│
└── frontend/               # React frontend
    ├── src/
    │   ├── components/     # Reusable UI components
    │   │   ├── Navbar.jsx
    │   │   ├── VideoCall.jsx
    │   │   ├── SymptomChecker.jsx
    │   │   └── AppointmentCard.jsx
    │   ├── pages/          # Page components
    │   │   ├── Login.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── BookAppointment.jsx
    │   │   ├── HealthRecords.jsx
    │   │   ├── Medicines.jsx
    │   │   ├── Consultation.jsx
    │   │   └── SymptomChecker.jsx
    │   ├── services/
    │   │   └── api.js      # API client
    │   ├── firebase/
    │   │   └── firebaseConfig.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── public/
    │   ├── manifest.json   # PWA manifest
    │   └── sw.js           # Service worker
    ├── index.html
    └── package.json
```

## Installation

### Prerequisites
- Node.js 18+
- npm or pnpm
- Firebase account
- OpenAI API key (optional, for AI features)
- Modern browser with camera/microphone access

### Quick Start - Video Call Testing

Want to test the video call feature immediately? Follow these steps:

1. **Install and start the frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

2. **Open the test page:**
   Navigate to: `http://localhost:5173/test-video`

3. **Create a room and test:**
   - Enter your name and create a room
   - Copy the room ID
   - Open an incognito window and join with the same room ID
   - Grant camera/microphone permissions
   - Start your video consultation!

📖 **For detailed video call documentation, see:**
- `VIDEO_CALL_GUIDE.md` - Complete implementation guide
- `QUICK_START_VIDEO.md` - Quick setup instructions
- `VIDEO_CALL_SUMMARY.md` - Feature summary

### Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable Email/Password
   - Enable Google (optional)
4. Create Firestore Database:
   - Go to Firestore Database
   - Create database in production mode
   - Set up security rules (see below)
5. Get configuration:
   - Go to Project Settings > General
   - Copy web app config for frontend
   - Go to Service Accounts > Generate new private key for backend

### Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /appointments/{appointmentId} {
      allow read, write: if request.auth != null;
    }
    match /health_records/{recordId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.token.role == 'doctor';
    }
    match /medicines/{medicineId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.role == 'pharmacy';
    }
  }
}
```

### Backend Setup

```bash
cd server
npm install
cp .env.example .env
# Edit .env with your Firebase credentials and OpenAI API key
npm start
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your Firebase web config
npm run dev
```

## API Endpoints

### Users
- `GET /api/users` - Get all users
- `GET /api/users/doctors` - Get all doctors
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user

### Appointments
- `GET /api/appointments` - Get appointments (filter by patientId, doctorId, status)
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id/cancel` - Cancel appointment

### Health Records
- `GET /api/records` - Get health records
- `GET /api/records/prescriptions` - Get prescriptions
- `POST /api/records` - Create health record
- `PUT /api/records/:id` - Update record

### Medicines
- `GET /api/medicines` - Get medicines
- `GET /api/medicines/search?query=` - Search medicines
- `GET /api/medicines/pharmacies` - Get pharmacy list
- `POST /api/medicines` - Add medicine

### AI
- `POST /api/symptom-check` - AI symptom analysis
- `GET /api/health-tips` - Get health tips

## Firestore Collections

### users
```json
{
  "name": "Ramesh",
  "role": "patient",
  "age": 45,
  "email": "ramesh@example.com",
  "phone": "+91-9876543210"
}
```

### appointments
```json
{
  "patientId": "abc123",
  "doctorId": "doc456",
  "date": "2026-03-20",
  "time": "10:00 AM",
  "type": "video",
  "status": "scheduled",
  "roomId": "telehealth-room-xyz"
}
```

### health_records
```json
{
  "patientId": "abc123",
  "doctorId": "doc456",
  "diagnosis": "Viral Fever",
  "prescription": [
    {"medicine": "Paracetamol", "dosage": "500mg", "frequency": "Twice daily"}
  ],
  "vitals": {"temperature": "101°F", "bp": "120/80"},
  "notes": "Rest advised. Follow up in 3 days."
}
```

### medicines
```json
{
  "name": "Paracetamol",
  "pharmacy": "Sharma Pharmacy",
  "available": true,
  "price": 25,
  "quantity": 100
}
```

## PWA Features

The app works offline with:
- Cached static assets
- Cached API responses for health records
- Background sync for appointments
- Push notifications for appointment reminders
- Install prompt for home screen

## Running in Production

### Build Frontend
```bash
cd frontend
npm run build
```

### Deploy
- Deploy backend to any Node.js hosting (Vercel, Railway, Render)
- Deploy frontend to static hosting (Vercel, Netlify)
- Update CORS settings in backend for production domain

## Demo Credentials

For testing without Firebase setup:
- Email: demo@telehealth.com
- Password: demo123

## Contributing

This is a hackathon project. Feel free to fork and extend!

## License

MIT
