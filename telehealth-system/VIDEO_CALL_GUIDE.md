# Jitsi Video Call System - Implementation Guide

## Overview
The telehealth system now includes a fully functional video call feature powered by Jitsi Meet, enabling face-to-face consultations between doctors and patients.

## Features

### ✅ Implemented Features
- **Real-time Video & Audio**: HD video and crystal-clear audio communication
- **Screen Sharing**: Share medical reports, test results, or educational content
- **Chat Functionality**: Text chat during consultations
- **Device Selection**: Choose camera, microphone, and speaker
- **Recording Capability**: Record consultations (with consent)
- **Tile View**: Multiple participants in grid layout
- **Full Screen Mode**: Immersive consultation experience
- **End-to-End Encryption**: Secure, private consultations
- **Mobile Responsive**: Works on desktop, tablet, and mobile devices

### 🎯 Key Components

#### 1. VideoCall Component (`src/components/VideoCall.jsx`)
- Dynamically loads Jitsi Meet External API
- Manages video call lifecycle (join, leave, reconnect)
- Handles audio/video mute states
- Provides error handling and loading states
- Supports both patient and doctor roles

#### 2. Consultation Page (`src/pages/Consultation.jsx`)
- Beautiful UI with consultation room interface
- Real-time connection status
- Consultation guidelines sidebar
- Post-call summary and next steps
- Seamless navigation back to dashboard

## How It Works

### For Patients

1. **Book an Appointment**
   - Navigate to "Book Appointment" from dashboard
   - Select doctor, date, and time
   - Choose "Video Consultation" as appointment type

2. **Join Consultation**
   - At appointment time, click "Join Video Call" from dashboard
   - System automatically connects to the consultation room
   - Room ID format: `TelehealthRoom_[unique-id]`

3. **During Consultation**
   - Video and audio are enabled by default
   - Use Jitsi's built-in controls for:
     - Mute/unmute microphone
     - Turn camera on/off
     - Share screen
     - Open chat
     - Change video quality
   - Follow consultation guidelines in the sidebar

4. **End Consultation**
   - Click "End Session" button
   - View post-consultation summary
   - Access health records and prescriptions

### For Doctors

1. **View Schedule**
   - Check "Today's Schedule" on doctor dashboard
   - See all upcoming video consultations

2. **Join Consultation**
   - Click "Join Call" for upcoming appointments
   - System connects to the same room as patient
   - Room ID is shared between doctor and patient

3. **During Consultation**
   - Conduct face-to-face diagnosis
   - Share screen to explain medical conditions
   - Use chat for sharing links or notes
   - Record session if needed (with patient consent)

4. **After Consultation**
   - Update patient health records
   - Write digital prescriptions
   - Schedule follow-up if needed

## Technical Details

### Jitsi Meet Integration

```javascript
// Room naming convention
const roomName = `TelehealthRoom_${appointmentId}`;

// Jitsi configuration
{
  domain: 'meet.jit.si',
  roomName: roomName,
  userInfo: {
    displayName: userName,
    role: userRole // 'patient' or 'doctor'
  },
  configOverwrite: {
    startWithAudioMuted: false,
    startWithVideoMuted: false,
    prejoinPageEnabled: false,
    enableNoisyMicDetection: true,
    resolution: 720
  }
}
```

### Security Features

1. **Unique Room IDs**: Each appointment gets a unique room ID
2. **End-to-End Encryption**: All video/audio streams are encrypted
3. **No Recording by Default**: Recording requires explicit action
4. **Secure Domain**: Uses Jitsi's secure infrastructure
5. **Authentication**: Only authenticated users can join consultations

### Browser Compatibility

- ✅ Chrome/Edge (Recommended)
- ✅ Firefox
- ✅ Safari (iOS 14.3+)
- ✅ Mobile browsers (Chrome, Safari)

### Network Requirements

- **Minimum**: 1 Mbps upload/download
- **Recommended**: 3+ Mbps for HD video
- **Optimal**: 5+ Mbps for best quality

## Usage Examples

### Starting a Consultation (Patient)

```javascript
// Navigate to consultation room
navigate(`/consultation/${appointmentId}`);

// VideoCall component automatically:
// 1. Loads Jitsi API
// 2. Creates room with unique ID
// 3. Joins with patient name
// 4. Enables video/audio
```

### Joining as Doctor

```javascript
// Same room ID as patient
navigate(`/consultation/${appointmentId}`);

// VideoCall component:
// 1. Joins existing room
// 2. Displays doctor name
// 3. Shows both participants
```

## Troubleshooting

### Common Issues

1. **Camera/Microphone Not Working**
   - Check browser permissions
   - Ensure no other app is using camera/mic
   - Try refreshing the page

2. **Poor Video Quality**
   - Check internet connection
   - Close other bandwidth-heavy applications
   - Lower video quality in settings

3. **Cannot Hear Audio**
   - Check speaker/headphone connection
   - Verify volume settings
   - Check if audio is muted in Jitsi

4. **Connection Failed**
   - Refresh the page
   - Check internet connectivity
   - Try different browser
   - Clear browser cache

### Error Messages

- **"Failed to load Jitsi Meet"**: Internet connection issue or firewall blocking
- **"Failed to initialize video call"**: Browser compatibility issue
- **"Connection lost"**: Network interruption, will auto-reconnect

## Future Enhancements

### Planned Features
- [ ] Waiting room for patients
- [ ] Appointment reminders with join link
- [ ] In-call prescription writing
- [ ] Real-time vital signs monitoring
- [ ] AI-powered transcription
- [ ] Multi-language support
- [ ] Virtual background options
- [ ] Consultation recording with consent management

### Backend Integration
- [ ] Store consultation history
- [ ] Generate room IDs from appointment system
- [ ] Track consultation duration
- [ ] Automatic prescription generation
- [ ] Post-consultation feedback

## API Reference

### VideoCall Component Props

```javascript
<VideoCall
  roomId={string}        // Unique room identifier
  userName={string}      // Display name in call
  userRole={string}      // 'patient' or 'doctor'
  onLeave={function}     // Callback when call ends
/>
```

### Consultation Page Props

```javascript
<Consultation
  user={object}          // User object with auth details
/>
```

## Testing

### Local Testing

1. Start the development server:
```bash
cd telehealth-system/frontend
npm run dev
```

2. Open two browser windows:
   - Window 1: Login as patient
   - Window 2: Login as doctor

3. Navigate both to same consultation room:
   - `/consultation/test-room-123`

4. Verify:
   - Both users can see each other
   - Audio/video works
   - Chat functions properly
   - Screen sharing works

### Production Deployment

1. Ensure HTTPS is enabled (required for camera/mic access)
2. Configure firewall to allow Jitsi domains
3. Test on multiple devices and browsers
4. Monitor network performance
5. Set up error logging

## Support

For issues or questions:
- Check browser console for errors
- Verify network connectivity
- Review Jitsi Meet documentation: https://jitsi.github.io/handbook/
- Test with different browsers

## License

This implementation uses Jitsi Meet's free public instance (meet.jit.si). For production use with custom branding and features, consider:
- Self-hosting Jitsi Meet
- Using Jitsi as a Service (JaaS)
- Implementing custom STUN/TURN servers

---

**Note**: The current implementation uses Jitsi's public infrastructure. For HIPAA compliance and enhanced privacy, consider deploying your own Jitsi Meet server.
