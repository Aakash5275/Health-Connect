import { useState, useEffect, useRef } from 'react';

// Jitsi room names must be alphanumeric, hyphen, or underscore only
function sanitizeRoomName(id) {
  if (!id || typeof id !== 'string') return 'room-1';
  return id.replace(/[^a-zA-Z0-9-_]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'room-1';
}

function VideoCall({ roomId, userName, onLeave, userRole = 'patient' }) {
  const [isJoined, setIsJoined] = useState(false);
  const [showConnectingOverlay, setShowConnectingOverlay] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [error, setError] = useState(null);
  const jitsiApiRef = useRef(null);
  const containerRef = useRef(null);

  // Hide our overlay after a few seconds so Jitsi iframe (permission/prejoin) is visible
  useEffect(() => {
    const t = setTimeout(() => setShowConnectingOverlay(false), 4000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const safeRoomId = sanitizeRoomName(roomId);
    // Use simple room name without prefix to avoid lobby restrictions
    const roomName = safeRoomId;

    const loadJitsi = async () => {
      try {
        const domain = import.meta.env.VITE_JITSI_DOMAIN || 'meet.jit.si';
        const options = {
          roomName,
          width: '100%',
          height: '100%',
          parentNode: containerRef.current,
          userInfo: {
            displayName: userName || 'User',
            email: '',
            role: userRole
          },
          configOverwrite: {
            startWithAudioMuted: false,
            startWithVideoMuted: false,
            prejoinPageEnabled: true,
            disableDeepLinking: true,
            enableWelcomePage: false,
            enableClosePage: false,
            defaultLanguage: 'en',
            enableNoisyMicDetection: true,
            resolution: 720,
            constraints: {
              video: {
                height: { ideal: 720, max: 1080, min: 360 }
              }
            }
          },
          interfaceConfigOverwrite: {
            TOOLBAR_BUTTONS: [
              'microphone', 'camera', 'closedcaptions', 'desktop', 
              'fullscreen', 'fodeviceselection', 'hangup', 'chat', 
              'settings', 'videoquality', 'filmstrip', 'tileview'
            ],
            SHOW_JITSI_WATERMARK: false,
            SHOW_WATERMARK_FOR_GUESTS: false,
            SHOW_BRAND_WATERMARK: false,
            BRAND_WATERMARK_LINK: '',
            SHOW_POWERED_BY: false,
            MOBILE_APP_PROMO: false,
            DISABLE_JOIN_LEAVE_NOTIFICATIONS: false
          }
        };

        // Load Jitsi API script dynamically
        if (!window.JitsiMeetExternalAPI) {
          const script = document.createElement('script');
          script.src = 'https://meet.jit.si/external_api.js';
          script.async = true;
          script.onload = () => {
            initializeJitsi(domain, options);
          };
          script.onerror = () => {
            setError('Failed to load Jitsi Meet. Please check your internet connection.');
          };
          document.body.appendChild(script);
        } else {
          initializeJitsi(domain, options);
        }
      } catch (err) {
        setError('Failed to load video call. Please try again.');
        console.error('Jitsi error:', err);
      }
    };

    const initializeJitsi = (domain, options) => {
      const node = containerRef.current;
      if (!node) {
        console.warn('VideoCall: container not ready, retrying...');
        return;
      }
      try {
        console.log('🚀 Initializing Jitsi with room:', roomName);
        const api = new window.JitsiMeetExternalAPI(domain, options);
        jitsiApiRef.current = api;

        api.addListener('videoConferenceJoined', (data) => {
          console.log('✅ User joined the conference:', data);
          console.log('👤 Display name:', userName, '| 🏠 Room:', roomName);
          setIsJoined(true);
          setShowConnectingOverlay(false);
          setTimeout(() => {
            const count = api.getNumberOfParticipants();
            console.log('👥 Total participants in room:', count + 1);
          }, 2000);
        });

        api.addListener('videoConferenceLeft', () => {
          console.log('👋 User left the conference');
          setIsJoined(false);
          if (onLeave) onLeave();
        });

        api.addListener('participantJoined', (participant) => {
          console.log('🎉 NEW PARTICIPANT JOINED:', participant.displayName);
        });

        api.addListener('participantLeft', (participant) => {
          console.log('👋 Participant left:', participant.displayName);
        });

        api.addListener('audioMuteStatusChanged', (e) => {
          setIsAudioEnabled(!e.muted);
        });

        api.addListener('videoMuteStatusChanged', (e) => {
          setIsVideoEnabled(!e.muted);
        });

        api.addListener('readyToClose', () => {
          if (onLeave) onLeave();
        });
      } catch (err) {
        console.error('❌ Error initializing Jitsi:', err);
        setError('Failed to initialize video call.');
      }
    };

    // Ensure container is mounted (ref is set after commit)
    const start = () => {
      if (containerRef.current) {
        loadJitsi();
      } else {
        requestAnimationFrame(() => {
          if (containerRef.current) loadJitsi();
        });
      }
    };
    start();

    return () => {
      if (jitsiApiRef.current) {
        jitsiApiRef.current.dispose();
        jitsiApiRef.current = null;
      }
    };
  }, [roomId, userName, onLeave, userRole]);

  const handleToggleVideo = () => {
    if (jitsiApiRef.current) {
      jitsiApiRef.current.executeCommand('toggleVideo');
    }
  };

  const handleToggleAudio = () => {
    if (jitsiApiRef.current) {
      jitsiApiRef.current.executeCommand('toggleAudio');
    }
  };

  const handleLeave = () => {
    if (jitsiApiRef.current) {
      jitsiApiRef.current.executeCommand('hangup');
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-slate-900 rounded-2xl p-8">
        <div className="text-red-400 mb-4">
          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-white text-lg mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full min-h-[400px]">
      {/* Jitsi Container - iframe is appended here by Jitsi */}
      <div ref={containerRef} className="w-full h-full min-h-[400px] bg-slate-900" />
      {/* Overlay: hide after 4s or when joined so Jitsi prejoin/permission UI is visible */}
      {showConnectingOverlay && !error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 z-10 pointer-events-none">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4" />
          <p className="text-white text-lg font-semibold">Connecting to consultation room...</p>
          <p className="text-slate-400 text-sm mt-2">Room: {sanitizeRoomName(roomId)}</p>
          <p className="text-slate-500 text-xs mt-4">Allow camera & microphone when prompted, then click Join</p>
        </div>
      )}
    </div>
  );
}
export default VideoCall;
