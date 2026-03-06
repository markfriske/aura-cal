import React from 'react';
import { Terminal, Play, CheckCircle2, Copy, Apple, ShieldCheck, FileCode, Rocket, Settings, ChevronRight, Zap, Loader2, Save, Lock, Download, Monitor, RefreshCw, Smartphone, AlertTriangle, AppWindow, Globe, Users } from 'lucide-react';
import { useToast } from './ToastProvider';

export const SwiftUIDocs: React.FC = () => {
  const { showToast } = useToast();

  const copyCmd = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast("Command copied");
  };

  return (
    <div className="h-full overflow-y-auto pr-6 space-y-12 custom-scrollbar pb-40 px-4">
      <header className="space-y-4 pt-4">
        <div className="inline-block px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">
          Mission Control: Production
        </div>
        <h2 className="text-6xl font-black tracking-tighter text-white">The Submission Loop</h2>
        <p className="text-xl text-zinc-400 max-w-2xl font-medium">
          Move from the simulator to a real wall-mounted iPad via Apple TestFlight.
        </p>
      </header>

      {/* ERROR FIXING SECTION */}
      <section className="bg-red-900/20 border border-red-500/30 rounded-[3.5rem] p-10 space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-red-600 flex items-center justify-center text-white shadow-xl">
            <AlertTriangle size={28} />
          </div>
          <div>
            <h3 className="text-3xl font-black tracking-tight text-white">"App Name already used"</h3>
            <p className="text-sm text-red-200/60">How to bypass the global naming collision error.</p>
          </div>
        </div>
        <div className="space-y-4 text-sm text-zinc-300 leading-relaxed">
          <p>Apple names must be unique across the <strong>entire</strong> App Store. If "Aura Calendar" is taken, you must use a subtitle or a more specific name.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 bg-black/40 rounded-3xl border border-white/5">
              <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Step 1: Xcode Change</div>
              <p className="text-xs">In Xcode, click your project in the sidebar, go to <strong>General → Identity</strong> and change <strong>Display Name</strong> to something like "Aura Home Wall".</p>
            </div>
            <div className="p-6 bg-black/40 rounded-3xl border border-white/5">
              <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Step 2: Connect Change</div>
              <p className="text-xs">Go to <a href="https://appstoreconnect.apple.com" className="underline" target="_blank" rel="noopener noreferrer">App Store Connect</a>, manually create the app record there first with your unique name, then try the Xcode upload again.</p>
            </div>
          </div>
        </div>
      </section>

      {/* PHASE 1: APP STORE CONNECT */}
      <section className="bg-zinc-950 border border-zinc-800 rounded-[3.5rem] p-10 space-y-10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
            <Globe size={28} />
          </div>
          <div>
            <h3 className="text-3xl font-black tracking-tight text-white">1. App Store Connect</h3>
            <p className="text-sm text-zinc-500">The digital record for your app.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-8 bg-zinc-900/50 rounded-3xl border border-zinc-800 space-y-4">
            <h4 className="font-bold text-white flex items-center gap-2 text-sm"><CheckCircle2 className="text-green-500" size={16} /> Identity Setup</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Log into <a href="https://appstoreconnect.apple.com" target="_blank" className="text-indigo-400 underline">App Store Connect</a>. Create a "New App". Use the name <strong>Aura: Home Wall Dashboard</strong> and Bundle ID <strong>com.auracal.app</strong>.
            </p>
          </div>
          <div className="p-8 bg-zinc-900/50 rounded-3xl border border-zinc-800 space-y-4">
            <h4 className="font-bold text-white flex items-center gap-2 text-sm"><CheckCircle2 className="text-green-500" size={16} /> Privacy Policy</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Apple requires a URL for your privacy policy. Use the text in your <strong>Legal</strong> tab as a base. You can host this on your Supabase domain or a simple GitHub gist.
            </p>
          </div>
        </div>
      </section>

      {/* PHASE 2: XCODE ARCHIVING */}
      <section className="bg-zinc-900/40 border border-zinc-800 rounded-[3.5rem] p-10 space-y-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-5">
          <Apple size={140} />
        </div>
        
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-zinc-800 flex items-center justify-center text-white shadow-xl">
            <Box size={28} />
          </div>
          <div>
            <h3 className="text-3xl font-black tracking-tight text-white">2. The Archiving Ritual</h3>
            <p className="text-sm text-zinc-500">Creating the production binary.</p>
          </div>
        </div>

        <div className="space-y-4 relative z-10">
          <div className="flex gap-6 p-8 bg-black/60 rounded-[2.5rem] border border-zinc-800 items-start">
            <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0 font-black">A</div>
            <div className="space-y-2">
              <div className="text-xs font-bold text-white uppercase tracking-widest">Select Target</div>
              <p className="text-[11px] text-zinc-500">In the top toolbar of Xcode, change the destination from an <strong>iPad Simulator</strong> to <strong>Any iOS Device (arm64)</strong>.</p>
            </div>
          </div>
          <div className="flex gap-6 p-8 bg-black/60 rounded-[2.5rem] border border-zinc-800 items-start">
            <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0 font-black">B</div>
            <div className="space-y-2">
              <div className="text-xs font-bold text-white uppercase tracking-widest">Build Archive</div>
              <p className="text-[11px] text-zinc-500">Go to <strong>Product → Archive</strong>. Xcode will now compile the entire React app into a single native bundle.</p>
            </div>
          </div>
          <div className="flex gap-6 p-8 bg-black/60 rounded-[2.5rem] border border-zinc-800 items-start">
            <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0 font-black">C</div>
            <div className="space-y-2">
              <div className="text-xs font-bold text-white uppercase tracking-widest">Distribute App</div>
              <p className="text-[11px] text-zinc-500">Once the Archive is done, click <strong>Distribute App</strong>. Follow the prompts for <strong>App Store Connect → Upload</strong>.</p>
            </div>
          </div>
        </div>
      </section>

      {/* PHASE 3: TESTFLIGHT */}
      <section className="bg-indigo-600 border border-indigo-500 rounded-[3.5rem] p-10 space-y-8 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-indigo-600 shadow-xl">
            <Rocket size={28} />
          </div>
          <div>
            <h3 className="text-3xl font-black tracking-tight text-white">3. Deploying TestFlight</h3>
            <p className="text-sm text-white/70">Install it on your wall iPad today.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-8 bg-black/20 rounded-3xl space-y-3">
             <div className="text-[10px] font-black uppercase text-white tracking-widest">Step 1: Internal Testers</div>
             <p className="text-xs text-white/80 leading-relaxed">In App Store Connect, go to <strong>TestFlight → Internal Testing</strong>. Add your email address to the list.</p>
          </div>
          <div className="p-8 bg-black/20 rounded-3xl space-y-3">
             <div className="text-[10px] font-black uppercase text-white tracking-widest">Step 2: Install App</div>
             <p className="text-xs text-white/80 leading-relaxed">Download the <strong>TestFlight</strong> app from the App Store on your wall iPad. Aura will appear there for download.</p>
          </div>
        </div>
      </section>

      <footer className="pt-12 text-center">
         <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-700">Aura Release Engineering • v1.0.0 Stable</p>
      </footer>
    </div>
  );
};

const Box = ({ size, className }: { size: number, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
    <path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" />
  </svg>
);
