import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Compass, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Share2, 
  CalendarClock, 
  Building2, 
  Bot, 
  Layers, 
  Play, 
  Check, 
  HelpCircle,
  Zap
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { profile, accounts, posts } = useApp();

  const connectedCount = accounts.filter(a => a.status === 'connected').length;
  const hasPosts = posts.length > 0;

  const steps = [
    {
      id: 1,
      title: "1. Brand Identity Setup",
      desc: "Configure your business name, industry, tone of voice, and target audience.",
      completed: Boolean(profile?.businessName),
      actionLabel: "Configure Profile",
      actionPath: "/settings",
      icon: Building2
    },
    {
      id: 2,
      title: "2. Connect Social Channels",
      desc: `Link your accounts (Instagram, X, Facebook, TikTok). Currently ${connectedCount} channels active.`,
      completed: connectedCount > 0,
      actionLabel: "Manage Channels",
      actionPath: "/channels",
      icon: Share2
    },
    {
      id: 3,
      title: "3. Craft Your First AI Campaign",
      desc: "Provide a simple concept and let the AI Agent generate channel-tailored variations & media prompts.",
      completed: hasPosts,
      actionLabel: "Launch Composer",
      actionPath: "/composer",
      icon: Sparkles
    },
    {
      id: 4,
      title: "4. Review, Schedule & Automate",
      desc: "Choose between 'Review Before Posting' (manual approval) or 'Auto-Pilot Mode' (fully autonomous).",
      completed: posts.some(p => p.status === 'scheduled' || p.status === 'published'),
      actionLabel: "View Post Queue",
      actionPath: "/queue",
      icon: CalendarClock
    }
  ];

  const completedCount = steps.filter(s => s.completed).length;
  const progressPct = Math.round((completedCount / steps.length) * 100);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Hero Welcome */}
      <div className="glass-panel rounded-3xl p-8 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 text-xs font-bold mb-3 font-mono">
              <Compass className="w-3.5 h-3.5 text-stone-700 dark:text-stone-300" />
              <span>New User Guided Onboarding</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
              Welcome to Automatrix! Let's get you set up.
            </h1>
            <p className="text-stone-600 dark:text-stone-300 text-xs md:text-sm mt-2 max-w-2xl leading-relaxed">
              Automatrix is an autonomous AI agent platform that eliminates repetitive social media work. Follow these 4 simple steps to run your first automated marketing cycle.
            </p>
          </div>

          <div className="bg-stone-50 dark:bg-stone-900/90 border border-stone-200 dark:border-stone-800 p-5 rounded-2xl shrink-0 w-full md:w-64 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-stone-700 dark:text-stone-300">Setup Progress</span>
              <span className="text-stone-900 dark:text-stone-100 font-mono font-bold">{progressPct}%</span>
            </div>
            <div className="w-full h-2.5 bg-stone-200 dark:bg-stone-950 rounded-full overflow-hidden border border-stone-300 dark:border-stone-800 shadow-inner">
              <div 
                style={{ width: `${progressPct}%` }} 
                className="bg-gradient-to-r from-pink-500 to-violet-600 h-full transition-all duration-500"
              />
            </div>
            <span className="text-[11px] text-stone-500 dark:text-stone-400 block text-center font-medium font-mono">
              {completedCount} of 4 milestones complete
            </span>
          </div>
        </div>
      </div>

      {/* 4 Interactive Milestones */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider font-mono">
          Step-by-Step Milestones
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.id}
                className={`glass-panel glass-panel-hover rounded-2xl p-6 flex flex-col justify-between transition ${
                  step.completed ? 'border-emerald-500/40 shadow-xs' : 'border-stone-200 dark:border-stone-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        step.completed 
                          ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20' 
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm">{step.title}</h3>
                    </div>

                    {step.completed ? (
                      <span className="flex items-center space-x-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-500/20">
                        <Check className="w-3 h-3" />
                        <span>Done</span>
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold text-stone-600 dark:text-stone-400 bg-stone-100 dark:bg-stone-900 px-2.5 py-1 rounded-full border border-stone-200 dark:border-stone-800 font-mono">
                        Pending
                      </span>
                    )}
                  </div>

                  <p className="text-stone-600 dark:text-stone-400 text-xs leading-relaxed mb-4">
                    {step.desc}
                  </p>
                </div>

                <button
                  onClick={() => navigate(step.actionPath)}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 cursor-pointer ${
                    step.completed
                      ? 'bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-300 border border-stone-200 dark:border-stone-700'
                      : 'blotato-cta shadow-xs active:scale-[0.99]'
                  }`}
                >
                  <span>{step.actionLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Visual Workflow Infographic Card */}
      <div className="glass-panel rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center space-x-2 text-stone-500 dark:text-stone-400 text-xs font-bold uppercase tracking-wider font-mono">
          <Zap className="w-4 h-4 text-stone-700 dark:text-stone-300" />
          <span>How Automatrix Works Under the Hood</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
          <div className="bg-stone-50 dark:bg-stone-900/80 p-4 rounded-2xl border border-stone-200/80 dark:border-stone-800/80 space-y-2">
            <div className="w-8 h-8 rounded-full bg-stone-200 dark:bg-stone-800 text-stone-900 dark:text-stone-100 flex items-center justify-center mx-auto font-bold text-xs font-mono">1</div>
            <div className="font-bold text-xs text-stone-900 dark:text-stone-100">Input Prompt</div>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">Owner types concept or selects a quick promotion template.</p>
          </div>

          <div className="bg-stone-50 dark:bg-stone-900/80 p-4 rounded-2xl border border-stone-200/80 dark:border-stone-800/80 space-y-2">
            <div className="w-8 h-8 rounded-full bg-stone-200 dark:bg-stone-800 text-stone-900 dark:text-stone-100 flex items-center justify-center mx-auto font-bold text-xs font-mono">2</div>
            <div className="font-bold text-xs text-stone-900 dark:text-stone-100">AI Adaptation</div>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">Agent builds tailored copy for IG, X, FB & TikTok with images.</p>
          </div>

          <div className="bg-stone-50 dark:bg-stone-900/80 p-4 rounded-2xl border border-stone-200/80 dark:border-stone-800/80 space-y-2">
            <div className="w-8 h-8 rounded-full bg-stone-200 dark:bg-stone-800 text-stone-900 dark:text-stone-100 flex items-center justify-center mx-auto font-bold text-xs font-mono">3</div>
            <div className="font-bold text-xs text-stone-900 dark:text-stone-100">Review or Auto</div>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">Approve manually in Queue or let Auto-Pilot post directly.</p>
          </div>

          <div className="bg-stone-50 dark:bg-stone-900/80 p-4 rounded-2xl border border-stone-200/80 dark:border-stone-800/80 space-y-2">
            <div className="w-8 h-8 rounded-full bg-stone-200 dark:bg-stone-800 text-stone-900 dark:text-stone-100 flex items-center justify-center mx-auto font-bold text-xs font-mono">4</div>
            <div className="font-bold text-xs text-stone-900 dark:text-stone-100">Auto-Publish & Feedback</div>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">Scheduler worker publishes to channels & gathers NLP sentiment.</p>
          </div>
        </div>

        {/* Quick Launch CTA */}
        <div className="pt-2 flex justify-center">
          <button
            onClick={() => navigate('/composer')}
            className="px-6 py-3 blotato-cta font-bold text-xs rounded-2xl shadow-sm hover:shadow transition transform active:scale-[0.99] flex items-center space-x-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Launch AI Composer Now</span>
          </button>
        </div>
      </div>
    </div>
  );
}
