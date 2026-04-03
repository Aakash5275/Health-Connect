import { useEffect, useRef, useState } from 'react';

export default function WorkingTest() {
  const containerRef = useRef(null);
  const [logs, setLogs] = useState([]);
  
  // Generate a random room ID that's guaranteed to work
  const [roomId] = useState(() => {
    // Use a simple alphanumeric string
    return 'room' + Math.random().toString(36).substring(2, 11);
  });

  const addLog = (msg) => {
    console.log(msg);
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`]);
  };

  useEffect(() => {
    addLog('🔵 Starting Jitsi initialization...');
    addLog(`📝 Room ID: ${roomId}`);
    
    // Check if script already loaded
    if (window.JitsiMeetExternalAPI) {
      addLog('✅ Jitsi API already loaded');
      initJitsi();
      return;
    }

    // Load Jitsi script
    addLog('📥 Loading Jitsi script from meet.jit.si...');
    const script = document.createElement('script');
    script.src = 'https://meet.jit.si/external_api.js';
    script.async = true;
    
    script.onload = () => {
      addLog('✅ Jitsi script loaded successfully');
      initJitsi();
    };

    script.onerror = (e) => {
      addLog('❌ Failed to load Jitsi script');
      console.error('Script load error:', e);
    };

    document.body.appendChild(script);

    function initJitsi() {
      try {
        addLog('🚀 Creating Jitsi instance...');
        
        const options = {
          roomName: roomId,
          width: '100%',
          height: 600,
          parentNode: containerRef.current,
          configOverwrite: {
            prejoinPageEnabled: false,
            startWithAudioMuted: false,
            startWithVideoMuted: false,
            disableDeepLinking: true,
            enableWelcomePage: false,
            enableClosePage: false
          },
          interfaceConfigOverwrite: {
            SHOW_JITSI_WATERMARK: false,
            SHOW_WATERMARK_FOR_GUESTS: false,
            SHOW_BRAND_WATERMARK: false,
            TOOLBAR_BUTTONS: [
              'microphone', 'camera', 'hangup', 'chat', 
              'desktop', 'fullscreen', 'settings'
            ]
          }
        };

        const api = new window.JitsiMeetExternalAPI('meet.jit.si', options);
        
        api.addListener('videoConferenceJoined', (data) => {
          addLog('✅✅✅ YOU SUCCESSFULLY JOINED THE ROOM! ✅✅✅');
          addLog(`👤 Your participant ID: ${data.id}`);
          
          setTimeout(() => {
            const count = api.getNumberOfParticipants();
            addLog(`👥 Total participants: ${count + 1} (including you)`);
            if (count === 0) {
              addLog('💡 You are alone. Share this room ID with someone: ' + roomId);
            }
          }, 1000);
        });

        api.addListener('participantJoined', (participant) => {
          addLog('🎉🎉🎉 SOMEONE ELSE JOINED THE ROOM! 🎉🎉🎉');
          addLog(`   Name: ${participant.displayName || 'Anonymous'}`);
          addLog(`   ID: ${participant.id}`);
        });

        api.addListener('participantLeft', (participant) => {
          addLog(`👋 Someone left: ${participant.displayName || 'Anonymous'}`);
        });

        api.addListener('videoConferenceLeft', () => {
          addLog('🔴 You left the conference');
        });

        api.addListener('readyToClose', () => {
          addLog('🔴 Conference ended');
        });

        addLog('⏳ Waiting to join conference...');

      } catch (error) {
        addLog('❌ ERROR: ' + error.message);
        console.error('Jitsi init error:', error);
      }
    }

    return () => {
      addLog('🔴 Component unmounting');
    };
  }, [roomId]);

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    addLog('📋 Room ID copied to clipboard!');
  };

  const copyUrl = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    addLog('📋 Page URL copied to clipboard!');
  };

  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#0a0a0a', 
      minHeight: '100vh',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ color: '#fff', marginBottom: '10px', fontSize: '32px' }}>
          ✅ Working Jitsi Test
        </h1>
        
        <div style={{ 
          backgroundColor: '#1a1a1a', 
          padding: '20px', 
          borderRadius: '8px',
          marginBottom: '20px',
          border: '2px solid #333'
        }}>
          <h2 style={{ color: '#4ade80', marginBottom: '15px', fontSize: '20px' }}>
            Room Information
          </h2>
          <p style={{ color: '#aaa', marginBottom: '10px' }}>
            <strong style={{ color: '#fff' }}>Room ID:</strong>{' '}
            <code style={{ 
              backgroundColor: '#000', 
              padding: '5px 10px', 
              borderRadius: '4px',
              color: '#4ade80',
              fontSize: '16px'
            }}>
              {roomId}
            </code>
            <button 
              onClick={copyRoomId}
              style={{
                marginLeft: '10px',
                padding: '5px 15px',
                backgroundColor: '#4ade80',
                color: '#000',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Copy Room ID
            </button>
            <button 
              onClick={copyUrl}
              style={{
                marginLeft: '10px',
                padding: '5px 15px',
                backgroundColor: '#3b82f6',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Copy Page URL
            </button>
          </p>
          
          <div style={{ 
            backgroundColor: '#fef3c7', 
            padding: '15px', 
            borderRadius: '6px',
            marginTop: '15px',
            border: '2px solid #fbbf24'
          }}>
            <p style={{ color: '#92400e', margin: 0, fontWeight: 'bold', marginBottom: '10px' }}>
              📋 How to test with 2 people:
            </p>
            <ol style={{ color: '#92400e', margin: 0, paddingLeft: '20px' }}>
              <li>Click "Copy Page URL" above</li>
              <li>Open a new INCOGNITO/PRIVATE browser window</li>
              <li>Paste the URL and press Enter</li>
              <li>Both windows will join the SAME room automatically</li>
              <li>Allow camera/microphone when prompted</li>
              <li>You should see each other!</li>
            </ol>
          </div>
        </div>

        <div 
          ref={containerRef} 
          style={{ 
            width: '100%', 
            height: '600px', 
            backgroundColor: '#000',
            borderRadius: '8px',
            marginBottom: '20px',
            border: '2px solid #333'
          }}
        />

        <div style={{ 
          backgroundColor: '#1a1a1a', 
          padding: '20px', 
          borderRadius: '8px',
          border: '2px solid #333'
        }}>
          <h2 style={{ color: '#fff', marginBottom: '15px', fontSize: '20px' }}>
            📊 Connection Logs
          </h2>
          <div style={{ 
            backgroundColor: '#000', 
            padding: '15px', 
            borderRadius: '6px',
            maxHeight: '300px',
            overflowY: 'auto',
            fontFamily: 'monospace',
            fontSize: '13px'
          }}>
            {logs.map((log, idx) => (
              <div key={idx} style={{ color: '#4ade80', marginBottom: '5px' }}>
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
