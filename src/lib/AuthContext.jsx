import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [appPublicSettings] = useState(null);

  useEffect(() => {
    let mounted = true;

    const bootstrap = async () => {
      try {
        if (!isSupabaseConfigured) {
          if (!mounted) return;
          setUser(null);
          setIsAuthenticated(false);
          return;
        }
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        const currentUser = data.session?.user ?? null;
        if (!mounted) return;
        setUser(currentUser);
        setIsAuthenticated(Boolean(currentUser));
      } catch (error) {
        if (!mounted) return;
        setAuthError({ type: 'auth_required', message: error.message || 'Authentication required' });
      } finally {
        if (!mounted) return;
        setIsLoadingAuth(false);
        setAuthChecked(true);
      }
    };

    bootstrap();

    if (!isSupabaseConfigured) {
      return () => {
        mounted = false;
      };
    }

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setUser(session?.user ?? null);
      setIsAuthenticated(Boolean(session?.user));
      setAuthError(null);
      setIsLoadingAuth(false);
      setAuthChecked(true);
    });

    return () => {
      mounted = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    if (!isSupabaseConfigured) return;
    await supabase.auth.signOut();
  };

  const navigateToLogin = () => {
    window.location.href = '/admin/login';
  };

  const checkUserAuth = async () => {
    try {
      if (!isSupabaseConfigured) {
        setUser(null);
        setIsAuthenticated(false);
        setAuthError(null);
        return;
      }
      setIsLoadingAuth(true);
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      setUser(data.session?.user ?? null);
      setIsAuthenticated(Boolean(data.session?.user));
      setAuthError(null);
    } catch (error) {
      setAuthError({ type: 'auth_required', message: error.message || 'Authentication required' });
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoadingAuth(false);
      setAuthChecked(true);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoadingAuth,
      isLoadingPublicSettings,
      authError,
      appPublicSettings,
      authChecked,
      logout,
      navigateToLogin,
      checkUserAuth,
      checkAppState: checkUserAuth,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
