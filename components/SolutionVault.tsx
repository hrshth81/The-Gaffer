
import React, { useState, useEffect } from 'react';
import { User, Solution, Fixture } from '../types';
import { INITIAL_FIXTURES } from '../constants';
// Added FileText to the imports from lucide-react
import { Search, Filter, Eye, Download, ShieldCheck, FolderLock, Clock, User as UserIcon, FileText } from 'lucide-react';

interface SolutionVaultProps {
  user: User;
}

const SolutionVault: React.FC<SolutionVaultProps> = ({ user }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [vaultFixtures, setVaultFixtures] = useState<Fixture[]>([]);
  const [solutions, setSolutions] = useState<Solution[]>([]);

  useEffect(() => {
    const allSolutions: Solution[] = JSON.parse(localStorage.getItem('all_solutions') || '[]');
    setSolutions(allSolutions);

    // Logic: Fixtures move to vault after deadline.
    // Automatically "delete" (hide) after 3 weeks.
    const threeWeeksInMs = 21 * 24 * 60 * 60 * 1000;
    const now = Date.now();

    const expired = INITIAL_FIXTURES.filter(fixture => {
      const deadlineTime = new Date(fixture.deadline).getTime();
      return now > deadlineTime && now < (deadlineTime + threeWeeksInMs);
    });

    setVaultFixtures(expired);
  }, []);

  const filteredSolutions = solutions.filter(s => {
    const fixture = INITIAL_FIXTURES.find(f => f.id === s.fixtureId);
    if (!fixture) return false;
    
    const matchesSearch = fixture.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         s.userName.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Ensure the fixture is still within the "3 week" vault period
    const deadlineTime = new Date(fixture.deadline).getTime();
    const threeWeeksInMs = 21 * 24 * 60 * 60 * 1000;
    const isInVaultPeriod = Date.now() > deadlineTime && Date.now() < (deadlineTime + threeWeeksInMs);
    
    return matchesSearch && isInVaultPeriod;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">Match Highlights</h2>
          <p className="text-gray-400 font-medium">Post-Match Analysis - 3 Week Archives</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input 
              type="text" 
              placeholder="Search by fixture or manager..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all w-64"
            />
          </div>
          <button className="gaffer-glass p-2.5 rounded-xl hover:bg-white/10 transition-all text-gray-400">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {filteredSolutions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSolutions.map((sol) => {
            const fixture = INITIAL_FIXTURES.find(f => f.id === sol.fixtureId);
            return (
              <div key={sol.id} className="group relative gaffer-glass rounded-3xl overflow-hidden border border-white/5 hover:border-emerald-500/50 transition-all duration-300">
                <div className="h-48 bg-gradient-to-br from-emerald-900/40 to-black flex items-center justify-center p-8 opacity-60 group-hover:opacity-100 transition-opacity">
                   <div className="text-center space-y-2">
                     <FileText size={40} className="text-emerald-500 mx-auto" />
                     <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">{sol.fileName}</p>
                   </div>
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
                
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck size={14} className="text-emerald-500" />
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Verified Solution • {sol.points} PTS</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">{fixture?.title}</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <div className="flex items-center gap-1">
                        <UserIcon size={12} />
                        <span className="font-bold text-gray-300">{sol.userName}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        <span>{new Date(sol.timestamp).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 bg-white/10 rounded-lg hover:bg-emerald-500 hover:text-white transition-all">
                        <Eye size={16} />
                      </button>
                      <a 
                        href={sol.fileContent} 
                        download={sol.fileName}
                        className="p-2 bg-white/10 rounded-lg hover:bg-emerald-500 hover:text-white transition-all"
                      >
                        <Download size={16} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 gaffer-glass rounded-[40px] border-dashed border-2 border-white/10">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
             <FolderLock className="text-gray-600" size={32} />
          </div>
          <h3 className="text-white font-bold text-xl">The Vault is Quiet</h3>
          <p className="text-gray-500 text-sm max-w-sm text-center mt-2 italic">
            "You miss 100% of the shots you don't take." <br/>
            - Wayne Gretzky / Michael Scott
          </p>
          <p className="text-gray-600 text-[10px] uppercase font-bold tracking-widest mt-6">
            Solutions appear here once the deadline whistle blows.
          </p>
        </div>
      )}

      {vaultFixtures.length > 0 && (
        <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-6">
           <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-widest flex items-center gap-2">
             <Clock size={16} className="text-emerald-500" />
             Expiring Soon (VAR Deletion)
           </h4>
           <div className="flex flex-wrap gap-2">
             {vaultFixtures.map(f => (
               <div key={f.id} className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-[10px] font-bold text-gray-400">
                 {f.title}
               </div>
             ))}
           </div>
        </div>
      )}
    </div>
  );
};

export default SolutionVault;
