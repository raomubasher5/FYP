import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Sparkles, 
  CalendarDays, 
  ListChecks, 
  BarChart3, 
  Share2, 
  Settings, 
  Bot, 
  HelpCircle,
  RefreshCw,
  Compass
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import ThemeToggle from '../common/ThemeToggle';

export default function Sidebar() {
  const { profile, posts, actions } = useApp();

  const scheduledCount = posts.filter(p => p.status === 'scheduled').length;
  const draftsCount = posts.filter(p => p.status === 'draft').length;
  const isAutoMode = profile?.defaultMode === 'auto';

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/composer', label: 'AI Composer', icon: Sparkles, badge: 'Agent' },
    { to: '/calendar', label: 'Schedule Calendar', icon: CalendarDays },
    { to: '/queue', label: 'Post Queue', icon: ListChecks, count: draftsCount > 0 ? draftsCount : scheduledCount },
    { to: '/analytics', label: 'Audience & Sentiment', icon: BarChart3 },
    { to: '/channels', label: 'Channels & OAuth', icon: Share2 },
    { to: '/settings', label: 'Brand & AI Config', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white/95 dark:bg-[#0a0512]/95 border-r border-stone-200/90 dark:border-stone-800/80 flex flex-col justify-between shrink-0 select-none backdrop-blur-xl transition-colors duration-200">
      {/* Top Brand Header */}
      <div>
        <div className="p-5 border-b border-stone-200/80 dark:border-stone-800/80">
          <NavLink to="/dashboard" className="flex items-center space-x-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-500 to-violet-600 flex items-center justify-center shrink-0 shadow-sm shadow-pink-500/40 transition-transform group-hover:scale-105">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-base tracking-tight gradient-text">Automatrix</span>
                <span className="px-1.5 py-0.5 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 text-[9px] font-mono font-bold rounded">AI</span>
              </div>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate max-w-[135px] font-medium">
                {profile?.businessName || 'Business Workspace'}
              </p>
            </div>
          </NavLink>

          {/* Operating Mode Indicator */}
          <div className="mt-4 p-2.5 rounded-xl bg-stone-50 dark:bg-stone-900/90 border border-stone-200/80 dark:border-stone-800 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <span className={`w-2 h-2 rounded-full ${isAutoMode ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
              <span className="text-[11px] text-stone-800 dark:text-stone-200 font-semibold">
                {isAutoMode ? 'Auto-Pilot Mode' : 'Review Mode'}
              </span>
            </div>
            <span className="text-[9px] text-stone-600 dark:text-stone-400 bg-white dark:bg-stone-800 px-1.5 py-0.5 rounded font-mono font-bold border border-stone-200 dark:border-stone-700">
              {isAutoMode ? 'AUTONOMOUS' : 'MANUAL'}
            </span>
          </div>
        </div>

        {/* Multi-Page Navigation Menu */}
        <nav className="p-3 space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider font-mono">
            Workspace Pages
          </div>

          {navLinks.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 group ${
                  isActive
                    ? 'bg-pink-500 text-white font-bold shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100/80 dark:hover:bg-stone-900/60'
                }`}
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-white dark:text-stone-900' : 'text-stone-400 dark:text-stone-500 group-hover:text-stone-800 dark:group-hover:text-stone-200'
                      }`} />
                      <span>{item.label}</span>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      {item.badge && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                          isActive 
                            ? 'bg-stone-800 text-stone-200 dark:bg-stone-200 dark:text-stone-800' 
                            : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-700'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                      {item.count > 0 && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                          isActive 
                            ? 'bg-stone-800 text-white dark:bg-stone-200 dark:text-stone-900' 
                            : 'bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                        }`}>
                          {item.count}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </NavLink>
            );
          })}

          {/* Quick-Start Wizard Link */}
          <div className="pt-2">
            <NavLink
              to="/onboarding"
              className={({ isActive }) => `w-full flex items-center space-x-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition ${
                isActive
                  ? 'bg-gradient-to-tr from-pink-500 to-violet-600 text-white border-transparent font-bold shadow-xs'
                  : 'bg-stone-50 dark:bg-stone-900/40 border-stone-200/80 dark:border-stone-800/80 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              <Compass className="w-4 h-4 text-stone-500 dark:text-stone-400" />
              <span>Getting Started Guide</span>
            </NavLink>
          </div>
        </nav>
      </div>

      {/* Bottom Status Block */}
      <div className="p-4 border-t border-stone-200/80 dark:border-stone-800/80 space-y-3">
        {/* Scheduler Health Pill */}
        <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-900/80 border border-stone-200/80 dark:border-stone-800/80 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <div>
              <div className="text-stone-800 dark:text-stone-200 text-[11px] font-bold leading-none">Scheduler Daemon</div>
              <div className="text-[9px] text-stone-500 mt-0.5 font-mono">Running (Every 4s)</div>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-500/20">
            ONLINE
          </span>
        </div>

        {/* Segmented Theme Switcher & Reset Demo */}
        <div className="space-y-2">
          <ThemeToggle variant="segmented" className="w-full justify-between" />

          <button
            onClick={actions.resetWorkspace}
            className="w-full flex items-center justify-center space-x-1.5 py-1.5 px-3 rounded-xl text-[11px] font-medium text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200 hover:bg-stone-100/80 dark:hover:bg-stone-800/60 transition border border-transparent hover:border-stone-200 dark:hover:border-stone-800 cursor-pointer"
            title="Clear all posts, imported comments and logs (profile and channels are kept)"
          >
            <RefreshCw className="w-3 h-3 text-stone-400" />
            <span>Reset Workspace</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
