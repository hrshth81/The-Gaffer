
import React, { useState } from 'react';
import { ShieldAlert, CheckCircle, Trophy, Zap, Clock, AlertTriangle } from 'lucide-react';

interface SeasonRegulationsProps {
  onAccept: () => void;
}

const SeasonRegulations: React.FC<SeasonRegulationsProps> = ({ onAccept }) => {
  const [checked, setChecked] = useState([false, false, false]);

  const allChecked = checked.every(Boolean);

  const rules = [
    {
      icon: <Trophy className="text-amber-400" />,
      title: "The Golden Boot",
      desc: "Speed is everything. The first to submit a solution earns 100 bonus points. Every second counts in the technical area."
    },
    {
      icon: <Zap className="text-emerald-400" />,
      title: "Tactical Difficulty",
      desc: "Fixtures are rated 1-5 stars. Harder matches yield higher base points. Don't shy away from the 'Heavyweight' assignments."
    },
    {
      icon: <AlertTriangle className="text-red-400" />,
      title: "Injury Time & VAR",
      desc: "Late submissions incur a 50% point penalty. Missed deadlines result in a Red Card, potentially banning you from next week's points."
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
      <div className="max-w-2xl w-full gaffer-glass rounded-[40px] p-8 md:p-12 space-y-8 animate-in zoom-in duration-500">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
            <ShieldAlert className="text-white w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase">Season Regulations</h1>
          <p className="text-gray-400 font-medium">Read the rulebook before taking your place in the dugout.</p>
        </div>

        <div className="grid gap-4">
          {rules.map((rule, idx) => (
            <div key={idx} className="bg-white/5 border border-white/10 p-5 rounded-2xl flex gap-4">
              <div className="mt-1">{rule.icon}</div>
              <div className="space-y-1">
                <h3 className="font-bold text-white uppercase text-sm">{rule.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{rule.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4 pt-4">
          {[
            "I accept the Gaffer's authority in all league decisions.",
            "I commit to the fair play guidelines and academic integrity.",
            "I acknowledge that points are final and VAR is absolute."
          ].map((text, idx) => (
            <label key={idx} className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={checked[idx]} 
                onChange={() => {
                  const newChecked = [...checked];
                  newChecked[idx] = !newChecked[idx];
                  setChecked(newChecked);
                }}
                className="w-5 h-5 rounded border-white/10 bg-white/5 text-emerald-500 focus:ring-emerald-500/50" 
              />
              <span className="text-xs font-semibold text-gray-300 group-hover:text-white transition-colors">{text}</span>
            </label>
          ))}
        </div>

        <button 
          disabled={!allChecked}
          onClick={onAccept}
          className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest transition-all ${
            allChecked 
            ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/20 hover:scale-[1.02]' 
            : 'bg-white/5 text-gray-600 cursor-not-allowed border border-white/10'
          }`}
        >
          {allChecked ? 'I ACCEPT - ENTER DUGOUT' : 'ACCEPT ALL RULES TO CONTINUE'}
        </button>
      </div>
    </div>
  );
};

export default SeasonRegulations;
