
import React, { useState } from 'react';
import { User, League } from '../types';
import { ShieldCheck, ArrowRight, Globe, Users } from 'lucide-react';

interface OnboardingProps {
  onLogin: (user: User, league?: League) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onLogin }) => {
  const [step, setStep] = useState<'AUTH' | 'TECHNICAL_AREA' | 'CREATE_LEAGUE' | 'JOIN_LEAGUE'>('AUTH');
  const [formData, setFormData] = useState({ name: '', leagueName: '', inviteCode: '' });

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim()) {
      setStep('TECHNICAL_AREA');
    }
  };

  const createLeague = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const newLeague: League = {
      id: `league-${Date.now()}`,
      name: formData.leagueName || 'Premier Scholars',
      inviteCode: code,
      members: [],
    };
    
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: formData.name,
      role: 'MANAGER',
      totalPoints: 0,
    };

    onLogin(newUser, newLeague);
  };

  const joinLeague = () => {
    const mockLeague: League = {
      id: `league-joined`,
      name: 'Active League',
      inviteCode: formData.inviteCode,
      members: [],
    };

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: formData.name,
      role: 'PLAYER',
      totalPoints: 0,
    };

    onLogin(newUser, mockLeague);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#050505]">
      <div className="max-w-sm w-full animate-in fade-in duration-700">
        <div className="text-center mb-12">
          <ShieldCheck className="text-emerald-500 w-12 h-12 mx-auto mb-4" />
          <h1 className="text-xs font-black text-gray-500 tracking-[0.4em] uppercase mb-2">The Gaffer</h1>
          <p className="text-xl font-light text-white">Season Kickoff</p>
        </div>

        {step === 'AUTH' && (
          <form onSubmit={handleAuth} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-black text-gray-500 ml-1">Manager Name</label>
              <input 
                required
                autoFocus
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl py-4 px-6 text-white focus:border-emerald-500/50 transition-all font-medium"
                placeholder="e.g. Guardiola"
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-widest"
            >
              Continue
              <ArrowRight size={16} />
            </button>
          </form>
        )}

        {step === 'TECHNICAL_AREA' && (
          <div className="space-y-3 animate-in slide-in-from-bottom-4 duration-500">
            <button 
              onClick={() => setStep('CREATE_LEAGUE')}
              className="w-full gaffer-card p-6 rounded-2xl transition-all text-left flex items-center justify-between group"
            >
              <div>
                <p className="text-white font-bold text-sm">Create League</p>
                <p className="text-gray-500 text-[10px] uppercase tracking-wider mt-1">Start a new season</p>
              </div>
              <Globe size={18} className="text-gray-600 group-hover:text-emerald-500 transition-colors" />
            </button>

            <button 
              onClick={() => setStep('JOIN_LEAGUE')}
              className="w-full gaffer-card p-6 rounded-2xl transition-all text-left flex items-center justify-between group"
            >
              <div>
                <p className="text-white font-bold text-sm">Join League</p>
                <p className="text-gray-500 text-[10px] uppercase tracking-wider mt-1">Use invite code</p>
              </div>
              <Users size={18} className="text-gray-600 group-hover:text-emerald-500 transition-colors" />
            </button>
          </div>
        )}

        {step === 'CREATE_LEAGUE' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-black text-gray-500 ml-1">League Identity</label>
              <input 
                required
                value={formData.leagueName}
                onChange={e => setFormData({...formData, leagueName: e.target.value})}
                className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl py-4 px-6 text-white focus:border-emerald-500/50 transition-all font-medium"
                placeholder="e.g. ChemEng 2025"
              />
            </div>
            <button 
              onClick={createLeague}
              className="w-full bg-emerald-500 text-white font-bold py-4 rounded-xl transition-all text-xs uppercase tracking-widest"
            >
              Initialize League
            </button>
            <button onClick={() => setStep('TECHNICAL_AREA')} className="w-full text-[10px] text-gray-600 font-bold uppercase tracking-[0.2em]">Go Back</button>
          </div>
        )}

        {step === 'JOIN_LEAGUE' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-black text-gray-500 ml-1">Invite Code</label>
              <input 
                required
                value={formData.inviteCode}
                onChange={e => setFormData({...formData, inviteCode: e.target.value.toUpperCase()})}
                className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl py-4 px-6 text-white focus:border-emerald-500/50 transition-all text-center tracking-[0.5em] font-black"
                placeholder="XXXXXX"
                maxLength={6}
              />
            </div>
            <button 
              onClick={joinLeague}
              className="w-full bg-white text-black font-bold py-4 rounded-xl transition-all text-xs uppercase tracking-widest"
            >
              Join Season
            </button>
            <button onClick={() => setStep('TECHNICAL_AREA')} className="w-full text-[10px] text-gray-600 font-bold uppercase tracking-[0.2em]">Go Back</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
