<<<<<<< HEAD
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './components/theme-provider';
import { Toaster } from './components/ui/toaster';
import { useAuth, AuthProvider } from './components/AuthProvider';

// Layouts
import { Header } from './components/Header';

// Pages
import { Calendar } from './components/Calendar';
import { WorkoutLibrary } from './pages/WorkoutLibrary';
import { StrengthTraining } from './pages/StrengthTraining';
import { MobilityTraining } from './pages/MobilityTraining';
import { CardioTraining } from './pages/CardioTraining';
import { OtherTraining } from './pages/OtherTraining';
import { Auth } from './pages/Auth';
import { Settings } from './pages/Settings';
import { AuthCallback } from './pages/AuthCallback';

// Authentication-protected route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
}

// Home redirect
function HomeRedirect() {
  return <Navigate to="/calendar" replace />;
}

export function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <AuthProvider>
        <Router>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<HomeRedirect />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/auth-callback" element={<AuthCallback />} />
                
                {/* Protected routes */}
                <Route 
                  path="/calendar" 
                  element={
                    <ProtectedRoute>
                      <Calendar />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/workout-library" 
                  element={
                    <ProtectedRoute>
                      <WorkoutLibrary />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/strength-training" 
                  element={
                    <ProtectedRoute>
                      <StrengthTraining />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/mobility-training" 
                  element={
                    <ProtectedRoute>
                      <MobilityTraining />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/cardio-training" 
                  element={
                    <ProtectedRoute>
                      <CardioTraining />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/other-training" 
                  element={
                    <ProtectedRoute>
                      <OtherTraining />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/settings" 
                  element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Fallback route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
          <Toaster />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
=======

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import StrengthPage from "./pages/StrengthPage";
import MobilityPage from "./pages/MobilityPage";
import RunningPage from "./pages/RunningPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/strength" element={<StrengthPage />} />
          <Route path="/mobility" element={<MobilityPage />} />
          <Route path="/running" element={<RunningPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
>>>>>>> origin/main
