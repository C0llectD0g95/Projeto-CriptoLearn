import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName?: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  updateProfile: (displayName: string) => Promise<{ error: Error | null }>;
  updateEmail: (newEmail: string) => Promise<{ error: Error | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: Error | null }>;
  updateAvatar: (file: File | Blob) => Promise<{ error: Error | null; url?: string }>;
  deleteAccount: () => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, displayName?: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          display_name: displayName,
        },
      },
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const updateProfile = async (displayName: string) => {
    const { error } = await supabase.auth.updateUser({
      data: { display_name: displayName }
    });
    
    if (!error && user) {
      // Also update the profiles table
      await supabase
        .from('profiles')
        .update({ display_name: displayName })
        .eq('id', user.id);
    }
    
    return { error };
  };

  const updateEmail = async (newEmail: string) => {
    const { error } = await supabase.auth.updateUser({
      email: newEmail
    });
    return { error };
  };

  const updatePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });
    return { error };
  };

  const updateAvatar = async (file: File | Blob) => {
    if (!user) return { error: new Error("User not authenticated") as Error };
    
    const fileExt = file instanceof File ? file.name.split('.').pop() : 'jpg';
    const filePath = `${user.id}/avatar.${fileExt}`;
    
    // Upload file to storage
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });
    
    if (uploadError) return { error: uploadError as Error };
    
    // Get public URL with cache busting
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);
    
    const urlWithCacheBust = `${publicUrl}?t=${Date.now()}`;
    
    // Update user metadata
    const { error: updateError } = await supabase.auth.updateUser({
      data: { avatar_url: urlWithCacheBust }
    });
    
    if (updateError) return { error: updateError as Error };
    
    // Update profiles table
    await supabase
      .from('profiles')
      .update({ avatar_url: urlWithCacheBust })
      .eq('id', user.id);
    
    return { error: null, url: urlWithCacheBust };
  };

  const deleteAccount = async () => {
    if (!user) return { error: new Error("User not authenticated") as Error };
    
    try {
      // Delete user's wallets
      await supabase.from('wallets').delete().eq('user_id', user.id);
      
      // Delete user's profile
      await supabase.from('profiles').delete().eq('id', user.id);
      
      // Delete avatar from storage
      const { data: files } = await supabase.storage.from('avatars').list(user.id);
      if (files && files.length > 0) {
        await supabase.storage.from('avatars').remove(files.map(f => `${user.id}/${f.name}`));
      }
      
      // Note: Full account deletion requires admin API - sign out user
      await supabase.auth.signOut();
      
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      loading, 
      signUp, 
      signIn, 
      signInWithGoogle, 
      signOut,
      updateProfile,
      updateEmail,
      updatePassword,
      updateAvatar,
      deleteAccount
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
