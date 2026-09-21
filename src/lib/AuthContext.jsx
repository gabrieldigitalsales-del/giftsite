import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [appPublicSettings] = useState(null);

  const resolveAdmin = useCallback(async (currentUser) => {
    if (!currentUser || !isSupabaseConfigured) return false;
    const { data, error } = await supabase
      .from('gift_site_admins')
      .select('user_id')
      .eq('user_id', currentUser.id)
      .maybeSingle();
    if (error) throw error;
    return Boolean(data?.user_id);
  }, []);

  const applySession = useCallback(async (session) => {
    const currentUser = session?.user ?? null;
    setUser(currentUser);
    setIsAuthenticated(Boolean(currentUser));
    if (!currentUser) {
      setIsAdmin(false);
      return;
    }
    const admin = await resolveAdmin(currentUser);
    setIsAdmin(admin);
    if (!admin) {
      setAuthError({ type: 'user_not_registered', message: 'Usuário sem permissão administrativa para o site GIFT Excellence.' });
    } else {
      setAuthError(null);
    }
  }, [resolveAdmin]);

  useEffect(() => {
    let mounted = true;

    const bootstrap = async () => {
      try {
        if (!isSupabaseConfigured) {
          if (!mounted) return;
          setUser(null);
          setIsAuthenticated(false);
          setIsAdmin(false);
          return;
        }
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (!mounted) return;
        await applySession(data.session);
      } catch (error) {
        if (!mounted) return;
        setAuthError({ type: 'auth_required', message: error.message || 'Authentication required' });
        setIsAdmin(false);
      } finally {
        if (!mounted) return;
        setIsLoadingAuth(false);
        setAuthChecked(true);
      }
    };

    bootstrap();

    if (!isSupabaseConfigured) {
      return () => { mounted = false; };
    }

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setIsLoadingAuth(true);
      Promise.resolve(applySession(session))
        .catch((error) => {
          if (!mounted) return;
          setAuthError({ type: 'auth_required', message: error.message || 'Authentication required' });
          setIsAdmin(false);
        })
        .finally(() => {
          if (!mounted) return;
          setIsLoadingAuth(false);
          setAuthChecked(true);
        });
    });

    return () => {
      mounted = false;
      subscription.subscription.unsubscribe();
    };
  }, [applySession]);

  const logout = async () => {
    if (!isSupabaseConfigured) return;
    await supabase.auth.signOut();
    setIsAdmin(false);
  };

  const navigateToLogin = () => {
    window.location.href = '/admin/login';
  };

  const checkUserAuth = useCallback(async () => {
    try {
      if (!isSupabaseConfigured) {
        setUser(null);
        setIsAuthenticated(false);
        setIsAdmin(false);
        setAuthError(null);
        return;
      }
      setIsLoadingAuth(true);
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      await applySession(data.session);
    } catch (error) {
      setAuthError({ type: 'auth_required', message: error.message || 'Authentication required' });
      setUser(null);
      setIsAuthenticated(false);
      setIsAdmin(false);
    } finally {
      setIsLoadingAuth(false);
      setAuthChecked(true);
    }
  }, [applySession]);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isAdmin,
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
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
