import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Smile, 
  Frown, 
  Meh, 
  Sparkles, 
  MessageSquare, 
  Share2, 
  ThumbsUp, 
  AlertCircle,
  BrainCircuit,
  ArrowUpRight
} from 'lucide-react';

export default function AnalyticsTab({ analytics, posts, onApplyRecommendation }) {
  const [filterPlatform, setFilterPlatform] = useState('all');

  const {
    totalPosts = 0,
    totalEngagement = 0,
    avgEngagementRate = '0.0%',
    sentiment = { positive: 0, neutral: 0, negative: 0 },
    platformBreakdown = {},
    topComments = [],
    recommendations = []
  } = analytics || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-stone-500 dark:text-stone-400 text-xs font-bold uppercase tracking-wider mb-1 font-mono">
            <BarChart3 className="w-4 h-4 text-stone-700 dark:text-stone-300" />
            <span>AI Feedback Loop & Intelligence</span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
            Analytics & Sentiment Insights
          </h1>
          <p className="text-stone-500 dark:text-stone-400 text-xs mt-1">
            Real-time sentiment telemetry, cross-platform performance, and closed-loop optimization prompts.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl text-emerald-600 dark:text-emerald-400 text-xs font-mono font-semibold">
          <BrainCircuit className="w-4 h-4" />
          <span>Loop Active: Self-Tuning Prompts</span>
        </div>
      </div>

      {/* Top 4 KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel rounded-2xl p-5 shadow-sm space-y-2">
          <span className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Dispatches</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{totalPosts}</div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center space-x-1 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Active across 4 networks</span>
          </span>
        </div>

        <div className="glass-panel rounded-2xl p-5 shadow-sm space-y-2">
          <span className="text-stone-500 dark:text-stone-400 text-xs font-semibold uppercase tracking-wider">Total Interactions</span>
          <div className="text-2xl font-black text-stone-900 dark:text-stone-100 tracking-tight">{totalEngagement.toLocaleString()}</div>
          <span className="text-[11px] text-stone-600 dark:text-stone-400 flex items-center space-x-1 font-medium">
            <Share2 className="w-3.5 h-3.5" />
            <span>Likes, shares, retweets & saves</span>
          </span>
        </div>

        <div className="glass-panel rounded-2xl p-5 shadow-sm space-y-2">
          <span className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">Avg Engagement Rate</span>
          <div className="text-2xl font-black text-cyan-600 dark:text-cyan-400 tracking-tight">{avgEngagementRate}</div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center space-x-1 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+1.4% vs industry baseline</span>
          </span>
        </div>

        <div className="glass-panel rounded-2xl p-5 shadow-sm space-y-2">
          <span className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">Positive Sentiment</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">{sentiment.positive}%</div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center space-x-1 font-medium">
            <Smile className="w-3.5 h-3.5" />
            <span>Audience approval metric</span>
          </span>
        </div>
      </div>

      {/* Sentiment Analysis Bar & Breakdown */}
      <div className="glass-panel rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base">NLP Sentiment Distribution</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Classified across inbound audience responses using HuggingFace / NLTK</p>
          </div>
          <span className="text-[10px] bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-full font-mono">
            {totalEngagement} Sampled Interactions
          </span>
        </div>

        {/* Multi-colored Sentiment Bar */}
        <div className="w-full h-4 bg-slate-200 dark:bg-slate-950 rounded-full overflow-hidden flex border border-slate-200 dark:border-slate-800 shadow-inner">
          <div style={{ width: `${sentiment.positive}%` }} className="bg-emerald-500 h-full transition-all duration-700" title={`Positive: ${sentiment.positive}%`}></div>
          <div style={{ width: `${sentiment.neutral}%` }} className="bg-slate-400 dark:bg-slate-500 h-full transition-all duration-700" title={`Neutral: ${sentiment.neutral}%`}></div>
          <div style={{ width: `${sentiment.negative}%` }} className="bg-rose-500 h-full transition-all duration-700" title={`Negative: ${sentiment.negative}%`}></div>
        </div>

        {/* Legend stats */}
        <div className="grid grid-cols-3 gap-4 pt-2">
          <div className="bg-white dark:bg-slate-950/80 border border-emerald-200 dark:border-emerald-500/30 rounded-2xl p-4 text-center shadow-xs">
            <div className="flex items-center justify-center space-x-1 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase">
              <Smile className="w-4 h-4" />
              <span>Positive</span>
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{sentiment.positive}%</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Warm tone, praise & saves</div>
          </div>

          <div className="bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-center shadow-xs">
            <div className="flex items-center justify-center space-x-1 text-slate-600 dark:text-slate-400 text-xs font-bold uppercase">
              <Meh className="w-4 h-4" />
              <span>Neutral</span>
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{sentiment.neutral}%</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Queries & factual tags</div>
          </div>

          <div className="bg-white dark:bg-slate-950/80 border border-rose-200 dark:border-rose-500/30 rounded-2xl p-4 text-center shadow-xs">
            <div className="flex items-center justify-center space-x-1 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase">
              <Frown className="w-4 h-4" />
              <span>Negative</span>
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{sentiment.negative}%</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Complaints or pushback</div>
          </div>
        </div>
      </div>

      {/* Grid: Feedback Loop Recommendations & Inbound Comments */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Real-time Inbound Comments Stream (6 cols) */}
        <div className="lg:col-span-6 glass-panel rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Inbound Audience Stream</h3>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">Live Ingestion</span>
          </div>

          <div className="space-y-3">
            {topComments.length > 0 ? (
              topComments.map((c) => (
                <div key={c.id} className="bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80 rounded-xl p-3.5 flex items-start justify-between gap-3 text-xs shadow-xs">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900 dark:text-white">{c.user}</span>
                      <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-1.5 py-0.5 rounded font-mono uppercase font-semibold">
                        {c.platform}
                      </span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed">"{c.text}"</p>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase shrink-0 ${
                    c.sentiment === 'positive'
                      ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30'
                      : c.sentiment === 'negative'
                      ? 'bg-rose-50 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-500/30'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                  }`}>
                    {c.sentiment}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-6 text-center">No inbound comments recorded yet.</p>
            )}
          </div>
        </div>

        {/* Closed-Loop AI Optimization Recommendations (6 cols) */}
        <div className="lg:col-span-6 glass-panel rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Closed-Loop Optimization Engine</h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Automated prompt recommendations formulated from live engagement analytics to boost performance in subsequent generation cycles.
          </p>

          <div className="space-y-3">
            {recommendations.map((rec) => (
              <div key={rec.id} className="bg-white dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-xs">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-bold text-slate-900 dark:text-white">{rec.title}</span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-500/20 font-mono">
                      {rec.impact}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{rec.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
                  <span className="text-[10px] text-stone-400 font-mono">Algorithm: Reinforcement Learning Loop</span>
                  <button
                    onClick={() => onApplyRecommendation(rec)}
                    className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-stone-900 hover:bg-black text-white dark:bg-stone-100 dark:hover:bg-white dark:text-stone-900 font-bold text-xs rounded-xl shadow-xs transition active:scale-[0.99] cursor-pointer"
                  >
                    <span>Adopt Recommendation</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
