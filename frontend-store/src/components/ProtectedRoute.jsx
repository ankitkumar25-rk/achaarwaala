import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store';

export default function ProtectedRoute({ children }) {
  const user = useAuthStore((s) => s.user);
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const location = useLocation();

  // Wait for auth check to complete if not already done
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF4]">
        <div className="flex flex-col items-center gap-2">
          <span className="font-sans text-sm font-bold tracking-[0.25em] text-[#1A1A1A] animate-pulse">ACHAARWAALA</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`} replace />;
  }
  return children;
}
