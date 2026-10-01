import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Send, 
  CalendarClock, 
  Users, 
  Smile, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Play, 
  Activity, 
  TrendingUp, 
  Share2, 
  Layers, 
  Radio,
  ExternalLink,
  Compass,
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { profile, posts, accounts, analytics, logs, actions } = useApp();

  const publishedPosts = posts.filter(p => p.status === 'published');
  const scheduledPosts = posts.filter(p => p.status === 'scheduled');
  const draftPosts = posts.filter(p => p.status === 'draft');
  const nextScheduled = scheduledPosts[0];

  const setupSteps = [
    { title: 'Brand Setup', done: Boolean(profile?.businessName) },
    { title: 'Channels Linked', done: accounts.some(a => a.status === 'connected') },
    { title: 'AI Post Generated', done: posts.length > 0 },
    { title: 'Auto-Scheduler Active', done: true }
  ];
  const completedCount = setupSteps.filter(s => s.done).length;
  const progressPct = Math.round((completedCount / setupSteps.length) * 100);

  return (
    <div className="space-y-6">
      {/* Subtle Onboarding Helper Banner */}
      <div className="glass-panel rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-stone-200/90 dark:border-stone-800">
        <div className="flex items-center space-x-3.5">
          <div className="w-9 h-9 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 flex items-center justify-center shrink-0 border border-stone-200 dark:border-stone-700">
            <Compass className="w-4 h-4 text-stone-700 dark:text-stone-300" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-stone-900 dark:text-stone-100 text-xs">New to Automatrix?</span>
              <span className="text-[10px] bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 px-2 py-0.5 rounded-full font-mono font-bold border border-stone-200 dark:border-stone-700">
                {progressPct}% Completed
              </span>
            </div>
            <p className="text-stone-500 dark:text-stone-400 text-xs mt-0.5">
              Follow the quick-start guide to see how the autonomous AI agent writes, schedules, and publishes posts.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <Link
            to="/onboarding"
            className="px-3.5 py-1.5 blotato-cta font-semibold text-xs rounded-xl shadow-xs transition flex items-center space-x-1.5 cursor-pointer active:scale-[0.99]"
          >
            <span>Open Quick-Start Tour</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Editorial Hero Welcome Banner */}
      <div className="glass-panel glow-hero rounded-3xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 animate-fade-up stagger-1">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 text-xs font-mono font-bold mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Autonomous Engine Active</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
            {profile?.businessName || 'Business Workspace'}
          </h1>
          <p className="text-stone-500 dark:text-stone-400 text-xs md:text-sm mt-1 max-w-2xl leading-relaxed">
            Managing unified social media operations across X, Instagram, Facebook & TikTok with{' '}
            <span className="gradient-text font-semibold">zero daily manual friction</span>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => navigate('/composer')}
            className="px-5 py-2.5 blotato-cta font-semibold text-xs rounded-full transition active:scale-[0.99] flex items-center space-x-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Compose with AI</span>
          </button>

          <button
            onClick={() => navigate('/queue')}
            className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-semibold text-xs rounded-xl border border-stone-200 dark:border-stone-700 transition cursor-pointer"
          >
            Review Queue ({draftPosts.length} drafts)
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-up stagger-2">
        {/* Card 1: Published */}
        <div className="glass-panel glass-panel-hover rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">Published Dispatches</span>
            <div className="w-8 h-8 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 flex items-center justify-center border border-stone-200 dark:border-stone-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <div className="text-3xl font-extrabold mt-3 tracking-tight gradient-text">
            {publishedPosts.length}
          </div>
          <div className="flex items-center justify-between mt-3 text-xs">
            <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center space-x-1 font-mono">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
              <span>Scheduler Active</span>
            </span>
            <span className="text-stone-500 text-[11px] font-mono">Live on {accounts.filter(a => a.status === 'connected').length} channels</span>
          </div>
        </div>

        {/* Card 2: Scheduled */}
        <div className="glass-panel glass-panel-hover rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">Scheduled in Pipeline</span>
            <div className="w-8 h-8 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 flex items-center justify-center border border-stone-200 dark:border-stone-700">
              <CalendarClock className="w-4 h-4 text-stone-600 dark:text-stone-400" />
            </div>
          </div>
          <div className="text-3xl font-extrabold mt-3 tracking-tight gradient-text">
            {scheduledPosts.length}
          </div>
          <div className="flex items-center justify-between mt-3 text-xs">
            <span className="text-stone-600 dark:text-stone-400 font-medium font-mono">
              +{draftPosts.length} drafts awaiting review
            </span>
            <span className="text-stone-500 text-[11px] font-mono">Auto-Worker ON</span>
          </div>
        </div>

        {/* Card 3: Reach */}
        <div className="glass-panel glass-panel-hover rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">Total Audience Reach</span>
            <div className="w-8 h-8 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 flex items-center justify-center border border-stone-200 dark:border-stone-700">
              <Users className="w-4 h-4 text-stone-600 dark:text-stone-400" />
            </div>
          </div>
          <div className="text-3xl font-extrabold mt-3 tracking-tight gradient-text">
            {(analytics?.overview?.totalReach || 0).toLocaleString()}
          </div>
          <div className="flex items-center justify-between mt-3 text-xs">
            <span className="text-stone-600 dark:text-stone-400 font-medium font-mono">
              {analytics?.overview?.totalEngagement ?? 0} total interactions
            </span>
            <span className="text-stone-500 text-[11px] font-mono">All time</span>
          </div>
        </div>

        {/* Card 4: Sentiment */}
        <div className="glass-panel glass-panel-hover rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">Audience Sentiment</span>
            <div className="w-8 h-8 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 flex items-center justify-center border border-stone-200 dark:border-stone-700">
              <Smile className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <div className="text-3xl font-extrabold mt-3 tracking-tight gradient-text">
            {analytics?.sentiment ? `${analytics.sentiment.positive}%` : '—'}
          </div>
          <div className="flex items-center justify-between mt-3 text-xs">
            <span className="text-emerald-700 dark:text-emerald-400 font-semibold font-mono">
              {analytics?.sentiment ? 'Positive Affinity' : 'No comments imported yet'}
            </span>
            <span className="text-stone-500 text-[11px] font-mono">
              {analytics?.sentiment ? `${analytics.sentiment.negative}% Negative` : 'Import in Analytics'}
            </span>
          </div>
        </div>
      </div>


      {/* Main Grid: Scheduled Dispatch & Activity Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Next Scheduled Post Box */}
          <div className="glass-panel rounded-2xl p-6 shadow-sm animate-fade-up stagger-3">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-stone-700 dark:text-stone-300" />
                <h2 className="text-xs font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider font-mono">Next Autonomous Dispatch</h2>
              </div>
              <span className="text-xs bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 px-2.5 py-0.5 rounded-full font-mono font-medium">
                Live Scheduler Queue
              </span>
            </div>

            {nextScheduled ? (
              <div className="bg-stone-50 dark:bg-stone-900/90 rounded-2xl p-5 border border-stone-200 dark:border-stone-800 flex flex-col md:flex-row md:items-center justify-between gap-5">
                <div className="flex items-start space-x-4">
                  {nextScheduled.imageUrl && (
                    <img 
                      src={nextScheduled.imageUrl} 
                      alt="Thumbnail" 
                      className="w-16 h-16 rounded-xl object-cover border border-stone-200 dark:border-stone-700 shrink-0 shadow-md" 
                    />
                  )}
                  <div>
                    <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm">{nextScheduled.topic}</h3>
                    <p className="text-stone-500 dark:text-stone-400 text-xs mt-1 line-clamp-2 leading-relaxed">
                      {nextScheduled.platforms?.instagram?.caption || nextScheduled.platforms?.twitter?.text || 'Automated post payload ready'}
                    </p>
                    <div className="flex items-center space-x-3 text-[11px] text-stone-500 mt-2 font-mono">
                      <span className="text-stone-800 dark:text-stone-200 font-semibold">
                        Due: {new Date(nextScheduled.scheduledTime).toLocaleString()}
                      </span>
                      <span>•</span>
                      <span>Target: {nextScheduled.targetPlatforms?.join(', ')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => actions.publishNow(nextScheduled.id)}
                    className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-sm transition cursor-pointer"
                    title="Publish immediately in sandbox simulation mode — no live platform calls"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Publish Now (Sandbox)</span>
                  </button>
                  <button
                    onClick={() => navigate('/queue')}
                    className="px-3 py-2 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs rounded-xl transition border border-stone-200 dark:border-stone-700 font-medium cursor-pointer"
                  >
                    Manage
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center bg-stone-50 dark:bg-stone-900/40 rounded-2xl border border-dashed border-stone-200 dark:border-stone-800">
                <CalendarClock className="w-8 h-8 text-stone-400 dark:text-stone-500 mx-auto mb-2" />
                <p className="text-sm font-semibold text-stone-800 dark:text-stone-300">No posts currently queued in schedule</p>
                <p className="text-xs text-stone-500 mt-1">Generate a new multi-platform post using the AI Composer.</p>
                <button
                  onClick={() => navigate('/composer')}
                  className="mt-3 px-4 py-2 blotato-cta text-xs rounded-xl font-bold transition shadow-sm cursor-pointer"
                >
                  Create AI Campaign
                </button>
              </div>
            )}
          </div>

      {/* Chart data: computed from REAL published post metrics (last 7 days) */}
      {(() => {
        const trend = analytics?.trend || [];
        const hasData = trend.some((d) => d.reach > 0 || d.engagements > 0);
        const W = 600;
        const H = 150;
        const max = Math.max(1, ...trend.map((d) => Math.max(d.reach, d.engagements)));
        const x = (i) => (trend.length > 1 ? (i / (trend.length - 1)) * W : W / 2);
        const y = (v) => H - 10 - (v / max) * (H - 30);
        const linePath = (key) =>
          trend.map((d, i) => `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(1)} ${y(d[key]).toFixed(1)}`).join(' ');
        const areaPath = trend.length ? `${linePath('reach')} L ${W} ${H} L 0 ${H} Z` : '';
        return (
          /* Interactive Reach Growth Chart — real data only */
          <div className="glass-panel rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Audience Reach & Growth Trends</span>
                </h3>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                  {hasData
                    ? 'Last 7 days, computed from your published posts\u2019 recorded metrics'
                    : 'Last 7 days — publish posts with recorded metrics to see real growth data'}
                </p>
              </div>

              <div className="flex items-center space-x-3 text-xs font-mono">
                <span className="flex items-center space-x-1.5 text-stone-800 dark:text-stone-200">
                  <span className="w-2 h-2 rounded-full bg-violet-500 dark:bg-violet-400"></span>
                  <span>Reach</span>
                </span>
                <span className="flex items-center space-x-1.5 text-emerald-600 dark:text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>Interactions</span>
                </span>
              </div>
            </div>

            {hasData ? (
              <div className="h-44 w-full pt-2">
                <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1c1917" stopOpacity="0.12" />
                      <stop offset="100%" stopColor="#1c1917" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Guide lines */}
                  <line x1="0" y1={H * 0.2} x2={W} y2={H * 0.2} stroke="#e7e5e4" strokeDasharray="3 3" />
                  <line x1="0" y1={H * 0.5} x2={W} y2={H * 0.5} stroke="#e7e5e4" strokeDasharray="3 3" />
                  <line x1="0" y1={H * 0.8} x2={W} y2={H * 0.8} stroke="#e7e5e4" strokeDasharray="3 3" />

                  {/* Area under reach curve */}
                  {areaPath && <path d={areaPath} fill="url(#chartGradient)" />}

                  {/* Reach line */}
                  <path d={linePath('reach')} fill="none" stroke="#1c1917" strokeWidth="2.5" strokeLinecap="round" className="dark:stroke-stone-100" />

                  {/* Interactions line */}
                  <path d={linePath('engagements')} fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" />

                  {/* Data points */}
                  {trend.map((d, i) => (
                    <g key={d.date}>
                      <circle cx={x(i)} cy={y(d.reach)} r={d.reach > 0 ? 3.5 : 2.5} fill="#1c1917" stroke="#fff" strokeWidth="1.5" className="dark:fill-stone-100" />
                      <title>{`${d.label}: reach ${d.reach}, interactions ${d.engagements}`}</title>
                    </g>
                  ))}
                </svg>
              </div>
            ) : (
              <div className="h-44 flex flex-col items-center justify-center text-center bg-stone-50 dark:bg-stone-900/40 rounded-2xl border border-dashed border-stone-200 dark:border-stone-800">
                <TrendingUp className="w-8 h-8 text-stone-400 dark:text-stone-500 mb-2" />
                <p className="text-sm font-semibold text-stone-800 dark:text-stone-300">No reach data yet</p>
                <p className="text-xs text-stone-500 mt-1 max-w-xs">
                  This chart is computed from real engagement recorded on your published posts. Nothing is plotted until real data exists.
                </p>
              </div>
            )}

            <div className="flex items-center justify-between text-[11px] text-stone-500 px-2 font-mono border-t border-stone-200/80 dark:border-stone-800 pt-2">
              {trend.map((d, i) => (
                <span key={d.date} className={i === trend.length - 1 ? 'text-stone-900 dark:text-stone-100 font-bold' : ''}>
                  {d.label}
                </span>
              ))}
            </div>
          </div>
        );
      })()}
        </div>

        {/* Right Column (4 cols): Live Activity Stream & Channel Ticker */}
        <div className="lg:col-span-4 space-y-6">
          {/* Live Activity Console */}
          <div className="glass-panel rounded-2xl p-5 shadow-sm flex flex-col h-full">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider flex items-center space-x-2 font-mono">
                <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Agent Activity Stream</span>
              </h2>
              <span className="text-[10px] bg-emerald-50 dark:bg-stone-900 border border-emerald-200 dark:border-stone-800 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full font-mono font-bold">
                LIVE
              </span>
            </div>

            <p className="text-xs text-stone-500 dark:text-stone-400 mb-3">
              Continuous background audit log tracking scheduler jobs, dispatches, and content drafting:
            </p>

            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {logs && logs.length > 0 ? (
                logs.map((log, i) => (
                  <div key={i} className="bg-stone-50 dark:bg-stone-900/90 border border-stone-200 dark:border-stone-800/80 rounded-xl p-3 text-xs font-mono">
                    <div className="flex items-center justify-between text-[10px] text-stone-500 mb-1">
                      <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                      <span className="uppercase text-emerald-700 dark:text-emerald-400 font-semibold">{log.level}</span>
                    </div>
                    <div className="text-stone-800 dark:text-stone-300 text-[11px] leading-relaxed break-words font-sans">
                      {log.message}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-stone-500 py-8 text-xs">
                  No activity recorded yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
