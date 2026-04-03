# Deployment Guide - SwasthyaConnect TeleHealth System

## Pre-Deployment Checklist

### 1. Environment Setup
- [ ] Create production Firebase project
- [ ] Generate Firebase service account key
- [ ] Get Gemini AI API key (for symptom checker)
- [ ] Choose hosting platform (Vercel, Netlify, AWS, etc.)
- [ ] Set up domain name and SSL certificate

### 2. Security
- [ ] Remove all test routes (already done)
- [ ] Update CORS settings for production domain
- [ ] Secure all API keys in environment variables
- [ ] Enable Firebase security rules
- [ ] Set up rate limiting on backend

### 3. Performance
- [ ] Build and test production bundle
- [ ] Optimize images and assets
- [ ] Enable CDN for static assets
- [ ] Configure caching headers

---

## Deployment Options

### Option 1: Vercel (Recommended for Frontend) + Railway/Render (Backend)

#### Frontend Deployment (Vercel)

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Build the frontend**
```bash
cd telehealth-system/frontend
npm run build:prod
```

3. **Deploy to Vercel**
```bash
vercel --prod
```

4. **Configure Environment Variables in Vercel Dashboard**
   - Go to Project Settings > Environment Variables
   - Add all variables from `.env.production`

5. **Configure Build Settings**
   - Build Command: `npm run build:prod`
   - Output Directory: `dist`
   - Install Command: `npm install`

#### Backend Deployment (Railway)

1. **Create Railway Account**: https://railway.app

2. **Create New Project**
   - Connect your GitHub repository
   - Select `telehealth-system/server` as root directory

3. **Add Environment Variables**
   - PORT=5000
   - NODE_ENV=production
   - FRONTEND_URL=https://your-vercel-domain.vercel.app
   - GEMINI_API_KEY=your_key
   - Upload Firebase service account JSON

4. **Deploy**
   - Railway will auto-deploy on push

5. **Get Backend URL**
   - Copy the Railway-provided URL
   - Update `VITE_API_URL` in Vercel environment variables

---

### Option 2: Netlify (Frontend) + Heroku (Backend)

#### Frontend Deployment (Netlify)

1. **Build the frontend**
```bash
cd telehealth-system/frontend
npm run build:prod
```

2. **Deploy via Netlify CLI**
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

3. **Or Deploy via Netlify Dashboard**
   - Drag and drop the `dist` folder
   - Configure environment variables
   - Set build command: `npm run build:prod`

#### Backend Deployment (Heroku)

1. **Install Heroku CLI**
```bash
npm install -g heroku
```

2. **Create Heroku App**
```bash
cd telehealth-system/server
heroku create your-app-name
```

3. **Set Environment Variables**
```bash
heroku config:set NODE_ENV=production
heroku config:set FRONTEND_URL=https://your-netlify-domain.netlify.app
heroku config:set GEMINI_API_KEY=your_key
```

4. **Create Procfile**
```bash
echo "web: npm start" > Procfile
```

5. **Deploy**
```bash
git push heroku main
```

---

### Option 3: AWS (Full Stack)

#### Frontend (S3 + CloudFront)

1. **Build the frontend**
```bash
cd telehealth-system/frontend
npm run build:prod
```

2. **Create S3 Bucket**
   - Enable static website hosting
   - Upload `dist` folder contents

3. **Create CloudFront Distribution**
   - Point to S3 bucket
   - Enable HTTPS
   - Configure custom domain

#### Backend (EC2 or Elastic Beanstalk)

1. **Using EC2**
```bash
# SSH into EC2 instance
ssh -i your-key.pem ec2-user@your-instance-ip

# Install Node.js
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Clone and setup
git clone your-repo
cd telehealth-system/server
npm install
npm start
```

2. **Using Elastic Beanstalk**
```bash
eb init
eb create production-env
eb deploy
```

---

### Option 4: Docker Deployment

#### Create Dockerfiles

**Frontend Dockerfile** (`telehealth-system/frontend/Dockerfile`):
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build:prod

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Backend Dockerfile** (`telehealth-system/server/Dockerfile`):
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

**Docker Compose** (`telehealth-system/docker-compose.yml`):
```yaml
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports:
      - "80:80"
    environment:
      - VITE_API_URL=http://backend:5000/api
    depends_on:
      - backend

  backend:
    build: ./server
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - PORT=5000
    env_file:
      - ./server/.env
```

