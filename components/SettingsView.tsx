import React, { useState, useEffect } from 'react';
import { AppSettings, User } from '../types';
import { 
  RefreshCcw, Moon, LogOut, Crown, Home, Trash2, Zap, Sparkles, 
  Check, Tablet, Star, UserPlus, Image as ImageIcon, Key, X, 
  Plus, Upload, Loader2, Camera, Heart, ShieldCheck, CreditCard,
  History, Info, ChevronRight, Monitor, Lock
} from 'lucide-react';
import { useToast } from './ToastProvider';
import { SupabaseClient } from '@supabase/supabase-js';

interface SettingsViewProps {
  settings: AppSettings;
  setSettings: (s: AppSettings) => void;
  user: User;
  onLogout: () => void;
  onDeleteAccount: () => void;
  supabase: SupabaseClient | null;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ settings, setSettings, user, onLogout, onDeleteAccount, supabase }) => {
  const { showToast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [newMember, setNewMember] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [familyPhotos, setFamilyPhotos] = useState<{ name: string; url: string }[]>([]);

  useEffect(() => {
    if (supabase && settings.isPro) {
      fetchPhotos();
    }
  }, [supabase, settings.isPro]);

  const fetchPhotos = async () => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase.storage.from('family_photos').list();
      if (error) throw error;
      if (data) {
        const photos = data.map(file => ({
          name: file.name,
          url: supabase.storage.from('family_photos').getPublicUrl(file.name).data.publicUrl
        }));
        setFamilyPhotos(photos);
      }
    } catch (err) {
      console.error('Photo fetch error', err);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !supabase) return;
    setIsUploading(true);
    const fileName = `${Date.now()}-${file.name}`;
    try {
      const { error } = await supabase.storage.from('family_photos').upload(fileName, file);
      if (error) throw error;
      showToast("Photo added to the family wall!");
      fetchPhotos();
    } catch (err: any) {
      showToast(err.message || "Something went wrong with the upload", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const deletePhoto = async (name: string) => {
    if (!supabase) return;
    try {
      const { error } = await supabase.storage.from('family_photos').remove([name]);
      if (error) throw error;
      showToast("Photo removed.");
      fetchPhotos();
    } catch (err: any) {
      showToast(err.message || "Failed to remove photo", "error");
    }
  };

  const handleUnlockPro = async () => {
    setIsProcessing(true);
    showToast("Connecting to Apple App Store...", "info");
    
    // DEVELOPER NOTE: 
    // In a real Capacitor iOS build, you would use:
    // await Purchase.purchase({ productId: 'household_pro_lifetime' });
    // This triggers the native FaceID/Credit Card sheet managed by Apple.
    
    setTimeout(() => {
      setSettings({ ...settings, isPro: true });
      setIsProcessing(false);
      showToast("Household License Active! Welcome to Aura Pro.", "success");
    }, 2500);
  };

  const handleRestore = () => {
    setIsProcessing(true);
    showToast("Checking Apple Purchase History...", "info");
    
    // DEVELOPER NOTE:
    // This is required by Apple. It checks the user's iCloud account
    // for previous purchases of the 'household_pro_lifetime' ID.
    
    setTimeout(() => {
      setIsProcessing(false);
      showToast("No previous purchases found for this account.", "info");
    }, 2000);
  };

  const addMember = () => {
    if (!newMember.trim()) return;
    setSettings({ ...settings, members: [...settings.members, newMember.trim()] });
    setNewMember('');
    showToast(`${newMember} added to the family.`);
  };

  return (
    <div className="h-full max-w-4xl mx-auto space-y-12 overflow-y-auto pr-4 custom-scrollbar pb-32 px-4">
      <header className="flex items-start justify-between pt-4">
        <div>
          <h2 className="text-6xl font-black tracking-tighter text-[#2D2926]">Home Base</h2>
          <p className="text-zinc-500 text-lg font-medium">
            {settings.familyDisplayName} • Dashboard v1.0
          </p>
        </div>
        <div className="flex items-center gap-3 px-6 py-3 bg-white border border-[#E2DDD3] rounded-2xl shadow-sm">
          {settings.isPro ? <Crown className="text-amber-500" size={24} /> : <Tablet className="text-zinc-400" size={24} />}
          <div className="text-left">
            <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Status</div>
            <div className="text-sm font-bold text-[#2D2926]">{settings.isPro ? 'Pro Active' : 'Basic Tier'}</div>
          </div>
        </div>
      </header>

      {/* PAYWALL / PRO STATUS */}
      {!settings.isPro ? (
        <section className="bg-[#2D2926] rounded-[3.5rem] p-12 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 p-12 opacity-10">
            <Sparkles size={160} />
          </div>
          <div className="relative z-10 space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 text-amber-400 rounded-full text-[10px] font-black uppercase tracking-widest">
              <Zap size={14} className="fill-amber-400" /> Lifetime Household License
            </div>
            <div className="space-y-2">
              <h3 className="text-5xl font-black tracking-tight leading-none">Unlock your wall.</h3>
              <p className="text-zinc-400 text-lg max-w-xl">A one-time payment of $9.99 turns your old iPad into a $400 family kiosk. No subscriptions, forever.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {[
                 { t: "Sync Hub Access", d: "Connect Google, iCloud & Outlook", i: RefreshCcw },
                 { t: "Family AI Assistant", d: "Ask Aura to coordinate your week", i: Sparkles },
                 { t: "Family Photo Album", d: "Sync photos to your wall display", i: ImageIcon }
               ].map((f, i) => (
                 <div key={i} className="space-y-2">
                    <div className="text-amber-500"><f.i size={20} /></div>
                    <div className="text-xs font-bold">{f.t}</div>
                    <div className="text-[10px] text-zinc-500">{f.d}</div>
                 </div>
               ))}
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <button 
                onClick={handleUnlockPro}
                disabled={isProcessing}
                className="bg-white text-black px-12 py-6 rounded-[2rem] font-black uppercase tracking-widest text-sm hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isProcessing ? <Loader2 className="animate-spin" size={20} /> : <CreditCard size={20} />}
                {isProcessing ? 'Contacting Apple...' : 'Unlock All Features ($9.99)'}
              </button>
              <button 
                onClick={handleRestore}
                disabled={isProcessing}
                className="px-12 py-6 rounded-[2rem] border border-white/10 font-black uppercase tracking-widest text-[10px] text-zinc-500 hover:text-white transition-colors disabled:opacity-30"
              >
                Restore Purchase
              </button>
            </div>
          </div>
        </section>
      ) : (
        <section className="bg-green-500/10 border border-green-500/20 rounded-[3rem] p-10 flex items-center justify-between shadow-inner animate-in zoom-in-95">
           <div className="flex items-center gap-6">
             <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
               <ShieldCheck size={32} />
             </div>
             <div>
               <h3 className="text-3xl font-black text-[#2D2926]">Household License Active</h3>
               <p className="text-sm text-green-600 font-bold uppercase tracking-widest opacity-80">Full Access • No Recurring Fees</p>
             </div>
           </div>
           <div className="hidden md:block text-right">
             <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Support</div>
             <div className="text-xs font-bold text-zinc-500">priority-support@aura.com</div>
           </div>
        </section>
      )}

      {/* HARDWARE OPTIMIZATION */}
      <section className="bg-white border border-[#E2DDD3] rounded-[3rem] p-10 space-y-8 shadow-sm">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-[#F4F1EA] flex items-center justify-center text-[#2D2926]">
            <Monitor size={32} />
          </div>
          <div>
            <h3 className="text-3xl font-bold text-[#2D2926]">Kiosk Health</h3>
            <p className="text-xs text-zinc-500 font-black uppercase tracking-widest">Optimization for old iPads</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="p-8 bg-[#F4F1EA]/50 rounded-[2.5rem] border border-[#E2DDD3] space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm">Always-On Mode</span>
                <button onClick={() => setSettings({...settings, lowPowerMode: !settings.lowPowerMode})} className={`w-14 h-8 rounded-full p-1 transition-colors ${settings.lowPowerMode ? 'bg-green-500' : 'bg-zinc-300'}`}>
                  <div className={`w-6 h-6 bg-white rounded-full transition-transform ${settings.lowPowerMode ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>
              <p className="text-xs text-zinc-500">Disables the screen sleep timer. Essential for wall-mounted use. Keep connected to power.</p>
           </div>
           <div className="p-8 bg-[#F4F1EA]/50 rounded-[2.5rem] border border-[#E2DDD3] space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm">Theme Rotation</span>
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Enabled</span>
              </div>
              <p className="text-xs text-zinc-500">Subtly shifts pixel positions every hour to prevent screen burn-in on older LCD panels.</p>
           </div>
        </div>
      </section>

      {/* FAMILY ALBUM - PRO GATE */}
      <section className={`bg-white border border-[#E2DDD3] rounded-[3rem] p-10 space-y-8 relative overflow-hidden shadow-sm ${!settings.isPro ? 'opacity-40 grayscale pointer-events-none' : ''}`}>
        {!settings.isPro && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-white/10 backdrop-blur-[2px]">
             <div className="bg-[#2D2926] text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
               <Lock size={12} /> Pro Feature
             </div>
          </div>
        )}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-[#F4F1EA] flex items-center justify-center">
              <Camera className="text-indigo-500" size={32} />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-[#2D2926]">Family Album</h3>
              <p className="text-xs text-zinc-500 font-black uppercase tracking-widest">Slideshow for your wall</p>
            </div>
          </div>
          <label className="bg-[#2D2926] text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 cursor-pointer hover:scale-105 transition-all shadow-xl">
             {isUploading ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
             {isUploading ? 'Sending...' : 'Add a Photo'}
             <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={isUploading} />
          </label>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
           {familyPhotos.map(photo => (
             <div key={photo.name} className="relative aspect-square group">
                <img src={photo.url} className="w-full h-full object-cover rounded-2xl border border-[#E2DDD3] shadow-sm" alt="" />
                <button onClick={() => deletePhoto(photo.name)} className="absolute top-2 right-2 bg-black/60 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 hover:bg-red-500">
                  <Trash2 size={12} />
                </button>
             </div>
           ))}
        </div>
      </section>

      <footer className="pt-12 text-center border-t border-[#E2DDD3]">
         <div className="flex justify-center gap-8 mb-8">
           <button onClick={onLogout} className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 hover:text-red-500 transition-colors">Log Out Household</button>
           <button className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 hover:text-[#2D2926] transition-colors">Privacy Policy</button>
         </div>
         <p className="text-[9px] text-zinc-300 font-bold uppercase tracking-widest">Aura is built for families • Made for that old iPad in your drawer</p>
      </footer>
    </div>
  );
};