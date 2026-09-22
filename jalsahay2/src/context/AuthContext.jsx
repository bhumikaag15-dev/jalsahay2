import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, supabaseConfigError } from '../lib/supabaseClient';

const AuthContext = createContext();

const getStoredSession = () => {
  try {
    const saved = localStorage.getItem('jalsahay-auth');
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getStoredSession());
  const [role, setRole] = useState(() => getStoredSession()?.role || 'user');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabaseConfigError) {
      supabase.auth
        .getSession()
        .then(({ data: { session } }) => {
          if (session?.user) {
            const sessionUser = {
              ...session.user,
              role: session.user.user_metadata?.role || 'user'
            };
            setUser(sessionUser);
            setRole(sessionUser.role);
            localStorage.setItem('jalsahay-auth', JSON.stringify(sessionUser));
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
        });

      const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          const sessionUser = {
            ...session.user,
            role: session.user.user_metadata?.role || 'user'
          };
          setUser(sessionUser);
          setRole(sessionUser.role);
          localStorage.setItem('jalsahay-auth', JSON.stringify(sessionUser));
        } else {
          setUser(null);
          setRole('user');
          localStorage.removeItem('jalsahay-auth');
        }
        setLoading(false);
      });

      return () => {
        listener.subscription.unsubscribe();
      };
    }

    setLoading(false);
  }, []);

  const persistSession = (sessionUser) => {
    setUser(sessionUser);
    setRole(sessionUser.role || 'user');
    localStorage.setItem('jalsahay-auth', JSON.stringify(sessionUser));
  };

  const getConfigError = () => ({
    error: {
      message: supabaseConfigError
    }
  });

  const loginWithIdentifier = async (identifier, password, selectedRole = 'user') => {
    const isPhone = !identifier.includes('@');

    if (supabaseConfigError) {
      const mockUser = {
        id: `demo-${selectedRole}-${Date.now()}`,
        email: isPhone ? undefined : identifier,
        phone: isPhone ? identifier : undefined,
        role: selectedRole,
        user_metadata: {
          full_name: isPhone ? identifier : identifier.split('@')[0],
          role: selectedRole,
          phone: isPhone ? identifier : undefined
        }
      };
      persistSession(mockUser);
      return { error: null, user: mockUser };
    }

    const result = isPhone
      ? await supabase.auth.signInWithPassword({ phone: identifier, password })
      : await supabase.auth.signInWithPassword({ email: identifier, password });

    if (!result.error && result.data?.user) {
      const sessionUser = {
        ...result.data.user,
        role: result.data.user.user_metadata?.role || selectedRole
      };
      persistSession(sessionUser);
    }
    return result;
  };

  const loginWithEmail = async (email, password, selectedRole = 'user') => {
    return loginWithIdentifier(email, password, selectedRole);
  };

  const signUpWithIdentifier = async (identifier, password, metadata = {}) => {
    const finalRole = metadata.role || 'user';
    const isPhone = !identifier.includes('@');

    if (supabaseConfigError) {
      const mockUser = {
        id: `demo-${finalRole}-${Date.now()}`,
        email: isPhone ? undefined : identifier,
        phone: isPhone ? identifier : undefined,
        role: finalRole,
        user_metadata: { ...metadata, role: finalRole, phone: isPhone ? identifier : metadata.phone }
      };
      persistSession(mockUser);
      return { error: null, user: mockUser };
    }

    const result = isPhone
      ? await supabase.auth.signUp({ phone: identifier, password, options: { data: metadata } })
      : await supabase.auth.signUp({ email: identifier, password, options: { data: metadata } });

    if (!result.error && result.data?.user) {
      const sessionUser = {
        ...result.data.user,
        role: result.data.user.user_metadata?.role || finalRole
      };
      persistSession(sessionUser);
    }

    return result;
  };

  const signUpWithEmail = async (email, password, metadata = {}) => signUpWithIdentifier(email, password, metadata);

  const loginWithGoogle = async () => {
    if (supabaseConfigError) return getConfigError();
    return await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
  };

  const logout = async () => {
    if (supabaseConfigError) {
      setUser(null);
      setRole('user');
      localStorage.removeItem('jalsahay-auth');
      return { error: null };
    }

    const result = await supabase.auth.signOut();
    if (!result.error) {
      setUser(null);
      setRole('user');
      localStorage.removeItem('jalsahay-auth');
    }
    return result;
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, loginWithEmail, loginWithIdentifier, signUpWithEmail, signUpWithIdentifier, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
