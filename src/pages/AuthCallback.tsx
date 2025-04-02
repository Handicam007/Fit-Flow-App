import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useToast } from '../components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../components/AuthProvider';

export function AuthCallback() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [message, setMessage] = useState('Processing your request...');

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        // If user is already logged in and this is not a recovery
        if (user && !window.location.href.includes('type=recovery')) {
          setMessage('Already logged in. Redirecting to dashboard...');
          setTimeout(() => {
            navigate('/calendar');
          }, 1500);
          return;
        }
        
        // Get the URL hash
        const hash = window.location.hash;
        // For password resets, check if this is one
        const isPasswordReset = window.location.href.includes('type=recovery');
        
        // Handle hashFragment auth from Supabase
        if (hash && hash.includes('access_token')) {
          const { data, error } = await supabase.auth.getUser();
          
          if (error) {
            throw error;
          }
          
          // Check if user was successfully retrieved
          if (data?.user) {
            if (isPasswordReset) {
              setMessage('You can now reset your password.');
              toast({
                title: 'Reset Password',
                description: 'You can now reset your password.',
              });
              
              // Navigate to password reset page
              setTimeout(() => {
                navigate('/settings');
              }, 2000);
            } else {
              setMessage('Email confirmed successfully! Redirecting to your dashboard...');
              toast({
                title: 'Email Confirmed',
                description: 'Your email has been verified successfully.',
              });
              
              // Redirect to dashboard
              setTimeout(() => {
                navigate('/calendar');
              }, 2000);
            }
          } else {
            throw new Error('User not found');
          }
        } else {
          // No hash, redirect to home
          setMessage('Invalid callback URL. Redirecting to homepage...');
          setTimeout(() => {
            navigate('/');
          }, 2000);
        }
      } catch (error: any) {
        console.error('Auth callback error:', error);
        setMessage('An error occurred. Redirecting to homepage...');
        toast({
          title: 'Authentication Error',
          description: error.message || 'An error occurred during authentication.',
          variant: 'destructive',
        });
        
        setTimeout(() => {
          navigate('/');
        }, 3000);
      }
    };

    handleEmailConfirmation();
  }, [navigate, toast, user]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <Loader2 className="h-12 w-12 animate-spin mb-4" />
      <h1 className="text-2xl font-bold mb-2">Authentication in progress</h1>
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
} 