
import React, { useState } from 'react';
import { Rocket, Shield, Monitor, Check, ArrowRight, Home, Tablet, Sparkles } from 'lucide-react';

interface OnboardingWizardProps {
  onComplete: (data: { familyName: string }) => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [familyName, setFamilyName] = useState('');

  const steps = [
    { 
      title: "Welcome to Aura", 
      desc: "Your family's digital command center, designed for the wall.",
      icon: Sparkles,
      color: "from-indigo-500 to-purple-600"
    },
    { 
      title: "Identity", 
      desc: "How should we address your household display?",
      icon: Home,
      color: "from-blue-500 to-cyan-500"
    },
    { 
      title: "Mounting Tips", 
      desc: "For the best experience, place the iPad at eye-level in a high-traffic area.",
      icon: Tablet,
      color: "from-orange-500 to-red-500"
    }
  ];

  const currentStep = steps[step - 1];

  return (
    <div className="h-full w-full flex items-center justify-center p-6 bg-black">
      <div className="max-w-xl w-full space-y-12 text-center">
        <div className="flex justify-center gap-2">
          {steps.map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${step === i + 1 ? 'w-12 bg-white' : 'w-4 bg-zinc-800'}`} />
          ))}
        </div>

        <div className="space-y-6">
          <div className={`w-24 h-24 mx-auto rounded-[2rem] bg-gradient-to-tr ${currentStep.color} flex items-center justify-center text-white shadow-2xl shadow-indigo-500/20 animate-in zoom-in duration-500`}>
            <currentStep.icon size={40} />
          </div>
          <h2 className="text-5xl font-bold tracking-tight">{currentStep.title}</h2>
          <p className="text-zinc-500 text-xl max-w-sm mx-auto">{currentStep.desc}</p>
        </div>

        <div className="bg-zinc-900/50 p-10 rounded-[3rem] border border-zinc-800">
          {step === 2 ? (
            <div className="space-y-4">
              <input 
                autoFocus
                value={familyName}
                onChange={(e) => setFamilyName(e.target.value)}
                placeholder="The Miller Family"
                className="w-full bg-black border border-zinc-700 rounded-2xl py-5 px-6 outline-none focus:border-white transition-all text-2xl font-bold text-center"
              />
              <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">You can change this anytime in settings</p>
            </div>
          ) : (
            <div className="space-y-4 text-left">
              <div className="flex gap-4 items-start">
                <div className="mt-1 p-1 bg-green-500/10 text-green-500 rounded-full"><Check size={12} /></div>
                <p className="text-zinc-400 text-sm">Always-on display logic active</p>
              </div>
              <div className="flex gap-4 items-start">
                <div className="mt-1 p-1 bg-green-500/10 text-green-500 rounded-full"><Check size={12} /></div>
                <p className="text-zinc-400 text-sm">High-legibility typography optimized for distance</p>
              </div>
              <div className="flex gap-4 items-start">
                <div className="mt-1 p-1 bg-green-500/10 text-green-500 rounded-full"><Check size={12} /></div>
                <p className="text-zinc-400 text-sm">Zero-friction family interactions</p>
              </div>
            </div>
          )}
        </div>

        <button 
          onClick={() => {
            if (step < steps.length) setStep(step + 1);
            else onComplete({ familyName: familyName || 'Our Home' });
          }}
          className="w-full h-20 bg-white text-black rounded-[2rem] font-black text-xl flex items-center justify-center gap-3 hover:scale-[0.98] transition-all active:scale-95 shadow-xl"
        >
          {step === steps.length ? 'Begin Installation' : 'Continue'} <ArrowRight size={24} />
        </button>
      </div>
    </div>
  );
};
