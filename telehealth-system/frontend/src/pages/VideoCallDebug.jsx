import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export default function VideoCallDebug() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [permissions, setPermissions] = useState({ video: null, audio: null });
  const [jitsiLoaded, setJitsiLoaded] = useState(false);
  const localVideoRef = useRef(null);
  const containerRef = useRef(null);
  const jitsiApiRef = useRef(null);

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { timestamp, message, type }]);
    console.log(`[${type.toUpperCase()}] ${message}`);
  };

  // Test 1: Check media permissions
  const testMediaPermissions = async () => {
    addLog('Testing media permissions...', 'info');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      setPermissions({ video: true, audio: true });
      addLog('✓ Camera and microphone access granted', 'success');
      
      // Display local video
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      
      return stream;
    } catch (error) {
      addLog(`✗ Media permission error: ${error.message}`, 'error');
      setPermissions({ 
        video: error.name === 'NotAllowedError' ? false : null,
        audio: error.name === 'NotAllowedError' ? false : null
      });
      return null;
    }
  };

  // Test 2: Load Jitsi
  const testJitsiLoad = () => {
    addLog('Loading Jitsi Meet API...', 'info');
    
    if (window.JitsiMeetExternalAPI) {
      addLog('✓ Jitsi API already loaded', 'success');
      setJitsiLoaded(true);
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://meet.jit.si/external_api.js';
      script.async = true;
      
      script.onload = () => {
        addLog('✓ Jitsi API loaded successfully', 'success');
        setJitsiLoaded(true);
        resolve();
      };
      
      script.onerror = () => {
        addLog('✗ Failed to load Jitsi API', 'error');
        reject(new Error('Failed to load Jitsi'));
      };
      
      document.body.appendChild(script);
    });
  };

  // Test 3: Initialize Jitsi call
  const testJitsiCall = async () => {
    if (!window.JitsiMeetExternalAPI) {
      addLog('✗ Jitsi API not loaded', 'error');
      return;
    }

    addLog(`Initializing Jitsi call for room: TelehealthRoom_${roomId}`, 'info');

    try {
      const domain = 'meet.jit.si';
      const options = {
        roomName: `TelehealthRoom_${roomId}`,
        width: '100%',
        height: 500,
        parentNode: containerRef.current,
        userInfo: {
          displayName: 'Test User'
        },
        configOverwrite: {
          startWithAudioMuted: false,
          startWithVideoMuted: false,
          prejoinPageEnabled: false,
          disableDeepLinking: true
        },
        interfaceConfigOverwrite: {
          TOOLBAR_BUTTONS: [
            'microphone', 'camera', 'hangup', 'chat'
          ]
        }
      };

      const api = new window.JitsiMeetExternalAPI(domain, options);
      jitsiApiRef.current = api;

      api.addListener('videoConferenceJoined', () => {
        addLog('✓ Successfully joined video conference!', 'success');
      });

      api.addListener('videoConferenceLeft', () => {
        addLog('Left video conference', 'info');
      });

      api.addListener('participantJoined', (participant) => {
        addLog(`✓ Participant joined: ${participant.displayName}`, 'success');
      });

      api.addListener('participantLeft', (participant) => {
        addLog(`Participant left: ${participant.displayName}`, 'info');
      });

      addLog('✓ Jitsi call initialized', 'success');
    } catch (error) {
      addLog(`✗ Error initializing Jitsi: ${error.message}`, 'error');
    }
  };

  // Run all tests
  const runAllTests = async () => {
    setLogs([]);
    addLog('Starting diagnostic tests...', 'info');
    
    // Test 1: Media permissions
    await testMediaPermissions();
    
    // Test 2: Load Jitsi
    try {
      await testJitsiLoad();
      
      // Test 3: Initialize call
      setTimeout(() => {
        testJitsiCall();
      }, 1000);
    } catch (error) {
      addLog(`Test failed: ${error.message}`, 'error');
    }
  };

  useEffect(() => {
    runAllTests();

    return () => {
      if (jitsiApiRef.current) {
        jitsiApiRef.current.dispose();
      }
    };
  }, []);

  const getLogColor = (type) => {
    switch (type) {
      case 'success': return 'text-green-400';
      case 'error': return 'text-red-400';
      case 'warning': return 'text-yellow-400';
      default: return 'text-slate-300';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Video Call Diagnostics</h1>
          <p className="text-slate-400">Room ID: {roomId}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Local Video Preview */}
          <Card className="bg-slate-900 border-slate-800 p-6">
            <h2 className="text-xl font-bold text-white mb-4">Local Video Preview</h2>
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-64 bg-black rounded-lg"
            />
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Camera:</span>
                <span className={permissions.video === true ? 'text-green-400' : permissions.video === false ? 'text-red-400' : 'text-yellow-400'}>
                  {permissions.video === true ? '✓ Enabled' : permissions.video === false ? '✗ Denied' : '⋯ Pending'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Microphone:</span>
                <span className={permissions.audio === true ? 'text-green-400' : permissions.audio === false ? 'text-red-400' : 'text-yellow-400'}>
                  {permissions.audio === true ? '✓ Enabled' : permissions.audio === false ? '✗ Denied' : '⋯ Pending'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Jitsi API:</span>
                <span className={jitsiLoaded ? 'text-green-400' : 'text-yellow-400'}>
                  {jitsiLoaded ? '✓ Loaded' : '⋯ Loading'}
                </span>
              </div>
            </div>
          </Card>

          {/* Diagnostic Logs */}
          <Card className="bg-slate-900 border-slate-800 p-6">
            <h2 className="text-xl font-bold text-white mb-4">Diagnostic Logs</h2>
            <div className="bg-black rounded-lg p-4 h-64 overflow-y-auto font-mono text-sm">
              {logs.map((log, idx) => (
                <div key={idx} className="mb-1">
                  <span className="text-slate-500">[{log.timestamp}]</span>{' '}
                  <span className={getLogColor(log.type)}>{log.message}</span>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button onClick={runAllTests} className="w-full">
                Run Tests Again
              </Button>
            </div>
          </Card>
        </div>

        {/* Jitsi Container */}
        <Card className="bg-slate-900 border-slate-800 p-6">
          <h2 className="text-xl font-bold text-white mb-4">Jitsi Video Call</h2>
          <div ref={containerRef} className="w-full bg-black rounded-lg" />
        </Card>

        <div className="mt-6 flex gap-4">
          <Button onClick={() => navigate('/dashboard')} variant="outline">
            Back to Dashboard
          </Button>
          <Button onClick={() => navigate(`/consultation/${roomId}`)}>
            Go to Normal Video Call
          </Button>
        </div>
      </div>
    </div>
  );
}
