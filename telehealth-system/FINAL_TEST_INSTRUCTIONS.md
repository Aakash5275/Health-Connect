# Final Video Call Test Instructions

## The Issue
Video call tests are not running. Let's diagnose step by step.

## Test 1: Basic Jitsi Test (Simplest Possible)

### URL: http://localhost:5173/basic-test

This is the ABSOLUTE simplest test - just Jitsi with minimal code.

**What to do:**
1. Open: `http://localhost:5173/basic-test`
2. Open browser console (F12 → Console tab)
3. Look for these logs:
   - `🔵 BasicJitsiTest mounted`
   - `✅ Jitsi script loaded`
   - `✅ Jitsi API initialized`
   - `✅✅✅ YOU JOINED THE CONFERENCE!`

4. Open the SAME URL in another window (incognito): `http://localhost:5173/basic-test`
5. Look for: `🎉🎉🎉 SOMEONE ELSE JOINED!`

**What this tells us:**
- ✅ If you see "YOU JOINED" → Jitsi works, issue is in our app code
- ❌ If you DON'T see "YOU JOINED" → Jitsi is blocked by network/firewall
- ✅ If you see "SOMEONE ELSE JOINED" → Connection works!
- ❌ If you DON'T see "SOMEONE ELSE JOINED" → Users in different rooms or network issue

## Test 2: Check if Jitsi is Accessible

### Direct Test: https://meet.jit.si/TestRoom12345

1. Open: `https://meet.jit.si/TestRoom12345` in your browser
2. Grant camera/microphone permissions
3. Open the SAME URL in another window/device
4. Can you see each other?

**What this tells us:**
- ✅ If YES → Jitsi works, issue is in our app
- ❌ If NO → Your network blocks Jitsi (firewall, VPN, corporate network)

## Test 3: Check Network Connectivity

Open browser console and run:
```javascript
fetch('https://meet.jit.si/external_api.js')
  .then(response => {
    console.log('✅ Can reach Jitsi:', response.status);
  })
  .catch(error => {
    console.log('❌ Cannot reach Jitsi:', error);
  });
```

**What this tells us:**
- ✅ Status 200 → Network is fine
- ❌ Error → Network blocks Jitsi

## Test 4: Check Browser Permissions

In browser console:
```javascript
navigator.mediaDevices.getUserMedia({ video: true, audio: true })
  .then(stream => {
    console.log('✅ Camera/mic access granted');
    stream.getTracks().forEach(track => track.stop());
  })
  .catch(error => {
    console.log('❌ Camera/mic access denied:', error);
  });
```

## Common Issues & Solutions

### Issue 1: "Video call test is not running"

**Possible causes:**
1. Page not loading at all → Check if frontend server is running
2. Page loads but video doesn't appear → Check browser console for errors
3. Video appears but can't connect → Network/firewall issue

**Check:**
- Is frontend running? `http://localhost:5173` should load
- Any errors in browser console (F12)?
- Any errors in terminal where frontend is running?

### Issue 2: Network/Firewall Blocking

**Symptoms:**
- Jitsi script doesn't load
- Stuck on "Connecting..."
- Works on https://meet.jit.si but not in app

**Solutions:**
1. Disable VPN temporarily
2. Try on mobile hotspot
3. Check corporate firewall settings
4. Required ports: UDP 10000, TCP 443, TCP 4443

### Issue 3: Browser Issues

**Symptoms:**
- Page loads but nothing happens
- Console shows errors

**Solutions:**
1. Try different browser (Chrome recommended)
2. Clear browser cache
3. Try incognito/private mode
4. Disable browser extensions

### Issue 4: HTTPS Required

**Symptoms:**
- Works on localhost but not on deployed site
- "getUserMedia" errors

**Solution:**
- WebRTC requires HTTPS in production
- Localhost works with HTTP
- Deployed sites need SSL certificate

## Diagnostic Checklist

Run through these in order:

- [ ] Frontend server running? Check: `http://localhost:5173`
- [ ] Can access basic test? Check: `http://localhost:5173/basic-test`
- [ ] Browser console shows any errors? (F12 → Console)
- [ ] Can reach Jitsi directly? Check: `https://meet.jit.si/TestRoom123`
- [ ] Camera/mic permissions granted? (Check browser address bar)
- [ ] Using supported browser? (Chrome 74+, Firefox 66+, Safari 12.1+, Edge 79+)
- [ ] VPN disabled?
- [ ] Firewall allows WebRTC?

## What to Report

If still not working, please provide:

1. **Which test URL are you trying?**
   - http://localhost:5173/basic-test
   - http://localhost:5173/simple-test
   - http://localhost:5173/test-video
   - http://localhost:5173/consultation/room123

2. **What do you see?**
   - Blank page?
   - Loading spinner?
   - Error message?
   - Page loads but no video?

3. **Browser console logs** (F12 → Console tab)
   - Copy/paste any errors
   - Look for the emoji logs (🔵, ✅, ❌)

4. **Does https://meet.jit.si/TestRoom123 work?**
   - Yes/No

5. **What browser and version?**
   - Chrome, Firefox, Safari, Edge?
   - Version number?

## Quick Test Commands

### Check if frontend is running:
```bash
# In browser, open:
http://localhost:5173
```

### Check frontend process:
```bash
# Should show Vite dev server running
```

### Restart frontend if needed:
```bash
cd telehealth-system/frontend
npm run dev
```

## Test URLs Summary

| URL | Purpose | What to Check |
|-----|---------|---------------|
| http://localhost:5173/basic-test | Simplest Jitsi test | Console logs for "YOU JOINED" |
| http://localhost:5173/simple-test | User-friendly test | UI shows connection status |
| http://localhost:5173/test-video | Original test page | Can create/join rooms |
| http://localhost:5173/consultation/room123 | Actual consultation | Full app experience |
| https://meet.jit.si/TestRoom123 | Direct Jitsi test | Verify Jitsi works |

## Next Steps

1. **Start with Basic Test**: http://localhost:5173/basic-test
2. **Check console logs** for errors
3. **Test Jitsi directly**: https://meet.jit.si/TestRoom123
4. **Report back** with what you see

---

**Remember:** The basic test is the simplest possible implementation. If this doesn't work, the issue is definitely network/browser related, not our code.
