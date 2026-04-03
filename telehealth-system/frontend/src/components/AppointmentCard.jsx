import { useNavigate } from 'react-router-dom';

function AppointmentCard({ appointment, onCancel }) {
  const navigate = useNavigate();

  const getStatusBadge = (status) => {
    switch (status) {
      case 'scheduled':
        return <span className="status-badge status-scheduled">Scheduled</span>;
      case 'completed':
        return <span className="status-badge status-completed">Completed</span>;
      case 'cancelled':
        return <span className="status-badge status-cancelled">Cancelled</span>;
      case 'in-progress':
        return <span className="status-badge bg-yellow-100 text-yellow-700">In Progress</span>;
      default:
        return <span className="status-badge bg-slate-100 text-slate-700">{status}</span>;
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleJoinCall = () => {
    navigate(`/consultation/${appointment.roomId}`);
  };

  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          {/* Doctor Avatar */}
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
            <DoctorIcon className="w-6 h-6 text-primary-600" />
          </div>

          {/* Appointment Details */}
          <div>
            <h3 className="font-semibold text-slate-800">
              Dr. {appointment.doctorName || 'Doctor'}
            </h3>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-slate-500">
              <span className="flex items-center gap-1">
                <CalendarIcon className="w-4 h-4" />
                {formatDate(appointment.date)}
              </span>
              <span className="flex items-center gap-1">
                <ClockIcon className="w-4 h-4" />
                {appointment.time || '10:00 AM'}
              </span>
              <span className="flex items-center gap-1">
                {appointment.type === 'video' ? (
                  <VideoIcon className="w-4 h-4" />
                ) : (
                  <PhoneIcon className="w-4 h-4" />
                )}
                {appointment.type === 'video' ? 'Video Call' : 'Audio Call'}
              </span>
            </div>
            {appointment.notes && (
              <p className="text-sm text-slate-500 mt-2">
                Note: {appointment.notes}
              </p>
            )}
          </div>
        </div>

        {/* Status and Actions */}
        <div className="flex items-center gap-3 sm:flex-col sm:items-end">
          {getStatusBadge(appointment.status)}
          
          <div className="flex gap-2">
            {appointment.status === 'scheduled' && (
              <>
                <button
                  onClick={handleJoinCall}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors flex items-center gap-2"
                >
                  <VideoIcon className="w-4 h-4" />
                  Join Call
                </button>
                {onCancel && (
                  <button
                    onClick={() => onCancel(appointment.id)}
                    className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </>
            )}
            {appointment.status === 'completed' && (
              <button className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors">
                View Summary
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Icon Components
function DoctorIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function CalendarIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function ClockIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function VideoIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  );
}

function PhoneIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  );
}

export default AppointmentCard;
