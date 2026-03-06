import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { Heart, Mail, AlertTriangle, Info, Lock, Eye, EyeOff, UserPlus, LogIn } from 'lucide-react';
import { SupabaseClient } from '@supabase/supabase-js';

interface AuthViewProps {
  onLogin: (user: User) => void;
  supabase: SupabaseClient | null;
}

export const AuthView: React.FC<AuthViewProps> = ({ onLogin, supabase }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleAuth = async () => {
    setIsAnimating(true);
    setError(null);
    setMessage(null);

    if (!supabase) {
      setError("Unable to connect to your home hub. Please check your setup.");
      setIsAnimating(false);
      return;
    }

    if (!email || !password) {
      setError("Please fill in both email and password.");
      setIsAnimating(false);
      return;
    }

    try {
      if (mode === 'login') {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;

        if (data.user) {
          onLogin({
            id: data.user.id,
            name: data.user.user_metadata?.full_name || email.split('@')[0],
            email: data.user.email || '',
            role: (data.user.user_metadata?.role as UserRole) || 'household-admin',
            avatar: `https://ui-avatars.com/api/?name=${data.user.email}&background=random`
          });
        }
      } else {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: email.split('@')[0],
              role: 'household-admin'
            }
          }
        });

        if (signUpError) throw signUpError;
        
        if (data.user && data.session) {
          onLogin({
            id: data.user.id,
            name: data.user.user_metadata?.full_name || email.split('@')[0],
            email: data.user.email || '',
            role: 'household-admin',
            avatar: `https://ui-avatars.com/api/?name=${data.user.email}&background=random`
          });
        } else {
          setMessage("Welcome! Check your email to activate your family's home base.");
          setMode('login');
          setPassword('');
        }
      }
    } catch (err: any) {
      setError(err.message || "We couldn't get you in. Please check your details.");
    } finally {
      setIsAnimating(false);
    }
  };

  return (
    <div className="h-full w-full flex items-center justify-center bg-[#050505] relative p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent opacity-30"></div>
      
      <div className="max-w-md w-full p-10 space-y-10 text-center z-10 bg-zinc-950/80 border border-zinc-900 rounded-[3.5rem] backdrop-blur-3xl shadow-2xl">
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-[2.5rem] bg-indigo-600 flex items-center justify-center shadow-2xl relative overflow-hidden group">
              <Heart className="text-white relative z-10" size={36} fill="white" />
            </div>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white">Aura</h1>
          <p className="text-zinc-500 text-[10px] uppercase tracking-[0.3em] font-black text-center">Your Family's Home Base</p>
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs font-bold flex items-center gap-3 text-left animate-in fade-in slide-in-from-top-2">
            <AlertTriangle size={16} className="shrink-0" /> {error}
          </div>
        )}

        {message && (
          <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-indigo-300 text-xs font-medium flex items-center gap-3 text-left">
            <Info size={16} className="shrink-0" /> {message}
          </div>
        )}

        <div className="space-y-6 text-left">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-1">Email</label>
              <div className="relative group">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hello@ourfamily.com" 
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl py-5 px-12 outline-none focus:border-indigo-500 transition-colors text-white text-lg placeholder:text-zinc-700"
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within:text-indigo-400 transition-colors" size={20} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-1">Password</label>
              <div className="relative group">
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAuth()}
                  placeholder="••••••••" 
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl py-5 px-12 outline-none focus:border-indigo-500 transition-colors text-white text-lg placeholder:text-zinc-700"
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within:text-indigo-400 transition-colors" size={20} />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-700 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          </div>
          
          <button 
            onClick={handleAuth}
            disabled={isAnimating || !email || !password}
            className="w-full h-16 bg-white text-black rounded-3xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-4 hover:scale-[0.98] transition-all active:scale-95 disabled:opacity-20 shadow-xl"
          >
            {isAnimating ? (
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                {mode === 'login' ? <LogIn size={18} /> : <UserPlus size={18} />}
                {mode === 'login' ? 'Go to our home' : 'Create Home Hub'}
              </>
            )}
          </button>

          <button 
            onClick={() => {
              setMode(mode === 'login' ? 'signup' : 'login');
              setError(null);
              setMessage(null);
            }}
            className="w-full py-2 text-[10px] font-black text-zinc-600 hover:text-indigo-400 uppercase tracking-widest text-center transition-colors"
          >
            {mode === 'login' ? "Need a new family hub?" : "Already part of a family? Log in"}
          </button>
        </div>

        <div className="pt-4 border-t border-zinc-900/50">
           <p className="text-[9px] text-zinc-700 font-bold uppercase tracking-[0.2em]">
             Private • Secure • For your family
           </p>
        </div>
      </div>
    </div>
  );
};