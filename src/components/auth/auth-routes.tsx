import { Navigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth/auth-hooks';

interface RouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: RouteProps) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/auth/login" />;
  return <>{children}</>;
}

export function AuthRoute({ children }: RouteProps) {
  const { user } = useAuth();
  if (user) return <Navigate to="/dashboard" />;
  return <>{children}</>;
}