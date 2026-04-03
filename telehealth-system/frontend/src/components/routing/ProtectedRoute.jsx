import { Navigate, useLocation } from 'react-router-dom';

export default function ProtectedRoute({ user, userRole, allowedRoles = [], children }) {
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Avoid redirect loops while role is still being resolved.
  if (allowedRoles.length > 0 && !userRole) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/home" replace />;
  }

  return children;
}

