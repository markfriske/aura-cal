
import React, { useState } from 'react';
import { User } from '../types';
import { Shield, Users, Zap, Activity, Package, Search, Apple, AppWindow, FileText, CheckCircle2, Heart, Smartphone, Layout, Info, Eye, Clipboard, Camera, MapPin, MousePointer2, Star, Rocket, Globe, Lock, ExternalLink, ArrowRight, Copy } from 'lucide-react';
import { SupabaseClient } from '@supabase/supabase-js';
import { useToast } from './ToastProvider';

interface AdminViewProps {
  user: User;
  supabase: SupabaseClient | null;
}

export const AdminView: React.FC<AdminViewProps> = ({ user, supabase }) => {
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'registry' | 'launch'>('registry');
  
  const nodes = [
    { id: 'AU-0001', email: 'auracalteam@gmail.com', familyName: 'Aura Master Core', status: 'Online', plan: 'Founder' },
    { id: 'AU-4421', email: 'family_first@outlook.com', familyName: 'The Robinsons', status: 'Online', plan: 'Pro' }
  ];

  const submissionSteps = [
    { id: 1, title: 'App Store Connect Record', desc: 'Bundle ID registered as com.auracal.app', status: 'done' },
    { id: 2, title: 'Privacy Info Manifest', desc: 'xcprivacy file configured for always-on', status: 'pending' },
    { id: 3, title: 'Screenshots Bundle', desc: '12.9" and 11" iPad assets finalized', status: 'warning' },
    { id: 4, title: 'TestFlight Build v1.0.0', desc: 'Archive uploaded to Apple servers', status: 'pending' },
    { id: 5, title: 'Internal Review', desc: 'Family testing group invitations sent', status: 'pending' },
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast("Copied to clipboard");
  };

  const ReadinessChecklist = () => (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="bg-zinc-900/30 border border-zinc-800 rounded-[3rem] p-10">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-1">
            <h3 className="text-3xl font-black text-white tracking-tight">Deployment Pipeline</h3>
            <p className="text-zinc-500 text-sm font-medium">Tracking release v1.0.0 (Production)</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-black text-indigo-400">20%</div>
            <div className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Archived</div>
          </div>
        </div>
        <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-500 w-[20%] transition-all duration-1000" />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <section className="xl:col-span-2 space-y-6">
          <div className="bg-zinc-900/30 border border-zinc-800 rounded-[3rem] p-10 space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white"><Rocket size={24} /></div>
              <h3 className="text-2xl font-bold text-white">App Store Lifecycle</h3>
            </div>
            
            <div className="space-y-4">
              {submissionSteps.map((step) => (
                <div key={step.id} className="flex items-start gap-6 p-6 bg-black/40 rounded-[2rem] border border-zinc-800/50 group hover:border-zinc-700 transition-all">
                  <div className={`mt-1 w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                    step.status === 'done' ? 'bg-green-500/20 text-green-500' : 
                    step.status === 'warning' ? 'bg-amber-500/20 text-amber-500' : 'bg-zinc-800 text-zinc-600'
                  }`}>
                    {step.status === 'done' ? <CheckCircle2 size={16} /> : <div className="w-1.5 h-1.5 rounded-full bg-current" />}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="font-bold text-white">{step.title}</div>
                    <div className="text-xs text-zinc-500">{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-zinc-900/30 border border-zinc-800 rounded-[3rem] p-10 space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white"><Globe size={24} /></div>
              <h3 className="text-2xl font-bold text-white">Project Identity</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 bg-black rounded-2xl border border-zinc-800 space-y-3">
                <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Unique App Name</div>
                <div className="flex items-center justify-between gap-4">
                  <div className="text-sm font-bold text-white">Aura: Home Wall Dashboard</div>
                  <button onClick={() => copyToClipboard("Aura: Home Wall Dashboard")} className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-500 transition-colors"><Copy size={14} /></button>
                </div>
              </div>
              <div className="p-6 bg-black rounded-2xl border border-zinc-800 space-y-3">
                <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Bundle ID</div>
                <div className="flex items-center justify-between gap-4">
                  <div className="text-sm font-bold text-white">com.auracal.app</div>
                  <button onClick={() => copyToClipboard("com.auracal.app")} className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-500 transition-colors"><Copy size={14} /></button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <div className="bg-zinc-900/30 border border-zinc-800 rounded-[3rem] p-10 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center text-amber-500"><Layout size={24} /></div>
              <h3 className="text-2xl font-bold text-white">Visual Assets</h3>
            </div>
            <div className="space-y-3">
               {[
                 { t: "12.9\" iPad Screenshots", s: "Missing", c: "text-red-400" },
                 { t: "11\" iPad Screenshots", s: "Missing", c: "text-red-400" },
                 { t: "App Icon Bundle", s: "Ready", c: "text-green-500" },
                 { t: "Kiosk Preview Video", s: "Optional", c: "text-zinc-600" }
               ].map((item, i) => (
                 <div key={i} className="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-zinc-800/50">
                    <span className="text-[11px] font-medium text-zinc-300">{item.t}</span>
                    <span className={`text-[8px] font-black uppercase tracking-widest ${item.c}`}>{item.s}</span>
                 </div>
               ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );

  return (
    <div className="h-full max-w-7xl mx-auto space-y-10 overflow-y-auto pr-4 custom-scrollbar pb-32 px-4">
      <header className="flex flex-col md:flex-row md:items-end justify-between pt-6 gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-indigo-400 font-black uppercase tracking-[0.4em] text-[10px]">
            <Shield size={12} /> Family Hub Access • master account
          </div>
          <h2 className="text-6xl font-black tracking-tighter text-white">Household Overview</h2>
        </div>
        
        <div className="flex gap-4">
           <div className="flex bg-zinc-900 p-1.5 rounded-2xl border border-zinc-800">
             <button onClick={() => setActiveTab('registry')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'registry' ? 'bg-white text-black shadow-lg' : 'text-zinc-500 hover:text-white'}`}>Active Households</button>
             <button onClick={() => setActiveTab('launch')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'launch' ? 'bg-indigo-600 text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}>Launch Prep</button>
           </div>
        </div>
      </header>

      {activeTab === 'registry' ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Families Onboarded', value: '842', icon: Users, color: 'text-blue-400' },
              { label: 'Pro Memberships', value: '155', icon: Zap, color: 'text-amber-400' },
              { label: 'System Health', value: 'Optimal', icon: Activity, color: 'text-green-400' },
              { label: 'Shared Memories', value: '4.2k', icon: Package, color: 'text-purple-400' }
            ].map((item, i) => (
              <div key={i} className="p-8 bg-zinc-900/30 border border-zinc-800 rounded-[2.5rem] relative overflow-hidden group">
                <div className="relative z-10 space-y-4">
                  <div className={`w-12 h-12 rounded-2xl bg-zinc-900 flex items-center justify-center ${item.color} shadow-inner`}>
                    <item.icon size={24} />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-1">{item.label}</div>
                    <div className="text-4xl font-black text-white tracking-tight">{item.value}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <section className="bg-zinc-900/30 border border-zinc-800 rounded-[3rem] overflow-hidden shadow-2xl">
            <header className="p-10 border-b border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-zinc-950/20">
               <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-zinc-900 flex items-center justify-center text-indigo-400 shadow-inner"><Users size={32} /></div>
                  <div><h3 className="text-3xl font-bold text-white tracking-tight">Active Nodes</h3><p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">Household Deployment</p></div>
               </div>
               <div className="relative">
                  <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Find a family..." className="bg-black border border-zinc-800 rounded-2xl py-4 pl-12 pr-6 w-full md:w-80 outline-none focus:border-indigo-500 transition-all text-sm font-medium" />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
               </div>
            </header>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-zinc-950/40 text-[10px] font-black uppercase tracking-widest text-zinc-600 border-b border-zinc-800"><th className="px-10 py-6">Family</th><th className="px-6 py-6">Status</th><th className="px-6 py-6">Level</th><th className="px-10 py-6 text-right">Actions</th></tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {nodes.map(node => (
                    <tr key={node.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-10 py-8">
                        <div><div className="font-bold text-white text-lg">{node.familyName}</div><div className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">{node.email}</div></div>
                      </td>
                      <td className="px-6 py-8"><div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-green-500" /><span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{node.status}</span></div></td>
                      <td className="px-6 py-8"><div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${node.plan === 'Founder' ? 'bg-indigo-600/20 text-indigo-400' : 'bg-zinc-800 text-zinc-500'}`}>{node.plan}</div></td>
                      <td className="px-10 py-8 text-right"><button className="p-3 bg-zinc-900 rounded-xl text-zinc-500 hover:text-white transition-colors"><Info size={16} /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      ) : (
        <ReadinessChecklist />
      )}
    </div>
  );
};
