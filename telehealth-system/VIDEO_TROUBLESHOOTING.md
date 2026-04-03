# Video Call Troubleshooting Guide

## Problem: Users Cannot Connect & Video/Audio Not Working

### Quick Diagnosis

1. **Open the debug page**: Navigate to `http://localhost:5173/debug-video/test123` (replace test123 with any room ID)
2. **Check the diagnostic logs** to see what's failing

### Common Issues & Solutions

#### 1. Browser Permissions Not Granted

**Symptoms:**
- Camera/microphone shows "Denied" or "Pending"
- Browser shows a blocked camera icon in the address bar

**Solution:**
```
1. Click the camera icon in your browser's address bar
2. Select "Always allow" for camera and microphone
3. Refresh the page
4. If still blocked, go to browser settings:
   - Chrome: Settings > Privacy and security > Site Settings > Camera/Microphone
   - Firefox: Settings > Privacy & Security > Permissions
   - Edge: Settings > Cookies and site permissions > Camera/Microphone
```

#### 2. HTTPS Required (Production Only)

**Symptoms:**
- Works on localhost but not on deployed site
- Browser console shows "getUserMedia" errors

**Solution:**
- WebRTC requires HTTPS in production
- Ensure your deployment uses SSL/TLS certificates
- For localhost testing, use `http://localhost` (not IP address)

#### 3. Jitsi API Not Loading

**Symptoms:**
- Diagnostic shows "Failed to load Jitsi API"
- Network errors in console

**Solution:**
```
1. Check internet connection
2. Verify firewall isn't blocking meet.jit.si
3. Try accessing https://meet.jit.si directly in browser
4. Check if corporate network blocks WebRTC
```

#### 4. Users in Different Rooms

**Symptoms:**
- Both users connected but can't see each other
- Only one participant shown

**Solution:**
```
1. Verify both users are using the EXACT same room ID
2. Check the room name in the diagnostic logs
3. Room format should be: TelehealthRoom_<roomId>
```

#### 5. Firewall/Network Issues

**Symptoms:**
- Connection stuck on "Connecting..."
- Works on some networks but not others

**Solution:**
```
1. Check if corporate firewall blocks WebRTC
2. Required ports: UDP 10000, TCP 443, TCP 4443
3. Try on a different network (mobile hotspot)
4. Disable VPN temporarily to test
```

### Testing Steps

#### Step 1: Test with Debug Page
```
1. Open: http://localhost:5173/debug-video/room123
2. Grant camera/microphone permissions when prompted
3. Check all diagnostic tests pass (green checkmarks)
4. You should see your local video preview
```

#### Step 2: Test Two Users Connecting
```
1. User 1: Open http://localhost:5173/consultation/room123
2. User 2: Open http://localhost:5173/consultation/room123 (same room ID!)
3. Both should grant permissions
4. Both should see each other's video within 5-10 seconds
```

#### Step 3: Test in Incognito/Private Mode
```
1. Open browser in incognito/private mode
2. Navigate to the consultation page
3. Grant permissions again
4. This tests if browser extensions are interfering
```

### Browser Compatibility

✅ **Supported Browsers:**
- Chrome 74+
- Firefox 66+
- Safari 12.1+
- Edge 79+

❌ **Not Supported:**
- Internet Explorer
- Old mobile browsers
- Browsers with WebRTC disabled

### Quick Fixes

#### Reset Browser Permissions
```javascript
// In browser console:
navigator.permissions.query({name: 'camera'}).then(result => console.log(result.state));
navigator.permissions.query({name: 'microphone'}).then(result => console.log(result.state));
```

#### Test Media Devices
```javascript
// In browser console:
navigator.mediaDevices.getUserMedia({ video: true, audio: true })
  .then(stream => {
    console.log('✓ Media access granted');
    stream.getTracks().forEach(track => track.stop());
  })
  .catch(err => console.error('✗ Media access denied:', err));
```

#### Check Available Devices
```javascript
// In browser console:
navigator.mediaDevices.enumerateDevices()
  .then(devices => {
    console.log('Cameras:', devices.filter(d => d.kind === 'videoinput'));
    console.log('Microphones:', devices.filter(d => d.kind === 'audioinput'));
  });
```

### Advanced Debugging

#### Enable Jitsi Debug Logs
Add to VideoCall.jsx configOverwrite:
```javascript
configOverwrite: {
  // ... existing config
  debug: true,
  debugAudioLevels: true
}
```

#### Check WebRTC Stats
```javascript
// In browser console after joining:
const pc = document.querySelector('iframe').contentWindow.APP.conference._room.jvbJingleSession.peerconnection;
pc.getStats().then(stats => console.log(stats));
```

### Still Not Working?

1. **Check browser console** for error messages (F12 > Console tab)
2. **Try the test page**: http://localhost:5173/test-video
3. **Test on meet.jit.si directly**: https://meet.jit.si/TestRoom123
   - If this doesn't work, the issue is with your network/browser, not the app
4. **Check server logs** for any backend errors

### Production Deployment Checklist

- [ ] HTTPS enabled with valid SSL certificate
- [ ] Firewall allows WebRTC ports (UDP 10000, TCP 443, 4443)
- [ ] CORS configured correctly
- [ ] Environment variables set properly
- [ ] Test from multiple networks
- [ ] Test on mobile devices
- [ ] Consider using TURN server for restrictive networks

### Alternative: Use Your Own Jitsi Server

If the public Jitsi server is blocked, you can deploy your own:

1. Follow: https://jitsi.github.io/handbook/docs/devops-guide/devops-guide-quickstart
2. Update `VideoCall.jsx`:
```javascript
const domain = 'your-jitsi-server.com'; // instead of 'meet.jit.si'
```

### Need More Help?

- Jitsi Documentation: https://jitsi.github.io/handbook/
- WebRTC Troubleshooting: https://webrtc.github.io/samples/
- Test WebRTC: https://test.webrtc.org/
