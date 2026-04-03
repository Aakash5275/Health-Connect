# Quick Start - Video Call System

## 🚀 Getting Started in 5 Minutes

### Prerequisites
- Node.js installed
- Internet connection (for Jitsi Meet API)
- Modern browser (Chrome, Firefox, Safari, or Edge)

### Step 1: Install Dependencies
```bash
cd telehealth-system/frontend
npm install
```

### Step 2: Start Development Server
```bash
npm run dev
```

The app will open at `http://localhost:5173`

### Step 3: Test Video Call

#### Option A: Quick Test (Same Browser)
1. Open the app in your browser
2. Login as a patient (or use demo mode)
3. Navigate to: `http://localhost:5173/consultation/test-room-1`
4. Open a new incognito/private window
5. Login as a doctor
6. Navigate to: `http://localhost:5173/consultation/test-room-1`
7. Both users should now be in the same video call!

#### Option B: Full Flow Test
1. **As Patient:**
   - Login at `/login/patient`
   - Go to Dashboard
   - Click "Book Appointment"
   - Select video consultation
   - Note the appointment ID

2. **As Doctor:**
   - Login at `/login/doctor`
   - Go to Doctor Dashboard
   - Click "Join Call" for the appointment
   - Video call starts automatically

### Step 4: Grant Permissions
When prompted by your browser:
- ✅ Allow camera access
- ✅ Allow microphone access

## 🎥 Using the Video Call

### Controls Available:
- **Microphone**: Mute/unmute your audio
- **Camera**: Turn video on/off
- **Screen Share**: Share your screen
- **Chat**: Send text messages
- **Settings**: Change camera/mic/speaker
- **Full Screen**: Expand to full screen
- **End Call**: Leave the consultation

### Tips for Best Experience:
1. Use headphones to avoid echo
2. Ensure good lighting for video
3. Test audio/video before important calls
4. Use stable internet connection (WiFi or ethernet)
5. Close unnecessary browser tabs

## 🔧 Troubleshooting

### Camera/Mic Not Working?
```bash
# Check browser permissions:
# Chrome: Settings > Privacy > Site Settings > Camera/Microphone
# Firefox: Preferences > Privacy & Security > Permissions
# Safari: Preferences > Websites > Camera/Microphone
```

### Connection Issues?
1. Refresh the page
2. Check internet connection
3. Try different browser
4. Disable VPN if active

### Still Not Working?
- Open browser console (F12)
- Look for error messages
- Check if Jitsi API loaded: `window.JitsiMeetExternalAPI`

## 📱 Mobile Testing

### iOS (Safari)
1. Open Safari on iPhone/iPad
2. Navigate to your local IP: `http://192.168.x.x:5173`
3. Grant camera/mic permissions
4. Join consultation room

### Android (Chrome)
1. Open Chrome on Android device
2. Navigate to your local IP: `http://192.168.x.x:5173`
3. Grant camera/mic permissions
4. Join consultation room

**Note**: Replace `192.168.x.x` with your computer's local IP address

## 🌐 Production Deployment

### Important: HTTPS Required
Browsers require HTTPS for camera/microphone access in production.

### Deploy Options:
1. **Vercel** (Recommended)
   ```bash
   npm run build
   vercel deploy
   ```

2. **Netlify**
   ```bash
   npm run build
   netlify deploy --prod
   ```

3. **Custom Server**
   - Build: `npm run build`
   - Serve `dist` folder with HTTPS
   - Configure SSL certificate

## 🔐 Security Notes

- Room IDs should be unique per appointment
- Implement authentication before joining calls
- Consider self-hosting Jitsi for HIPAA compliance
- Enable end-to-end encryption in production
- Log consultation access for audit trails

## 📊 Monitoring

### Check if Video Call is Working:
```javascript
// Open browser console and run:
console.log('Jitsi API loaded:', !!window.JitsiMeetExternalAPI);
```

### Network Quality:
- Good: 3+ Mbps, <100ms latency
- Fair: 1-3 Mbps, 100-200ms latency
- Poor: <1 Mbps, >200ms latency

## 🆘 Need Help?

### Common Questions:

**Q: Can I use this without internet?**
A: No, Jitsi Meet requires internet connection.

**Q: How many people can join?**
A: Jitsi supports 75+ participants, but 2-4 is optimal for consultations.

**Q: Is it free?**
A: Yes, using meet.jit.si is free. For custom features, consider self-hosting.

**Q: Is it HIPAA compliant?**
A: Public Jitsi instance is not HIPAA compliant. Self-host for compliance.

**Q: Can I record consultations?**
A: Yes, but ensure you have patient consent and comply with local laws.

## 🎯 Next Steps

1. ✅ Test video call locally
2. ✅ Customize UI/branding
3. ✅ Integrate with appointment system
4. ✅ Add consultation notes feature
5. ✅ Implement prescription writing
6. ✅ Deploy to production with HTTPS

---

**Ready to go!** Start the dev server and test your first video consultation. 🎉
