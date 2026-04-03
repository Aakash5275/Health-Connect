import { useEffect, useRef } from 'react';

export default function BasicJitsiTest() {
  const containerRef = useRef(null);

  useEffect(() => {
    console.log('🔵 BasicJitsiTest mounted');
    
    // Load Jitsi script
    const script = document.createElement('script');
    script.src = 'https://meet.jit.si/external_api.js';
    script.async = true;
    
    script.onload = () => {
      console.log('✅ Jitsi script loaded');
      
      // Initialize Jitsi
      try {
        const api = new window.JitsiMeetExternalAPI('meet.jit.si', {
          roomName: 'TestRoom' + Math.random().toString(36).substr(2, 9),
          width: '100%',
          height: 600,
          parentNode: containerRef.current,
          configOverwrite: {
            prejoinPageEnabled: false
          }
        });

        console.log('✅ Jitsi API initialized');

        api.addListener('videoConferenceJoined', () => {
          console.log('✅✅✅ YOU JOINED THE CONFERENCE! ✅✅✅');
        });

        api.addListener('participantJoined', (participant) => {
          console.log('🎉🎉🎉 SOMEONE ELSE JOINED! 🎉🎉🎉', participant);
        });

      } catch (error) {
        console.error('❌ Error initializing Jitsi:', error);
      }
    };

    script.onerror = () => {
      console.error('❌ Failed to load Jitsi script');
    };

    document.body.appendChild(script);

    return () => {
      console.log('🔴 BasicJitsiTest unmounting');
    };
  }, []);

  return (
    <div style={{ padding: '20px', backgroundColor: '#1a1a1a', minHeight: '100vh' }}>
      <h1 style={{ color: 'white', marginBottom: '20px' }}>
        Basic Jitsi Test - Random Room
      </h1>
      <p style={{ color: '#aaa', marginBottom: '20px' }}>
        Each page load creates a unique room. Open this same page in another window/browser to test connection.
        Check browser console (F12) for logs.
      </p>
      <div 
        ref={containerRef} 
        style={{ 
          width: '100%', 
          height: '600px', 
          backgroundColor: '#000',
          borderRadius: '8px'
        }}
      />
    </div>
  );
}
