# Video Call Connection Test Guide

## The Problem
Your logs show that media (camera/microphone) is working, but users can't see each other. This means they're likely not connecting to the same room or there's a network issue.

## Quick Test - Use This First! 🚀

### Test URL: http://localhost:5173/simple-test

This is a simplified test page that will clearly show:
- ✅ If you joined the room
- ✅ How many participants are in the room
- ✅ When someone else joins
- ✅ Real-time connection logs

### How to Test (2 Users):

1. **Window 1** (Your main browser):
   - Go to: `http://localhost:5173/simple-test`
   - Enter your name: "Patient"
   - Note the Room ID (or change it to something simple like "test123")
   - Click "Copy Room ID"
   - Click "Join Room"
   - Grant camera/microphone permissions
   - **You should see**: "⚠️ You are alone in this room"

2. **Window 2** (Incognito/Private mode or different browser):
   - Go to: `http://localhost:5173/simple-test`
   - Enter your name: "Doctor"
   - **PASTE THE EXACT SAME ROOM ID** from Window 1
   - Click "Join Room"
   - Grant camera/microphone permissions
   - **You should see**: "🎉 SOMEONE JOINED!"

3. **Expected Result**:
   - Window 1 should show: "✅ Connected with 1 other user(s)!"
   - Window 2 should show: "✅ Connected with 1 other user(s)!"
   - Both should see each other's video

## What the Logs Tell Us

From your logs:
```
2026-03-13T00:35:28.690Z [INFO] [rtc:RTCUtils] onUserMediaSuccess
2026-03-13T00:35:28.721Z [INFO] [app:settings] switched local audio input device
2026-03-13T00:35:28.738Z [INFO] [app:settings] switched local video device
```

✅ **Good**: Media devices are working
❌ **Missing**: No logs about "videoConferenceJoined" or "participantJoined"

This suggests:
1. Users are not actually joining the Jitsi conference
2. OR users are joining different rooms
3. OR there's a network/firewall blocking the connection

## Debugging Steps

### Step 1: Check Console Logs
Open browser console (F12) and look for:
- ✅ "🚀 Initializing Jitsi with room: ..."
- ✅ "✅ User joined the conference"
- ✅ "🎉 NEW PARTICIPANT JOINED"

If you DON'T see these, the Jitsi connection is failing.

### Step 2: Verify Room IDs Match
Both users MUST use the EXACT same room ID:
- ❌ BAD: User 1 uses "room123", User 2 uses "Room123" (case matters!)
- ❌ BAD: User 1 uses "room123", User 2 uses "room124"
- ✅ GOOD: Both use "room123"

### Step 3: Check Network
Try this in browser console:
```javascript
fetch('https://meet.jit.si/external_api.js')
  .then(() => console.log('✅ Can reach Jitsi'))
  .catch(() => console.log('❌ Cannot reach Jitsi - network issue'));
```

### Step 4: Test Jitsi Directly
Go to: https://meet.jit.si/TestRoom12345
- If this works → Your app has a bug
- If this doesn't work → Network/firewall issue

## Common Issues

### Issue 1: Different Room IDs
**Symptom**: Both users join successfully but don't see each other
**Check**: Look at the console logs for the room name
**Fix**: Ensure both use the exact same room ID

### Issue 2: Firewall Blocking WebRTC
**Symptom**: Stuck on "Connecting..." forever
**Check**: Try on mobile hotspot or different network
**Fix**: 
- Disable VPN
- Check corporate firewall settings
- Required ports: UDP 10000, TCP 443, TCP 4443

### Issue 3: Browser Compatibility
**Symptom**: Jitsi doesn't load or crashes
**Check**: Browser version
**Fix**: Use Chrome 74+, Firefox 66+, Safari 12.1+, or Edge 79+

### Issue 4: HTTPS Required (Production)
**Symptom**: Works on localhost but not on deployed site
**Check**: Is your site using HTTPS?
**Fix**: Enable SSL/TLS certificate

## Enhanced Logging

I've updated the VideoCall component to show detailed logs. Now you'll see:
- 🚀 When Jitsi initializes
- ✅ When you join
- 🎉 When someone else joins
- 👥 Participant count
- 🎤 Audio status
- 📹 Video status

Check your browser console for these emoji logs!

## Test Pages Available

1. **Simple Test** (RECOMMENDED): `http://localhost:5173/simple-test`
   - Best for testing 2-user connection
   - Shows clear participant status
   - Real-time logs

2. **Debug Test**: `http://localhost:5173/debug-video/test123`
   - Tests media permissions
   - Shows device status
   - Technical diagnostics

3. **Original Test**: `http://localhost:5173/test-video`
   - Basic video call test

4. **Actual Consultation**: `http://localhost:5173/consultation/room123`
   - The real consultation page
   - Use after confirming simple test works

## Next Steps

1. ✅ Open the simple test page: `http://localhost:5173/simple-test`
2. ✅ Test with 2 browser windows using the SAME room ID
3. ✅ Check the console logs for connection status
4. ✅ Report back what you see in the logs

## What to Look For

### Success Looks Like:
```
[INFO] 🚀 Initializing Jitsi with room: test123
[INFO] ✓ Jitsi initialized, waiting to join...
[SUCCESS] ✓ YOU JOINED THE ROOM!
[SUCCESS]    Room: test123
[INFO] 👥 Total participants: 1 (including you)
[WARNING] ⚠️ You are alone in the room
... (when second user joins) ...
[SUCCESS] 🎉 SOMEONE JOINED!
[SUCCESS]    Name: Doctor
[INFO] 👥 Total participants now: 2
```

### Failure Looks Like:
```
[INFO] 🚀 Initializing Jitsi with room: test123
... (nothing else) ...
```
This means Jitsi isn't connecting - likely network/firewall issue.

## Still Not Working?

If the simple test doesn't work:

1. **Test Jitsi directly**: https://meet.jit.si/TestRoom12345
   - If this works, the issue is in our code
   - If this doesn't work, it's your network

2. **Check browser console** for error messages

3. **Try different network** (mobile hotspot)

4. **Try different browser** (Chrome recommended)

5. **Disable browser extensions** (test in incognito mode)

## Report Back

After testing, please share:
1. What you see in the simple test page
2. Console logs (F12 → Console tab)
3. Do both users see "YOU JOINED THE ROOM"?
4. Does either user see "SOMEONE JOINED"?
5. What's the participant count shown?

This will help identify the exact issue!
