import { useEffect, useRef, useState } from 'react';

export default function UltraSimpleTest() {
  const containerRef = useRef(null);
  const [status, setStatus] = useState('Loading...');
  const [roomName] = useState('vcdemo' + Date.now());

  useEffect(() => {
    setStatus('Loading Jitsi script...');
    
    // Load Jitsi script
    const script = document.createElement('script');
    script.src = 'https://8x8.vc/vpaas-magic-cookie-1dbdb39c5e0e4d1fa8c2e8e8e8e8e8e8/external_api.js';
    script.async = true;
    
    script.onload = () => {
      setStatus('Script loaded, initializing...');
      
      try {
        const domain = '8x8.vc';
        const options = {
          roomName: 'vpaas-magic-cookie-1dbdb39c5e0e4d1fa8c2e8e8e8e8e8e8/' + roomName,
          width: '100%',
          height: 600,
          parentNode: containerRef.current,
          configOverwrite: {
            startWithAudioMuted: true,
            startWithVideoMuted: true,
            prejoinPageEnabled: false
          }
        };

        const api = new window.JitsiMeetExternalAPI(domain, options);
        
        api.addListener('videoConferenceJoined', () => {
          setStatus('✅ JOINED! Room: ' + roomName);
          console.log('✅ Successfully joined room:', roomName);
        });

        api.addListener('participantJoined', (p) => {
          console.log('🎉 Participant joined:', p);
          setStatus('✅ JOINED! Someone else is here too!');
        });

        setStatus('Connecting to room: ' + roomName);

      } catch (error) {
        setStatus('❌ Error: ' + error.message);
        console.error('Error:', error);
      }
    };

    script.onerror = () => {
      setStatus('❌ Failed to load Jitsi script');
    };

    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [roomName]);

  return (
    <div style={{ padding: '20px', backgroundColor: '#000', minHeight: '100vh', color: '#fff' }}>
      <h1 style={{ marginBottom: '10px' }}>Ultra Simple Jitsi Test</h1>
      <p style={{ marginBottom: '20px', fontSize: '18px', fontWeight: 'bold', color: '#0f0' }}>
        Status: {status}
      </p>
      <p style={{ marginBottom: '20px', color: '#aaa' }}>
        Room Name: <strong style={{ color: '#fff' }}>{roomName}</strong>
      </p>
      <p style={{ marginBottom: '20px', color: '#ff0' }}>
        📋 To test with 2 people: Copy the room name above, open this page in another browser/window, 
        and you'll need to manually edit the code to use the same room name.
      </p>
      <div 
        ref={containerRef} 
        style={{ 
          width: '100%', 
          height: '600px', 
          backgroundColor: '#222',
          border: '2px solid #444'
        }}
      />
    </div>
  );
}
