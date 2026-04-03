# Video Call System Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    Telehealth Video Call System                  │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐                                    ┌──────────────┐
│   Patient    │                                    │    Doctor    │
│   Browser    │                                    │   Browser    │
└──────┬───────┘                                    └──────┬───────┘
       │                                                   │
       │ 1. Navigate to /consultation/:roomId             │
       │                                                   │
       ▼                                                   ▼
┌──────────────────────────────────────────────────────────────────┐
│                     React Application                             │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │              Consultation Page Component                    │  │
│  │  - Loads VideoCall component                               │  │
│  │  - Manages consultation state                              │  │
│  │  - Handles user role (patient/doctor)                      │  │
│  └────────────────────┬───────────────────────────────────────┘  │
│                       │                                           │
│                       ▼                                           │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │              VideoCall Component                            │  │
│  │  - Loads Jitsi Meet External API                           │  │
│  │  - Creates/joins room with unique ID                       │  │
│  │  - Manages video/audio streams                             │  │
│  │  - Handles events (join, leave, mute, etc.)                │  │
│  └────────────────────┬───────────────────────────────────────┘  │
└────────────────────────┼───────────────────────────────────────────┘
                         │
                         │ 2. Load Jitsi API Script
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│              Jitsi Meet External API (meet.jit.si)               │
│  - Provides video conferencing infrastructure                   │
│  - Handles WebRTC connections                                   │
│  - Manages STUN/TURN servers                                    │
│  - Provides UI controls                                         │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     │ 3. Establish P2P Connection
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                    WebRTC P2P Connection                         │
│  ┌──────────────┐         Encrypted         ┌──────────────┐   │
│  │   Patient    │◄──────────────────────────►│    Doctor    │   │
│  │  Video/Audio │         Stream             │  Video/Audio │   │
│  └──────────────┘                            └──────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Component Flow

### 1. User Journey

#### Patient Flow
```
Login → Dashboard → View Appointments → Click "Join Video Call"
  ↓
Navigate to /consultation/:roomId
  ↓
Consultation Page Loads
  ↓
VideoCall Component Initializes
  ↓
Jitsi API Loads
  ↓
Join Room with Patient Name
  ↓
Grant Camera/Mic Permissions
  ↓
Video Call Active
  ↓
End Call → Post-Consultation Screen
```

#### Doctor Flow
```
Login → Doctor Dashboard → View Today's Schedule → Click "Join Call"
  ↓
Navigate to /consultation/:roomId (same as patient)
  ↓
Consultation Page Loads
  ↓
VideoCall Component Initializes
  ↓
Jitsi API Loads
  ↓
Join Room with Doctor Name
  ↓
Grant Camera/Mic Permissions
  ↓
Video Call Active (sees patient)
  ↓
End Call → Update Records
```

### 2. Component Hierarchy

```
App.jsx
  └── Router
      └── Route: /consultation/:roomId
          └── Consultation.jsx
              ├── Header (connection status, end call button)
              ├── VideoCall.jsx (main video component)
              │   ├── Jitsi Container (ref-based)
              │   ├── Loading State
              │   └── Error State
              └── Sidebar (consultation guidelines)
```

### 3. State Management

```javascript
Consultation Component State:
├── appointment (object)
├── loading (boolean)
├── callEnded (boolean)
├── userRole (string: 'patient' | 'doctor')
└── displayName (string)

VideoCall Component State:
├── isJoined (boolean)
├── isVideoEnabled (boolean)
├── isAudioEnabled (boolean)
├── error (string | null)
└── jitsiApiRef (React.useRef)
```

## Data Flow

### Room Creation & Joining

```
┌─────────────────────────────────────────────────────────────────┐
│                      Room ID Generation                          │
└─────────────────────────────────────────────────────────────────┘

Appointment Created
  ↓
Generate Unique Room ID: `TelehealthRoom_${appointmentId}`
  ↓
Store in Database
  ↓
Share with Patient & Doctor
  ↓
Both Navigate to /consultation/:roomId
  ↓
Jitsi Creates/Joins Room
  ↓
P2P Connection Established
```

