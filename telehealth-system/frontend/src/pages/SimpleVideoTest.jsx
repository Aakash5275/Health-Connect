import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export default function SimpleVideoTest() {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState('test-room-' + Math.random().toString(36).substr(2, 9));
  const [userName, setUserName] = useState('User-' + Math.random().toString(36).substr(2, 5));
  const [isJoined, setIsJoined] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [logs, setLogs] = useState([]);
  const containerRef = useRef(null);
  const jitsiApiRef = useRef(null);

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = { timestamp, message, type };
    setLogs(prev => [...prev, logEntry]);
    console.log(`[${type.toUpperCase()}] ${message}`);
  };

  const joinRoom = () => {
    if (!roomId.trim()) {
      alert('Please enter a room ID');
      return;
    }

    addLog(`Attempting to join room: ${roomId}`, 'info');
    addLog(`Your name: ${userName}`, 'info');

    // Load Jitsi script if not already loaded
    if (!window.JitsiMeetExternalAPI) {
      addLog('Loading Jitsi API...', 'info');
      const script = document.createElement('script');
      script.src = 'https://meet.jit.si/external_api.js';
      script.async = true;
      script.onload = () => {
        addLog('✓ Jitsi API loaded', 'success');
        initializeJitsi();
      };
      script.onerror = () => {
        addLog('✗ Failed to load Jitsi API', 'error');
      };
      document.body.appendChild(script);
    } else {
      initializeJitsi();
    }
  };

  const initializeJitsi = () => {
    try {
      const domain = 'meet.jit.si';
      const options = {
        roomName: roomId, // Use exact room ID without prefix
        width: '100%',
        height: 500,
        parentNode: containerRef.current,
        userInfo: {
          displayName: userName
        },
        configOverwrite: {
          startWithAudioMuted: false,
          startWithVideoMuted: false,
          prejoinPageEnabled: false,
          disableDeepLinking: true
        }
      };

      addLog(`Creating Jitsi instance for room: ${roomId}`, 'info');
      const api = new window.JitsiMeetExternalAPI(domain, options);
      jitsiApiRef.current = api;

      // Conference joined
      api.addListener('videoConferenceJoined', (data) => {
        addLog(`✓ YOU JOINED THE ROOM!`, 'success');
        addLog(`   Room: ${roomId}`, 'success');
        addLog(`   Your ID: ${data.id}`, 'success');
        setIsJoined(true);
        
        // Get initial participant count
        setTimeout(() => {
          const count = api.getNumberOfParticipants();
          addLog(`👥 Total participants: ${count + 1} (including you)`, 'info');
          if (count === 0) {
            addLog(`⚠️ You are alone in the room. Share this room ID with others: ${roomId}`, 'warning');
          }
        }, 1000);
      });

      // Participant joined
      api.addListener('participantJoined', (participant) => {
        addLog(`🎉 SOMEONE JOINED!`, 'success');
        addLog(`   Name: ${participant.displayName || 'Unknown'}`, 'success');
        addLog(`   ID: ${participant.id}`, 'success');
        setParticipants(prev => [...prev, participant]);
        
        const count = api.getNumberOfParticipants();
        addLog(`👥 Total participants now: ${count + 1}`, 'info');
      });

      // Participant left
      api.addListener('participantLeft', (participant) => {
        addLog(`👋 Someone left: ${participant.displayName || 'Unknown'}`, 'warning');
        setParticipants(prev => prev.filter(p => p.id !== participant.id));
      });

      // Conference left
      api.addListener('videoConferenceLeft', () => {
        addLog('You left the conference', 'info');
        setIsJoined(false);
        setParticipants([]);
      });

      addLog('✓ Jitsi initialized, waiting to join...', 'info');

    } catch (err) {
      addLog(`✗ Error: ${err.message}`, 'error');
      console.error('Jitsi error:', err);
    }
  };

  const leaveRoom = () => {
    if (jitsiApiRef.current) {
      jitsiApiRef.current.dispose();
      jitsiApiRef.current = null;
      setIsJoined(false);
      setParticipants([]);
      addLog('Left the room', 'info');
    }
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    addLog('✓ Room ID copied to clipboard!', 'success');
  };

  const getLogColor = (type) => {
    switch (type) {
      case 'success': return 'text-green-400';
      case 'error': return 'text-red-400';
      case 'warning': return 'text-yellow-400';
      default: return 'text-slate-300';
    }
  };

  useEffect(() => {
    return () => {
      if (jitsiApiRef.current) {
        jitsiApiRef.current.dispose();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Simple Video Call Test</h1>
          <p className="text-slate-400">Test if two users can connect to the same room</p>
        </div>

        {!isJoined ? (
          <Card className="bg-slate-900 border-slate-800 p-8 mb-6">
            <h2 className="text-xl font-bold text-white mb-6">Join a Room</h2>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-slate-300 mb-2 font-medium">Your Name</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-2 font-medium">Room ID</label>
                <input
                  type="text"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                  placeholder="Enter room ID"
                />
                <p className="text-slate-500 text-sm mt-2">
                  💡 Both users must use the EXACT same Room ID to connect
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <Button onClick={joinRoom} className="flex-1">
                Join Room
              </Button>
              <Button onClick={copyRoomId} variant="outline">
                Copy Room ID
              </Button>
            </div>

            <div className="mt-6 p-4 bg-blue-900/20 border border-blue-800 rounded-lg">
              <p className="text-blue-300 text-sm font-medium mb-2">📋 How to test with 2 users:</p>
              <ol className="text-blue-200 text-sm space-y-1 list-decimal list-inside">
                <li>Copy the Room ID above</li>
                <li>Open this page in another window/browser (incognito mode)</li>
                <li>Paste the same Room ID in both windows</li>
                <li>Click "Join Room" in both windows</li>
                <li>You should see each other!</li>
              </ol>
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card className="bg-slate-900 border-slate-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-white">Room: {roomId}</h2>
                  <p className="text-slate-400">Participants: {participants.length + 1}</p>
                </div>
                <Button onClick={leaveRoom} variant="danger">
                  Leave Room
                </Button>
              </div>

              {participants.length === 0 && (
                <div className="bg-yellow-900/20 border border-yellow-800 rounded-lg p-4 mb-4">
                  <p className="text-yellow-300 font-medium">⚠️ You are alone in this room</p>
                  <p className="text-yellow-200 text-sm mt-1">
                    Share this Room ID with another user: <strong>{roomId}</strong>
                  </p>
                  <Button onClick={copyRoomId} variant="outline" className="mt-3" size="sm">
                    Copy Room ID
                  </Button>
                </div>
              )}

              {participants.length > 0 && (
                <div className="bg-green-900/20 border border-green-800 rounded-lg p-4 mb-4">
                  <p className="text-green-300 font-medium">✅ Connected with {participants.length} other user(s)!</p>
                  <ul className="text-green-200 text-sm mt-2">
                    {participants.map((p, idx) => (
                      <li key={idx}>• {p.displayName || 'Unknown'}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div ref={containerRef} className="w-full bg-black rounded-lg" />
            </Card>

            <Card className="bg-slate-900 border-slate-800 p-6">
              <h3 className="text-lg font-bold text-white mb-4">Connection Logs</h3>
              <div className="bg-black rounded-lg p-4 h-64 overflow-y-auto font-mono text-sm">
                {logs.map((log, idx) => (
                  <div key={idx} className="mb-1">
                    <span className="text-slate-500">[{log.timestamp}]</span>{' '}
                    <span className={getLogColor(log.type)}>{log.message}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        <div className="mt-6">
          <Button onClick={() => navigate('/dashboard')} variant="outline">
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
