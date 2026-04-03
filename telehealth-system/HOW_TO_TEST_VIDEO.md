# How to Test Video Calls - Quick Start

## Step 1: Start the Application

The servers should already be running. If not:
```bash
# Terminal 1 - Start backend
cd telehealth-system/server
npm start

# Terminal 2 - Start frontend
cd telehealth-system/frontend
npm run dev
```

## Step 2: Test with Debug Page (Recommended First)

1. Open your browser: `http://localhost:5173/debug-video/test123`
2. **Allow camera and microphone** when prompted (very important!)
3. Check the diagnostic logs - all should show green checkmarks ✓
4. You should see your own video in the preview

## Step 3: Test Two Users Connecting

### Option A: Two Browser Windows (Same Computer)
1. Open Window 1: `http://localhost:5173/consultation/room123`
2. Open Window 2 (Incognito): `http://localhost:5173/consultation/room123`
3. Grant permissions in both windows
4. Both windows should show each other's video

### Option B: Two Different Computers/Devices
1. Computer 1: `http://localhost:5173/consultation/room123`
2. Computer 2: `http://localhost:5173/consultation/room123`
3. **Important**: Use the SAME room ID (room123)
4. Grant permissions on both
5. You should see each other

## Step 4: Test Through the App Flow

1. Login as Patient: `http://localhost:5173/login/patient`
   - Email: `patient@test.com` / Password: `password123`
2. Go to Dashboard
3. Click on an appointment
4. Click "Join Video Call"
5. Grant camera/microphone permissions
6. Wait for doctor to join

## Common Issues & Quick Fixes

### Issue: "Camera/Microphone Blocked"
**Fix:** Click the camera icon in browser address bar → Allow → Refresh page

### Issue: "Can't see the other person"
**Fix:** Make sure both users are using the EXACT same room ID

### Issue: "Stuck on connecting..."
**Fix:** 
1. Check internet connection
2. Try in incognito mode
3. Disable VPN if using one
4. Check if firewall is blocking WebRTC

### Issue: "No video preview"
**Fix:**
1. Check if camera is being used by another app
2. Try a different browser (Chrome recommended)
3. Check browser permissions in Settings

## Browser Requirements

✅ Use these browsers:
- Chrome (recommended)
- Firefox
- Edge
- Safari

❌ Don't use:
- Internet Explorer
- Very old browsers

## Quick Test URLs

- Debug page: `http://localhost:5173/debug-video/test123`
- Test video: `http://localhost:5173/test-video`
- Consultation: `http://localhost:5173/consultation/room123`
- Dashboard: `http://localhost:5173/dashboard`

## What Should Happen

When working correctly:
1. Browser asks for camera/microphone permission → Click "Allow"
2. You see your own video immediately
3. When another user joins the same room, you see their video
4. You can toggle camera/audio with the buttons
5. Both users can see and hear each other

## Still Not Working?

1. Open browser console (F12) and check for errors
2. Read the full troubleshooting guide: `VIDEO_TROUBLESHOOTING.md`
3. Test if Jitsi works directly: https://meet.jit.si/TestRoom123
   - If this doesn't work, the issue is your network/browser, not the app

## Need to Test Right Now?

**Fastest way:**
1. Open: `http://localhost:5173/debug-video/test123`
2. Click "Allow" when browser asks for permissions
3. Check if you see your video and all tests pass
4. If yes, video calls are working! ✓
