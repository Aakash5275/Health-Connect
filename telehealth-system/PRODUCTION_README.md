# SwasthyaConnect - Rural TeleHealth Access System

A comprehensive telemedicine platform designed to provide remote healthcare access to rural communities in India.

## 🚀 Features

- **Video Consultations**: Real-time video calls between patients and doctors using Jitsi
- **Appointment Booking**: Schedule and manage medical appointments
- **Health Records**: Digital health records and prescription management
- **Symptom Checker**: AI-powered symptom analysis using Google Gemini
- **Medicine Finder**: Locate nearby pharmacies and medicine availability
- **Emergency Services**: Quick access to emergency contacts and services
- **Multi-language Support**: Available in Hindi and English
- **PWA Support**: Install as a mobile app

## 🛠️ Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- Firebase Authentication
- Jitsi Meet (Video calls)
- Framer Motion (Animations)
- React Router

### Backend
- Node.js + Express
- Firebase Admin SDK
- Google Gemini AI
- RESTful API

## 📋 Prerequisites

- Node.js 18+ and npm
- Firebase account
- Google Gemini API key
- Domain with SSL certificate (for production)

## 🚀 Quick Start (Development)

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd telehealth-system
```

### 2. Install dependencies
```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../server
npm install
```

### 3. Configure environment variables

**Frontend** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:5000/api
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

**Backend** (`server/.env`):
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
GEMINI_API_KEY=your_gemini_api_key
FIREBASE_SERVICE_ACCOUNT_PATH=./config/serviceAccountKey.json
```

### 4. Add Firebase service account key
- Download from Firebase Console > Project Settings > Service Accounts
- Save as `server/config/serviceAccountKey.json`

### 5. Start development servers
```bash
# Terminal 1 - Frontend
cd frontend
npm run dev

# Terminal 2 - Backend
cd server
npm run dev
```

### 6. Access the application
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## 🚢 Production Deployment

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed deployment instructions.

### Quick Deploy with Docker

```bash
# Build and run with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Deploy to Vercel (Frontend)

```bash
cd frontend
npm run build:prod
vercel --prod
```

### Deploy to Railway (Backend)

1. Connect GitHub repository to Railway
2. Set environment variables
3. Deploy automatically on push

## 📁 Project Structure

```
telehealth-system/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── firebase/        # Firebase config
│   │   └── lib/             # Utilities
│   ├── public/              # Static assets
│   ├── Dockerfile           # Frontend Docker config
│   └── nginx.conf           # Nginx configuration
│
├── server/                   # Node.js backend
│   ├── controllers/         # Route controllers
│   ├── routes/              # API routes
│   ├── config/              # Configuration files
│   ├── Dockerfile           # Backend Docker config
│   └── index.js             # Server entry point
│
├── docker-compose.yml       # Docker Compose config
├── DEPLOYMENT_GUIDE.md      # Deployment instructions
└── README.md                # This file
```

## 🔐 Security

- All API keys stored in environment variables
- Firebase security rules configured
- HTTPS required for production
- CORS configured for specific domains
- Input validation on all endpoints
- Rate limiting enabled

## 🧪 Testing

### Test Video Calls
```bash
# Open in two browser windows
http://localhost:5173/consultation/test-room-123
```

### Test API Endpoints
```bash
# Health check
curl http://localhost:5000/api/health

# Get appointments
curl http://localhost:5000/api/appointments
```

## 📊 Monitoring

- Firebase Analytics for user tracking
- Error logging with console
- Performance monitoring
- Uptime monitoring (recommended: UptimeRobot)

## 🔧 Configuration

### Firebase Security Rules

**Firestore**:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### CORS Configuration

Update `server/index.js`:
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

## 🐛 Troubleshooting

### Video calls not working
- Ensure HTTPS is enabled (required for WebRTC)
- Check firewall settings (ports 443, 4443, 10000)
- Test at https://test.webrtc.org/

### Build fails
- Clear node_modules: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version` (should be 18+)
- Verify environment variables are set

### Firebase errors
- Verify API keys are correct
- Check Firebase project settings
- Ensure billing is enabled for production

## 📝 Environment Variables Reference

### Frontend
| Variable | Description | Required |
|----------|-------------|----------|
| VITE_API_URL | Backend API URL | Yes |
| VITE_FIREBASE_API_KEY | Firebase API key | Yes |
| VITE_FIREBASE_AUTH_DOMAIN | Firebase auth domain | Yes |
| VITE_FIREBASE_PROJECT_ID | Firebase project ID | Yes |
| VITE_FIREBASE_STORAGE_BUCKET | Firebase storage bucket | Yes |
| VITE_FIREBASE_MESSAGING_SENDER_ID | Firebase sender ID | Yes |
| VITE_FIREBASE_APP_ID | Firebase app ID | Yes |

### Backend
| Variable | Description | Required |
|----------|-------------|----------|
| PORT | Server port | Yes |
| NODE_ENV | Environment (development/production) | Yes |
| FRONTEND_URL | Frontend URL for CORS | Yes |
| GEMINI_API_KEY | Google Gemini API key | Yes |
| FIREBASE_SERVICE_ACCOUNT_PATH | Path to Firebase service account JSON | Yes |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
- Check [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- Review troubleshooting section above
- Open an issue on GitHub

## 🎯 Roadmap

- [ ] SMS notifications for appointments
- [ ] Payment integration
- [ ] Admin dashboard
- [ ] Multi-language support expansion
- [ ] Mobile app (React Native)
- [ ] Prescription management
- [ ] Lab test integration
- [ ] Insurance integration

## 📞 Contact

For support or inquiries, please contact the development team.

---

**Built with ❤️ for rural healthcare access in India**
