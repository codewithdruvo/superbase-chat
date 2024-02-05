import React, { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "../services/supabase";

const defaultValues = {
  isLoading: true,
  isAuthenticated: false,
  user: null,
  metadata: null,
  session: null,
  signout: async () => {},
};

export const AuthContext = React.createContext(defaultValues);

export const AuthProvider = (props) => {
  const [isLoading, setIsLoading] = useState(defaultValues.isLoading);
  const [isAuthenticated, setIsAuthenticated] = useState(
    defaultValues.isAuthenticated
  );
  const [user, setUser] = React.useState(defaultValues.user);
  const [metadata, setMetadata] = useState(defaultValues.metadata);
  const [session, setSession] = useState(defaultValues.session);

  // handle auth state change
  useEffect(() => {
    // look for session on first render
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setMetadata(session?.user?.user_metadata || null);
      setUser(session?.user || null);
      setIsAuthenticated(!!session);
      setIsLoading(false);
    });

    // lookup every time when session changed
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setMetadata(session?.user?.user_metadata || null);
      setUser(session?.user || null);
      setIsAuthenticated(!!session);
      setIsLoading(false);
    });
    const { subscription } = data;
    return () => subscription.unsubscribe();
  }, []);

  const signout = useCallback(async () => {
    const response = await supabase.auth.signOut();

    // reset the state
    setIsLoading(false);
    setSession(null);
    setIsAuthenticated(false);
    setMetadata(null);
    setUser(null);

    return response;
  }, []);

  const value = useMemo(
    () => ({
      signout,
      isLoading,
      isAuthenticated,
      user,
      metadata,
      session,
    }),
    [isAuthenticated, isLoading, metadata, session, signout, user]
  );

  return <AuthContext.Provider value={value} {...props} />;
};
