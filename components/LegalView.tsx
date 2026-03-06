
import React from 'react';
import { Shield, Lock, FileText, ChevronLeft } from 'lucide-react';

export const LegalView: React.FC = () => {
  return (
    <div className="h-full max-w-4xl mx-auto overflow-y-auto pr-6 custom-scrollbar pb-24 space-y-12">
      <header className="space-y-4">
        <h2 className="text-5xl font-bold tracking-tight">Legal & Privacy</h2>
        <p className="text-zinc-500 text-lg">Transparency regarding your household data.</p>
      </header>

      <section className="bg-zinc-900/30 p-10 rounded-[3rem] border border-zinc-800 space-y-8">
        <div className="flex items-center gap-4 text-blue-400">
          <Lock size={24} />
          <h3 className="text-2xl font-bold text-white">Privacy Policy</h3>
        </div>
        <div className="space-y-6 text-zinc-400 leading-relaxed text-sm">
          <p>Aura Wall Calendar ("the App") is designed with a privacy-first architecture. We do not sell, rent, or trade your family's personal data.</p>
          <div>
            <h4 className="font-bold text-zinc-200 mb-2">1. Data Storage</h4>
            <p>Your calendar events and notes are stored either locally on your device or in your private Supabase instance. The App developers have no access to your credentials or content.</p>
          </div>
          <div>
            <h4 className="font-bold text-zinc-200 mb-2">2. External Services</h4>
            <p>External iCal feeds are fetched directly from your provider (e.g., Apple or Google). We do not cache this data on external servers.</p>
          </div>
          <div>
            <h4 className="font-bold text-zinc-200 mb-2">3. AI Processing</h4>
            <p>Voice and text queries processed by the Aura Assistant are sent to Google Gemini API. This data is subject to Google's Privacy Policy.</p>
          </div>
        </div>
      </section>

      <section className="bg-zinc-900/30 p-10 rounded-[3rem] border border-zinc-800 space-y-8">
        <div className="flex items-center gap-4 text-orange-400">
          <FileText size={24} />
          <h3 className="text-2xl font-bold text-white">Terms of Use (EULA)</h3>
        </div>
        <div className="space-y-4 text-zinc-400 text-sm">
          <p>By using Aura, you agree to the standard Apple Licensed Application End User License Agreement.</p>
          <p>Users are responsible for ensuring their content does not violate any laws or third-party rights. The App is provided "as is" without warranty of any kind.</p>
        </div>
      </section>

      <footer className="text-center text-[10px] font-black uppercase tracking-widest text-zinc-700">
        Last Updated: May 2025 • AuraOS Legal Unit
      </footer>
    </div>
  );
};
