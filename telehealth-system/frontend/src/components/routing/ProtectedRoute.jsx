import { Navigate, useLocation } from 'react-router-dom';

export default function ProtectedRoute({ user, userRole, allowedRoles = [], children }) {
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

