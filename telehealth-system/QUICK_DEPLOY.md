# Quick Deploy Guide - 15 Minutes to Production

## Prerequisites
- GitHub account
- Vercel account (free)
- Railway account (free trial)
- Firebase project
- Google Gemini API key

---

## Step 1: Prepare Firebase (5 minutes)

1. Go to https://console.firebase.google.com
2. Create a new project (or use existing)
3. Enable Authentication > Email/Password
4. Get your config:
   - Project Settings > General > Your apps > Web app
   - Copy all the config values

5. Generate service account key:
   - Project Settings > Service Accounts
   - Click "Generate new private key"
   - Save as `serviceAccountKey.json`

---

## Step 2: Deploy Backend to Railway (3 minutes)

1. Go to https://railway.app
2. Click "New Project" > "Deploy from GitHub repo"
3. Select your repository
4. Set root directory: `telehealth-system/server`
5. Add environment variables:
   ```
   PORT=5000
   NODE_ENV=production
   FRONTEND_URL=https://your-app.vercel.app
   GEMINI_API_KEY=your_gemini_key
   ```
6. Upload `serviceAccountKey.json` in Variables section
7. Deploy!
8. Copy the Railway URL (e.g., `https://your-app.railway.app`)

---

## Step 3: Deploy Frontend to Vercel (5 minutes)

1. Go to https://vercel.com
2. Click "New Project" > Import from GitHub
3. Select your repository
4. Set root directory: `telehealth-system/frontend`
5. Add environment variables:
   ```
   VITE_API_URL=https://your-railway-url.railway.app/api
   VITE_FIREBASE_API_KEY=your_firebase_key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```
6. Build settings:
   - Build Command: `npm run build:prod`
   - Output Directory: `dist`
7. Deploy!
8. Copy the Vercel URL

---

## Step 4: Update CORS (2 minutes)

1. Go back to Railway
2. Update `FRONTEND_URL` environment variable with your Vercel URL
3. Redeploy backend

---

## Step 5: Test (5 minutes)

1. Open your Vercel URL
2. Register a new account
3. Try booking an appointment
4. **Test video call** (most important!):
   - Create appointment
   - Join video call
   - Open in another browser/device
   - Join same room
   - Verify you can see each other

---

## Troubleshooting

### Video calls not working
- Ensure your site uses HTTPS (Vercel provides this automatically)
- Check browser console for errors
- Test at https://test.webrtc.org/

### Backend not connecting
- Verify Railway URL is correct in Vercel env vars
- Check Railway logs for errors
- Ensure CORS is configured correctly

### Firebase errors
- Double-check all Firebase config values
- Ensure Authentication is enabled
- Verify service account key is uploaded

---

## Custom Domain (Optional)

### Vercel
1. Go to Project Settings > Domains
2. Add your domain
3. Update DNS records as instructed

### Railway
1. Go to Settings > Domains
2. Add custom domain
3. Update DNS records

---

## Cost Estimate

**Free Tier (Good for testing):**
- Vercel: Free
- Railway: $5 credit (free trial)
- Firebase: Free tier
- Total: $0 for first month

**Production (Small scale):**
- Vercel Pro: $20/month
- Railway: $20-50/month
- Firebase Blaze: $25-100/month
- Domain: $10-15/year
- Total: ~$65-185/month

---

## Next Steps

1. ✅ Set up custom domain
2. ✅ Configure Firebase security rules
3. ✅ Enable monitoring and analytics
4. ✅ Set up automated backups
5. ✅ Add error tracking (Sentry)
6. ✅ Test on mobile devices

---

## Quick Commands Reference

```bash
# Build frontend locally
cd frontend && npm run build:prod

# Test backend locally
cd server && npm start

# Deploy with Docker
docker-compose up -d

# View logs
docker-compose logs -f
```

---

## Support

- Full guide: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- Checklist: [DEPLOYMENT_CHECKLIST.txt](./DEPLOYMENT_CHECKLIST.txt)
- README: [PRODUCTION_README.md](./PRODUCTION_README.md)

---

**🎉 Congratulations! Your telehealth system is now live!**
