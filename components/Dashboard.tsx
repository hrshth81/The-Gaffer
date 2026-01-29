
import React, { useState, useRef, useEffect } from 'react';
import { Calendar, Star, Clock, CheckCircle2, Zap, Upload, FileText, Share2 } from 'lucide-react';
import { User, Fixture, League, Solution } from '../types';
import { INITIAL_FIXTURES } from '../constants';

interface DashboardProps {
  user: User;
  league: League | null;
  onPointsAwarded: (points: number) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, league, onPointsAwarded }) => {
  const [fixtures, setFixtures] = useState<Fixture[]>(INITIAL_FIXTURES);
  const [celebration, setCelebration] = useState<'GOAL' | null>(null);
  const [completedFixtureIds, setCompletedFixtureIds] = useState<string[]>([]);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem(`completed_${user.id}`);
    if (saved) setCompletedFixtureIds(JSON.parse(saved));
  }, [user.id]);

  const handleComplete = (fixtureId: string) => {
    setUploadingId(fixtureId);
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const onFileUploaded = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!uploadingId || !e.target.files?.length) return;
    
    const fixture = fixtures.find(f => f.id === uploadingId);
    if (!fixture) return;

    const file = e.target.files[0];
    const points = calculatePoints(fixture, 1, false);
    
    const reader = new FileReader();
    reader.onload = () => {
      const solution: Solution = {
        id: `sol-${Date.now()}`,
        fixtureId: uploadingId,
        userId: user.id,
        userName: user.name,
        timestamp: new Date(),
        fileName: file.name,
        fileContent: reader.result as string,
        points: points
      };

      const allSolutions: Solution[] = JSON.parse(localStorage.getItem('all_solutions') || '[]');
      localStorage.setItem('all_solutions', JSON.stringify([...allSolutions, solution]));

      const newCompleted = [...completedFixtureIds, uploadingId];
      setCompletedFixtureIds(newCompleted);
      localStorage.setItem(`completed_${user.id}`, JSON.stringify(newCompleted));
      
      onPointsAwarded(points);
      setCelebration('GOAL');
      setUploadingId(null);
      setTimeout(() => setCelebration(null), 3000);
    };
    reader.readAsDataURL(file);
  };

  const calculatePoints = (fixture: Fixture, rank: number, isLate: boolean) => {
    const base = fixture.difficulty * 20;
    const rankBonus = rank === 1 ? 100 : rank === 2 ? 70 : rank === 3 ? 50 : 10;
    const total = base + rankBonus;
    return isLate ? total * 0.5 : total;
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <input type="file" ref={fileInputRef} onChange={onFileUploaded} className="hidden" />

      {celebration === 'GOAL' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="goal-animation bg-emerald-500 text-white px-10 py-5 rounded-full shadow-2xl">
            <h2 className="text-2xl font-black uppercase tracking-[0.3em]">Goal Scored</h2>
          </div>
        </div>
      )}

      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Manager Points', val: user.totalPoints, icon: Zap, color: 'text-emerald-500' },
          { label: 'League', val: league?.name || 'Unassigned', icon: Calendar, color: 'text-blue-500' },
          { label: 'Invite Code', val: league?.inviteCode || '-', icon: Share2, color: 'text-amber-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-6 flex items-center gap-5">
            <div className={`p-3 rounded-lg bg-white/5 ${stat.color}`}>
              <stat.icon size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{stat.label}</p>
              <p className="text-xl font-bold text-white truncate max-w-[140px]">{stat.val}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2">
          <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Current Fixtures</h2>
          <span className="text-[10px] text-emerald-500 font-bold uppercase">Matchweek 01</span>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {fixtures.map((fixture) => {
            const isCompleted = completedFixtureIds.includes(fixture.id);
            const isPassed = new Date() > new Date(fixture.deadline);
            if (isPassed && !isCompleted) return null;

            return (
              <div key={fixture.id} className={`bg-[#0a0a0a] border border-[#1a1a1a] p-6 rounded-2xl flex flex-col md:flex-row gap-6 items-start md:items-center transition-all ${isCompleted ? 'opacity-40' : 'hover:border-emerald-500/30'}`}>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-gray-600">MW{fixture.matchweek}</span>
                    <h3 className={`text-sm font-bold ${isCompleted ? 'text-gray-500' : 'text-white'}`}>{fixture.title}</h3>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed max-w-xl">{fixture.description}</p>
                  <div className="flex items-center gap-4 pt-1">
                    <div className="flex items-center gap-0.5 text-amber-500/50">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={10} fill={i < fixture.difficulty ? "currentColor" : "none"} />
                      ))}
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-gray-600 font-bold uppercase">
                      <Clock size={12} />
                      {new Date(fixture.deadline).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div>
                  {isCompleted ? (
                    <div className="flex items-center gap-2 text-[10px] font-black text-emerald-500 tracking-widest bg-emerald-500/5 px-4 py-2 rounded-lg">
                      <CheckCircle2 size={14} />
                      SUBMITTED
                    </div>
                  ) : (
                    <button 
                      onClick={() => handleComplete(fixture.id)}
                      className="bg-white text-black font-bold px-5 py-2.5 rounded-xl transition-all hover:bg-emerald-400 text-[10px] uppercase tracking-widest flex items-center gap-2"
                    >
                      <Upload size={14} />
                      Upload
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-[#0a0a0a] border border-dashed border-[#1a1a1a] rounded-2xl p-8 flex flex-col items-center text-center">
        <FileText size={24} className="text-gray-700 mb-4" />
        <h3 className="text-xs font-black text-white uppercase tracking-widest mb-2">Technical Brief</h3>
        <p className="text-xs text-gray-500 max-w-sm leading-relaxed">
          The first manager to submit earns <span className="text-emerald-500 font-bold">100 bonus pts</span>. Results are validated by the Gaffer's office.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
