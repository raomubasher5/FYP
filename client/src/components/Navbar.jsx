import React from 'react';
import { 
  Bot, 
  LayoutDashboard, 
  Sparkles, 
  CalendarDays, 
  ListChecks, 
  BarChart3, 
  Share2, 
  Settings,
  RefreshCw,
  ShieldCheck,
  Zap
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, profile, onResetDemo }) {
  const tabs = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'studio', label: 'AI Composer', icon: Sparkles, badge: 'Agent' },
    { id: 'calendar', label: 'Calendar', icon: CalendarDays },
    { id: 'queue', label: 'Post Queue', icon: ListChecks },
    { id: 'analytics', label: 'Analytics & Sentiment', icon: BarChart3 },
    { id: 'accounts', label: 'Connected Channels', icon: Share2 },
    { id: 'settings', label: 'AI & Brand Config', icon: Settings },
  ];

  const isAutoMode = profile?.defaultMode === 'auto';

  return (
    <header className="bg-slate-900/90 border-b border-slate-800 sticky top-0 z-50 backdrop-blur-md">
      {/* Top Banner with Brand Profile & Status */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between border-b border-slate-800/60 gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold tracking-tight text-white text-lg">Automatrix</span>
              <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-semibold px-2 py-0.5 rounded-full border border-indigo-500/30">
                FYP AI Agent
              </span>
            </div>
            <div className="text-xs text-slate-400 flex items-center space-x-2">
              <span>{profile?.businessName || 'Business Workspace'}</span>
              <span>•</span>
              <span className="text-slate-400">{profile?.industry || 'Small Business'}</span>
            </div>
          </div>
        </div>

        {/* Live Agent Mode & Controls */}
        <div className="flex items-center space-x-3">
          <div className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
            isAutoMode 
              ? 'bg-purple-950/60 text-purple-300 border-purple-500/40' 
              : 'bg-amber-950/60 text-amber-300 border-amber-500/40'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isAutoMode ? 'bg-purple-400 animate-pulse' : 'bg-amber-400'}`}></span>
            <span>{isAutoMode ? 'Mode: Full Auto-Pilot' : 'Mode: Review Before Posting'}</span>
          </div>

          <div className="hidden md:flex items-center space-x-1 text-xs text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/60">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-emerald-400 font-medium">Scheduler Active</span>
          </div>

          <button
            onClick={onResetDemo}
            title="Reset demonstration data to initial FYP proposal state"
            className="flex items-center space-x-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 transition"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 flex space-x-1 overflow-x-auto py-2 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-150 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                  isActive ? 'bg-indigo-400/30 text-white' : 'bg-indigo-500/20 text-indigo-300'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </header>
  );
}