### Video Stream Flow

```
┌──────────────┐                                    ┌──────────────┐
│   Patient    │                                    │    Doctor    │
└──────┬───────┘                                    └──────┬───────┘
       │                                                   │
       │ 1. Capture local video/audio                     │
       │                                                   │
       ▼                                                   ▼
┌──────────────┐                                    ┌──────────────┐
│   Browser    │                                    │   Browser    │
│   WebRTC     │                                    │   WebRTC     │
└──────┬───────┘                                    └──────┬───────┘
       │                                                   │
       │ 2. Encode & encrypt stream                       │
       │                                                   │
       ▼                                                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Jitsi Meet Server                             │
│  - STUN/TURN servers for NAT traversal                          │
│  - Signaling for connection setup                               │
│  - Media routing (if P2P fails)                                 │
└─────────────────────────────────────────────────────────────────┘
       │                                                   │
       │ 3. Establish P2P connection                      │
       │◄─────────────────────────────────────────────────┤
       │                                                   │
       │ 4. Stream video/audio directly                   │
       │◄─────────────────────────────────────────────────►
       │                                                   │
```

## Technical Architecture

### Frontend Stack

```
┌─────────────────────────────────────────────────────────────────┐
│                         React App                                │
├─────────────────────────────────────────────────────────────────┤
│  UI Layer                                                        │
│  ├── React Components                                           │
│  ├── Tailwind CSS                                               │
│  ├── Framer Motion (animations)                                 │
│  └── Lucide Icons                                               │
├─────────────────────────────────────────────────────────────────┤
│  State Management                                                │
│  ├── React Hooks (useState, useEffect, useRef)                 │
│  ├── React Router (navigation)                                  │
│  └── Local Storage (user preferences)                           │
├─────────────────────────────────────────────────────────────────┤
│  Video Layer                                                     │
│  ├── Jitsi Meet External API                                   │
│  ├── WebRTC (browser native)                                    │
│  └── Media Devices API                                          │
├─────────────────────────────────────────────────────────────────┤
│  Authentication                                                  │
│  ├── Firebase Auth                                              │
│  └── Role-based Access Control                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Jitsi Integration

```javascript
// 1. Load Jitsi API
<script src="https://meet.jit.si/external_api.js"></script>

// 2. Initialize
const api = new JitsiMeetExternalAPI('meet.jit.si', {
  roomName: 'TelehealthRoom_123',
  parentNode: containerRef.current,
  userInfo: { displayName: 'Dr. Smith', role: 'doctor' },
  configOverwrite: { /* settings */ }
});

// 3. Listen to events
api.addListener('videoConferenceJoined', () => {
  console.log('User joined');
});

// 4. Control meeting
api.executeCommand('toggleVideo');
api.executeCommand('toggleAudio');
api.executeCommand('hangup');

// 5. Cleanup
api.dispose();
```

## Security Architecture

### Authentication Flow

```
User Login
  ↓
Firebase Authentication
  ↓
JWT Token Generated
  ↓
Token Stored in Browser
  ↓
Protected Route Check
  ↓
If Authenticated → Allow Access to /consultation/:roomId
  ↓
If Not Authenticated → Redirect to /login
```

### Encryption

```
┌─────────────────────────────────────────────────────────────────┐
│                    End-to-End Encryption                         │
├─────────────────────────────────────────────────────────────────┤
│  1. WebRTC DTLS-SRTP                                            │
│     - Encrypts media streams                                     │
│     - Keys negotiated per session                                │
│                                                                  │
│  2. Signaling Encryption                                         │
│     - HTTPS for API calls                                        │
│     - WSS for WebSocket connections                              │
│                                                                  │
│  3. Data at Rest                                                 │
│     - Firebase encryption                                        │
│     - No video stored on servers                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Network Architecture

### Connection Types

