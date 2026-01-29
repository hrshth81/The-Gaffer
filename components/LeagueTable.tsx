
import React from 'react';
import { User } from '../types';
import { ChevronUp, Minus, Trophy } from 'lucide-react';

interface LeagueTableProps {
  members: User[];
}

const LeagueTable: React.FC<LeagueTableProps> = ({ members }) => {
  const sortedMembers = [...members].sort((a, b) => b.totalPoints - a.totalPoints);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div>
        <h2 className="text-xl font-light text-white mb-1">Standings</h2>
        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Season Rank & Performance</p>
      </div>

      <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl overflow-hidden">
        {sortedMembers.length === 0 ? (
          <div className="p-20 text-center">
             <Trophy className="mx-auto text-gray-800 w-8 h-8 mb-4" />
             <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">No managers registered</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white/5 text-gray-500 uppercase text-[10px] font-black tracking-widest">
                <tr>
                  <th className="px-6 py-4 w-16">Pos</th>
                  <th className="px-6 py-4">Manager</th>
                  <th className="px-6 py-4 text-center">Matchweek</th>
                  <th className="px-6 py-4 text-center text-white">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a1a1a]">
                {sortedMembers.map((member, idx) => {
                  const pos = idx + 1;
                  return (
                    <tr key={member.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-black ${pos === 1 ? 'text-amber-500' : 'text-gray-600'}`}>
                            {pos.toString().padStart(2, '0')}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[8px] font-bold text-gray-400">
                            {member.name.charAt(0)}
                          </div>
                          <p className="font-bold text-white text-xs tracking-wide">{member.name}</p>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center text-[10px] font-black text-gray-600">01</td>
                      <td className="px-6 py-5 text-center font-black text-emerald-400 text-sm tracking-widest">{member.totalPoints}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-6 rounded-2xl">
        <h4 className="text-[10px] font-black text-white mb-2 uppercase tracking-widest">Regulation Note</h4>
        <p className="text-[10px] text-gray-600 leading-relaxed uppercase tracking-wider">
          Points are synchronized every 15 minutes. VAR review is applied to all speed bonuses.
        </p>
      </div>
    </div>
  );
};

export default LeagueTable;
