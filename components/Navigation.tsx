import React from 'react';
import { User, UserRole } from '../types';
import { Layout, Code, GraduationCap, Settings, LogOut } from 'lucide-react';

interface NavigationProps {
  currentUser: User;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentUser, activeTab, onTabChange, onLogout }) => {
  const navItems = [
    { id: 'feed', label: 'Community Feed', icon: <Layout className="w-5 h-5" /> },
    { id: 'code', label: 'Code Playground', icon: <Code className="w-5 h-5" /> },
    { id: 'tutor', label: 'AI Tutor', icon: <GraduationCap className="w-5 h-5" /> },
  ];

  if (currentUser.role === UserRole.ADMIN) {
    navItems.push({ id: 'admin', label: 'Admin Panel', icon: <Settings className="w-5 h-5" /> });
  }

  return (
    <nav className="fixed top-0 left-0 h-screen w-64 bg-slate-900 text-white flex flex-col border-r border-slate-800 z-50">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
          StudyComm
        </h1>
        <p className="text-slate-400 text-xs mt-1">Learn. Code. Connect.</p>
      </div>

      <div className="flex-1 py-6 space-y-2 px-3">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              activeTab === item.id
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </div>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center space-x-3 mb-4 px-2">
          <img src={currentUser.avatar} alt="User" className="w-10 h-10 rounded-full border-2 border-indigo-500" />
          <div className="overflow-hidden">
            <p className="font-semibold text-sm truncate">{currentUser.name}</p>
            <p className="text-xs text-slate-400 truncate capitalize">{currentUser.role.toLowerCase()}</p>
          </div>
        </div>
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-center space-x-2 bg-slate-800 hover:bg-red-900/30 hover:text-red-400 text-slate-300 py-2 rounded-lg transition-colors text-sm"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </nav>
  );
};