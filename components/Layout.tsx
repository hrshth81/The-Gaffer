
import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Trophy, FolderLock, LogOut, ShieldCheck } from 'lucide-react';
import { User } from '../types';

interface LayoutProps {
  user: User;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ user, onLogout }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dugout', icon: LayoutDashboard },
    { path: '/table', label: 'Standings', icon: Trophy },
    { path: '/vault', label: 'Archives', icon: FolderLock },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#050505]">
      {/* Sidebar */}
      <aside className="w-full md:w-60 bg-[#0a0a0a] border-b md:border-b-0 md:border-r border-[#1a1a1a] p-6 flex flex-col z-10">
        <div className="flex items-center gap-3 mb-12">
          <ShieldCheck className="text-emerald-500 w-6 h-6" />
          <h1 className="text-sm font-bold tracking-[0.2em] text-white uppercase">The Gaffer</h1>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive 
                    ? 'bg-white/5 text-emerald-400 font-semibold' 
                    : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                }`}
              >
                <Icon size={18} />
                <span className="text-xs uppercase tracking-wider">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-6 border-t border-[#1a1a1a]">
          <div className="flex items-center gap-3 px-2 mb-6">
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-[10px] font-bold text-emerald-500">
              {user.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">{user.name}</p>
              <p className="text-[10px] text-gray-600 font-medium uppercase">{user.role}</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-gray-500 hover:text-red-400 transition-all text-xs uppercase tracking-widest font-bold"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 md:p-10">
        <div className="max-w-5xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
