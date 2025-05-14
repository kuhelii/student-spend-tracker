
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/sonner';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Initialize session
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state changed:", event);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // Automatically redirect on auth events
        if (event === 'SIGNED_IN') {
          toast("Welcome back!", {
            description: "You have successfully signed in."
          });
          navigate('/dashboard');
        } else if (event === 'SIGNED_OUT') {
          navigate('/auth');
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log("Retrieved session:", currentSession ? "exists" : "none");
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      // Navigation happens in onAuthStateChange
    } catch (error: any) {
      toast("Sign in failed", {
        description: error.message
      });
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      // Changed to directly sign in after sign up
      const { error: signUpError } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          // Skip email verification by automatically signing in after signup
          emailRedirectTo: window.location.origin + '/auth',
          data: {
            email_confirmed: true
          }
        }
      });
      
      if (signUpError) throw signUpError;
      
      // Immediately sign in after successful sign up
      toast("Account created!", {
        description: "You've been automatically signed in."
      });
      
      // Try to sign in immediately
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) throw signInError;
      
      // Navigation happens in onAuthStateChange
    } catch (error: any) {
      toast("Sign up failed", {
        description: error.message
      });
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast("Signed out", {
        description: "You have been signed out successfully."
      });
      // Navigation happens in onAuthStateChange
    } catch (error: any) {
      toast("Sign out failed", {
        description: error.message
      });
    }
  };

  return (
    <AuthContext.Provider value={{ session, user, signIn, signUp, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
