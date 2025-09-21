// src/components/ProtectedRoute.tsx
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-medium text-gray-900 mb-2" style={{ fontFamily: 'Google Sans, sans-serif' }}>
            Verifying Authentication
          </h2>
          <p className="text-gray-600" style={{ fontFamily: 'Roboto, sans-serif' }}>
            Please wait while we check your login status...
          </p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to sign-in with return URL
  if (!isAuthenticated) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  // If authenticated, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