```
┌─────────────────────────────────────────────────────────────────┐
│                    Connection Scenarios                          │
└─────────────────────────────────────────────────────────────────┘

Scenario 1: Direct P2P (Best)
┌──────────┐                              ┌──────────┐
│ Patient  │◄────────────────────────────►│  Doctor  │
└──────────┘      Direct Connection       └──────────┘
Latency: 10-50ms | Quality: Excellent

Scenario 2: STUN-assisted P2P (Good)
┌──────────┐                              ┌──────────┐
│ Patient  │◄────────────────────────────►│  Doctor  │
└──────────┘                              └──────────┘
     │                                         │
     └──────────► STUN Server ◄───────────────┘
                (NAT traversal)
Latency: 50-100ms | Quality: Good

Scenario 3: TURN Relay (Acceptable)
┌──────────┐         ┌──────────┐         ┌──────────┐
│ Patient  │────────►│   TURN   │────────►│  Doctor  │
└──────────┘         │  Server  │         └──────────┘
                     └──────────┘
Latency: 100-200ms | Quality: Fair
```

## Scalability

### Current Setup (Free Tier)

```
Jitsi Meet (meet.jit.si)
├── Concurrent Rooms: Unlimited
├── Participants per Room: 75+
├── Video Quality: Up to 1080p
├── Bandwidth: Shared infrastructure
└── Cost: Free
```

### Production Setup (Self-Hosted)

```
Self-Hosted Jitsi
├── Dedicated Server
├── Custom Domain
├── Unlimited Rooms
├── Custom Branding
├── Better Performance
├── HIPAA Compliance
└── Full Control
```

## Monitoring & Analytics

### Metrics to Track

```
┌─────────────────────────────────────────────────────────────────┐
│                      Key Metrics                                 │
├─────────────────────────────────────────────────────────────────┤
│  User Metrics                                                    │
│  ├── Total consultations                                        │
│  ├── Average call duration                                      │
│  ├── User satisfaction                                          │
│  └── Drop-off rate                                              │
├─────────────────────────────────────────────────────────────────┤
│  Technical Metrics                                               │
│  ├── Connection success rate                                    │
│  ├── Video quality (resolution, fps)                            │
│  ├── Audio quality (bitrate, packet loss)                       │
│  ├── Latency (RTT)                                              │
│  └── Error rate                                                 │
├─────────────────────────────────────────────────────────────────┤
│  Performance Metrics                                             │
│  ├── Page load time                                             │
│  ├── Time to first video frame                                  │
│  ├── CPU usage                                                  │
│  └── Memory usage                                               │
└─────────────────────────────────────────────────────────────────┘
```

## Error Handling

### Error Flow

```
Error Occurs
  ↓
Catch in VideoCall Component
  ↓
Set Error State
  ↓
Display User-Friendly Message
  ↓
Log to Console (dev) / Sentry (prod)
  ↓
Offer Recovery Options:
  ├── Refresh Page
  ├── Try Different Browser
  ├── Check Permissions
  └── Contact Support
```

## Future Enhancements

### Planned Architecture Improvements

```
┌─────────────────────────────────────────────────────────────────┐
│                    Future Enhancements                           │
├─────────────────────────────────────────────────────────────────┤
│  1. Waiting Room                                                 │
│     - Queue system for patients                                  │
│     - Doctor approval to join                                    │
│                                                                  │
│  2. Recording & Transcription                                    │
│     - Server-side recording                                      │
│     - AI transcription                                           │
│     - Automatic notes generation                                 │
│                                                                  │
│  3. Advanced Features                                            │
│     - Virtual backgrounds                                        │
│     - Noise cancellation                                         │
│     - Real-time translation                                      │
│     - Screen annotation                                          │
│                                                                  │
│  4. Integration                                                  │
│     - EHR systems                                                │
│     - Payment gateways                                           │
│     - Insurance verification                                     │
│     - Prescription e-signing                                     │
└─────────────────────────────────────────────────────────────────┘
```

---

This architecture provides a solid foundation for a production-ready telehealth video consultation system with room for growth and enhancement.
