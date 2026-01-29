
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import LeagueTable from './components/LeagueTable';
import Onboarding from './components/Onboarding';
import SolutionVault from './components/SolutionVault';
import SeasonRegulations from './components/SeasonRegulations';
import { User, League } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [league, setLeague] = useState<League | null>(null);
  const [leagueMembers, setLeagueMembers] = useState<User[]>([]);

  // Initialize from storage
  useEffect(() => {
    const savedUser = localStorage.getItem('gaffer_user');
    const savedLeague = localStorage.getItem('gaffer_league');
    const savedMembers = localStorage.getItem('gaffer_members');

    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedLeague) setLeague(JSON.parse(savedLeague));
    if (savedMembers) {
      setLeagueMembers(JSON.parse(savedMembers));
    }
  }, []);

  const handleLogin = (userData: User, leagueData?: League) => {
    setUser(userData);
    localStorage.setItem('gaffer_user', JSON.stringify(userData));
    
    if (leagueData) {
      setLeague(leagueData);
      localStorage.setItem('gaffer_league', JSON.stringify(leagueData));
      
      const members = JSON.parse(localStorage.getItem('gaffer_members') || '[]');
      if (!members.find((m: User) => m.id === userData.id)) {
        const updatedMembers = [...members, userData];
        setLeagueMembers(updatedMembers);
        localStorage.setItem('gaffer_members', JSON.stringify(updatedMembers));
      } else {
        setLeagueMembers(members);
      }
    }
  };

  const handleAcceptRules = () => {
    if (!user) return;
    const updatedUser = { ...user, acceptedRules: true };
    setUser(updatedUser);
    localStorage.setItem('gaffer_user', JSON.stringify(updatedUser));
    
    // Also update in members list
    const updatedMembers = leagueMembers.map(m => m.id === user.id ? updatedUser : m);
    setLeagueMembers(updatedMembers);
    localStorage.setItem('gaffer_members', JSON.stringify(updatedMembers));
  };

  const handleUpdatePoints = (points: number) => {
    if (!user) return;
    const updatedUser = { ...user, totalPoints: user.totalPoints + points };
    setUser(updatedUser);
    localStorage.setItem('gaffer_user', JSON.stringify(updatedUser));

    const updatedMembers = leagueMembers.map(m => 
      m.id === user.id ? updatedUser : m
    );
    setLeagueMembers(updatedMembers);
    localStorage.setItem('gaffer_members', JSON.stringify(updatedMembers));
  };

  const handleLogout = () => {
    setUser(null);
    setLeague(null);
    setLeagueMembers([]);
    localStorage.removeItem('gaffer_user');
    localStorage.removeItem('gaffer_league');
    localStorage.removeItem('gaffer_members');
  };

  if (user && !user.acceptedRules) {
    return <SeasonRegulations onAccept={handleAcceptRules} />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-[#0a0a0a] text-gray-100 selection:bg-emerald-500/30">
        <Routes>
          {!user ? (
            <Route path="*" element={<Onboarding onLogin={handleLogin} />} />
          ) : (
            <Route element={<Layout user={user} onLogout={handleLogout} />}>
              <Route path="/" element={<Dashboard user={user} league={league} onPointsAwarded={handleUpdatePoints} />} />
              <Route path="/table" element={<LeagueTable members={leagueMembers} />} />
              <Route path="/vault" element={<SolutionVault user={user} />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Route>
          )}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
