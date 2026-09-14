import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, supabaseConfigError } from '../lib/supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (supabaseConfigError) {
      setLoading(false);
      return;
    }

    // Fetch active session from Supabase
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        setUser(session?.user ?? null);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const getConfigError = () => ({
    error: {
      message: supabaseConfigError
    }
  });

  const loginWithEmail = async (email, password) => {
    if (supabaseConfigError) return getConfigError();

    return await supabase.auth.signInWithPassword({ email, password });
  };

  const signUpWithEmail = async (email, password, metadata) => {
    if (supabaseConfigError) return getConfigError();

    return await supabase.auth.signUp({
      email,
      password,
      options: { data: metadata }
    });
  };

  const loginWithGoogle = async () => {
    if (supabaseConfigError) return getConfigError();

    return await supabase.auth.signInWithOAuth({ provider: 'google' });
  };

  const logout = async () => {
    return await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginWithEmail, signUpWithEmail, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
