import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Video, Users, Copy, Check } from 'lucide-react';

export default function VideoCallTest() {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState('');
  const [userName, setUserName] = useState('');
  const [copied, setCopied] = useState(false);

  const generateRoomId = () => {
    const id = `room-${Math.random().toString(36).substr(2, 9)}`;
    setRoomId(id);
    return id;
  };

  const handleCreateRoom = () => {
    const newRoomId = generateRoomId();
    if (userName) {
      navigate(`/consultation/${newRoomId}`);
    } else {
      alert('Please enter your name');
    }
  };

  const handleJoinRoom = () => {
    if (!roomId) {
      alert('Please enter a room ID');
      return;
    }
    if (!userName) {
      alert('Please enter your name');
      return;
    }
    navigate(`/consultation/${roomId}`);
  };

  const copyRoomLink = () => {
    const link = `${window.location.origin}/consultation/${roomId}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 text-white rounded-2xl mb-4">
            <Video size={32} />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Video Call Test</h1>
          <p className="text-slate-600">Test the Jitsi video call integration</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Create Room */}
          <Card className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
                <Video size={20} />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Create New Room</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <Button 
                onClick={handleCreateRoom}
                className="w-full h-12"
              >
                Create & Join Room
              </Button>

              {roomId && (
                <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="text-xs font-medium text-slate-600 mb-2">Share this Room ID:</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded text-sm font-mono">
                      {roomId}
                    </code>
                    <button
                      onClick={copyRoomLink}
                      className="p-2 hover:bg-slate-200 rounded transition-colors"
                      title="Copy room link"
                    >
                      {copied ? (
                        <Check size={18} className="text-emerald-600" />
                      ) : (
                        <Copy size={18} className="text-slate-600" />
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Join Room */}
          <Card className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                <Users size={20} />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Join Existing Room</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Room ID
                </label>
                <input
                  type="text"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  placeholder="Enter room ID"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <Button 
                onClick={handleJoinRoom}
                variant="secondary"
                className="w-full h-12"
              >
                Join Room
              </Button>
            </div>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
            <span className="text-blue-600">💡</span>
            How to Test
          </h3>
          <ol className="space-y-2 text-sm text-slate-700">
            <li className="flex gap-2">
              <span className="font-bold text-blue-600">1.</span>
              <span>Enter your name and click "Create & Join Room"</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-blue-600">2.</span>
              <span>Copy the generated Room ID</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-blue-600">3.</span>
              <span>Open a new incognito/private browser window</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-blue-600">4.</span>
              <span>Navigate to this test page and paste the Room ID to join</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-blue-600">5.</span>
              <span>Grant camera and microphone permissions when prompted</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-blue-600">6.</span>
              <span>You should now see both video feeds!</span>
            </li>
          </ol>
        </Card>

        {/* Back Button */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-slate-600 hover:text-slate-900 font-medium"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