**Deploy with Docker**:
```bash
cd telehealth-system
docker-compose up -d
```

---

## Environment Variables Configuration

### Frontend (.env.production)
```env
VITE_API_URL=https://your-backend-domain.com/api
VITE_FIREBASE_API_KEY=your_production_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Backend (.env)
```env
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com
GEMINI_API_KEY=your_gemini_api_key
FIREBASE_SERVICE_ACCOUNT_PATH=./config/serviceAccountKey.json
```

---

## Post-Deployment Steps

### 1. Test the Deployment
- [ ] Test user registration and login
- [ ] Test appointment booking
- [ ] Test video call functionality (IMPORTANT!)
- [ ] Test on mobile devices
- [ ] Test symptom checker
- [ ] Test health records

### 2. Configure Firebase Security Rules

**Firestore Rules**:
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
    match /healthRecords/{recordId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

**Storage Rules**:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /healthRecords/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 3. Set Up Monitoring
- [ ] Enable Firebase Analytics
- [ ] Set up error tracking (Sentry, LogRocket)
- [ ] Configure uptime monitoring
- [ ] Set up performance monitoring

### 4. Configure Domain and SSL
- [ ] Point domain to hosting provider
- [ ] Enable SSL/TLS certificate
- [ ] Configure HTTPS redirect
- [ ] Update CORS settings with production domain

### 5. Optimize Performance
- [ ] Enable CDN
- [ ] Configure caching headers
- [ ] Compress assets
- [ ] Enable HTTP/2

---

## Video Call Considerations

### HTTPS is REQUIRED
WebRTC (used by Jitsi) requires HTTPS in production. Ensure:
- [ ] SSL certificate is installed
- [ ] All pages use HTTPS
- [ ] Mixed content warnings are resolved

### Firewall Configuration
Ensure these ports are open:
- TCP 443 (HTTPS)
- TCP 4443 (Jitsi video bridge)
- UDP 10000 (Jitsi media)

### Alternative: Self-Hosted Jitsi
If you need more control, deploy your own Jitsi server:
1. Follow: https://jitsi.github.io/handbook/docs/devops-guide/devops-guide-quickstart
2. Update `VideoCall.jsx` domain to your Jitsi server

---

## Rollback Plan

If deployment fails:
1. Keep previous version running
2. Test new version on staging first
3. Use blue-green deployment strategy
4. Have database backups ready

---

## Maintenance

### Regular Updates
- Update dependencies monthly: `npm update`
- Check for security vulnerabilities: `npm audit`
- Monitor Firebase usage and costs
- Review error logs weekly

### Backup Strategy
- Daily Firebase backups
- Weekly full system backups
- Test restore procedures monthly

---

## Cost Estimation

### Free Tier (Development/Small Scale)
- Vercel: Free for personal projects
- Railway: $5/month with free trial
- Firebase: Free tier (Spark plan)
- Jitsi: Free (public server)

### Production (Medium Scale)
- Vercel Pro: $20/month
- Railway: $20-50/month
- Firebase Blaze: Pay-as-you-go (~$25-100/month)
- Domain: $10-15/year
- SSL: Free (Let's Encrypt)

**Total: ~$65-185/month**

---

## Support and Resources

- Firebase Console: https://console.firebase.google.com
- Vercel Dashboard: https://vercel.com/dashboard
- Railway Dashboard: https://railway.app/dashboard
- Jitsi Documentation: https://jitsi.github.io/handbook/

---

## Quick Deploy Commands

```bash
# Frontend (Vercel)
cd telehealth-system/frontend
npm run build:prod
vercel --prod

# Backend (Railway)
# Push to GitHub, Railway auto-deploys

# Or manual deploy
cd telehealth-system/server
npm install
npm start
```

---

## Troubleshooting

### Build Fails
- Check Node.js version (18+ required)
- Clear node_modules and reinstall
- Check for missing environment variables

### Video Calls Don't Work
- Ensure HTTPS is enabled
- Check firewall settings
- Test with https://test.webrtc.org/
- Verify Jitsi is accessible

### Firebase Errors
- Verify API keys are correct
- Check Firebase project settings
- Ensure billing is enabled (for production)

---

## Next Steps After Deployment

1. Set up custom domain
2. Configure email notifications
3. Add analytics tracking
4. Set up automated backups
5. Create admin dashboard
6. Add payment integration (if needed)
7. Implement appointment reminders
8. Add SMS notifications

---

**Need Help?** Check the troubleshooting guides or contact support.
