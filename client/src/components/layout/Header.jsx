import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  Sparkles, 
  Clock, 
  HelpCircle,
  Compass,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import ThemeToggle from '../common/ThemeToggle';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { accounts } = useApp();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const path = location.pathname.replace('/', '') || 'dashboard';

  const routeMeta = {
    dashboard: { title: 'Mission Control & Performance', category: 'Analytics' },
    composer: { title: 'AI Content Studio & Adaptive Engine', category: 'Generation' },
    calendar: { title: 'Content Schedule & Publishing Planner', category: 'Scheduler' },
    queue: { title: 'Post Lifecycle & Approval Pipeline', category: 'Workflow' },
    analytics: { title: 'Audience Intelligence & NLP Sentiment', category: 'Insights' },
    channels: { title: 'Social Media Channels & OAuth', category: 'Integration' },
    settings: { title: 'Brand Identity & Agent Rules', category: 'Configuration' },
    onboarding: { title: 'New User Guided Onboarding Tour', category: 'Welcome' }
  };

  const meta = routeMeta[path] || { title: 'Automatrix Workspace', category: 'General' };
  const connectedChannels = accounts.filter(a => a.status === 'connected');

  return (
    <header className="h-16 border-b border-stone-200/80 dark:border-stone-800/80 bg-white/80 dark:bg-[#0c0a09]/80 backdrop-blur-xl px-6 flex items-center justify-between sticky top-0 z-40 select-none transition-colors duration-200">
      {/* Breadcrumb & Title */}
      <div className="flex items-center space-x-3">
        <div>
          <div className="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider flex items-center space-x-1.5 font-mono">
            <span>Automatrix</span>
            <span>/</span>
            <span className="text-stone-600 dark:text-stone-400">{meta.category}</span>
            <span>/</span>
            <span className="text-stone-900 dark:text-stone-200 capitalize font-bold">{path}</span>
          </div>
          <h1 className="text-base font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
            {meta.title}
          </h1>
        </div>
      </div>

      {/* Right Action Widgets */}
      <div className="flex items-center space-x-3">
        {/* Connected Channels Pill */}
        <div className="hidden lg:flex items-center space-x-2 bg-stone-50 dark:bg-stone-900/90 border border-stone-200/80 dark:border-stone-800 px-3 py-1.5 rounded-xl text-xs">
          <span className="text-stone-500 dark:text-stone-400 text-[11px] font-semibold">Active:</span>
          <div className="flex items-center space-x-1.5">
            {connectedChannels.map((c) => (
              <span
                key={c.id}
                title={`${c.name} (${c.mode})`}
                className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 uppercase shadow-2xs"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1"></span>
                {c.platform === 'twitter' ? '𝕏' : c.platform.slice(0, 2)}
              </span>
            ))}
          </div>
        </div>

        {/* Live Clock */}
        <div className="hidden sm:flex items-center space-x-1.5 text-xs text-stone-600 dark:text-stone-400 bg-stone-50 dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800/80 px-2.5 py-1.5 rounded-xl font-mono">
          <Clock className="w-3.5 h-3.5 text-stone-400 dark:text-stone-500" />
          <span>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
        </div>

        {/* Theme Switcher Button */}
        <ThemeToggle showLabel={false} />

        {/* Getting Started Guide */}
        <Link
          to="/onboarding"
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-stone-50 dark:bg-stone-900 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200/80 dark:border-stone-800 rounded-xl text-xs font-semibold transition shadow-2xs"
          title="Open interactive guide"
        >
          <Compass className="w-3.5 h-3.5 text-stone-500 dark:text-stone-400" />
          <span className="hidden md:inline">Guided Tour</span>
        </Link>

        {/* Quick Launch Composer CTA */}
        {path !== 'composer' && (
          <button
            onClick={() => navigate('/composer')}
            className="flex items-center space-x-1.5 px-4 py-2 bg-stone-900 hover:bg-black text-white dark:bg-stone-100 dark:hover:bg-white dark:text-stone-900 font-semibold text-xs rounded-xl shadow-sm hover:shadow transition active:scale-[0.99] cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Create Campaign</span>
          </button>
        )}
      </div>
    </header>
  );
}
