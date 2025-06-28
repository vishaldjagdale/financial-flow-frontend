
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        // User is logged in, redirect to analytics
        navigate('/analytics', { replace: true });
      } else {
        // User is not logged in, redirect to login
        navigate('/login', { replace: true });
      }
    }
  }, [user, isLoading, navigate]);

  // Show loading spinner while checking auth state
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex items-center space-x-2">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
        <span className="text-muted-foreground">Loading...</span>
      </div>
    </div>
  );
};

export default Index;
