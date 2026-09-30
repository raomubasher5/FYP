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
  AlertCircle,
  BrainCircuit,
  ArrowUpRight,
  Send
} from 'lucide-react';

const PLATFORMS = ['instagram', 'twitter', 'facebook', 'tiktok', 'linkedin'];

export default function AnalyticsTab({ analytics, onAddComment, onNotify }) {
  const [commentForm, setCommentForm] = useState({ author: '', text: '', platform: 'instagram' });
  const [importing, setImporting] = useState(false);

  const overview = analytics?.overview || {};
  const sentiment = analytics?.sentiment; // null until real comments exist
  const comments = analytics?.comments || [];
  const recommendations = analytics?.recommendations || [];

  const totalEngagement = overview.totalEngagement ?? 0;
  const avgRate = overview.avgEngagementRate;

  const handleImportComment = async (e) => {
    e.preventDefault();
    if (!commentForm.text.trim()) {
      onNotify('Paste the actual comment text first.', 'error');
      return;
    }
    setImporting(true);
    try {
      await onAddComment(commentForm);
      setCommentForm({ author: '', text: '', platform: 'instagram' });
    } catch (err) {
      onNotify('Failed to import comment: ' + err.message, 'error');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-stone-500 dark:text-stone-400 text-xs font-bold uppercase tracking-wider mb-1 font-mono">
            <BarChart3 className="w-4 h-4 text-stone-700 dark:text-stone-300" />
            <span>Workspace Intelligence</span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
            Analytics & Sentiment Insights
          </h1>
          <p className="text-stone-500 dark:text-stone-400 text-xs mt-1">
            Every number here comes from real data stored in your workspace — nothing is simulated.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 px-3 py-1.5 rounded-xl text-stone-600 dark:text-stone-300 text-xs font-mono font-semibold">
          <BrainCircuit className="w-4 h-4" />
          <span>Provider: {analytics?.sentimentProvider || '—'}</span>
        </div>
      </div>

      {/* KPI Cards — real aggregates from MongoDB */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel rounded-2xl p-5 shadow-sm space-y-2">
          <span className="text-stone-500 dark:text-stone-400 text-xs font-semibold uppercase tracking-wider">Total Dispatches</span>
          <div className="text-2xl font-black text-stone-900 dark:text-white tracking-tight">{overview.totalPosts ?? 0}</div>
          <span className="text-[11px] text-stone-500 dark:text-stone-400 flex items-center space-x-1 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{overview.publishedCount ?? 0} published · {overview.scheduledCount ?? 0} scheduled · {overview.draftCount ?? 0} drafts</span>
          </span>
        </div>

        <div className="glass-panel rounded-2xl p-5 shadow-sm space-y-2">
          <span className="text-stone-500 dark:text-stone-400 text-xs font-semibold uppercase tracking-wider">Recorded Interactions</span>
          <div className="text-2xl font-black text-stone-900 dark:text-stone-100 tracking-tight">{totalEngagement.toLocaleString()}</div>
          <span className="text-[11px] text-stone-500 dark:text-stone-400 flex items-center space-x-1 font-medium">
            <Share2 className="w-3.5 h-3.5" />
            <span>{overview.totalLikes ?? 0} likes · {overview.totalComments ?? 0} comments · {overview.totalShares ?? 0} shares</span>
          </span>
        </div>

        <div className="glass-panel rounded-2xl p-5 shadow-sm space-y-2">
          <span className="text-stone-500 dark:text-stone-400 text-xs font-semibold uppercase tracking-wider">Engagement Rate</span>
          <div className="text-2xl font-black text-cyan-600 dark:text-cyan-400 tracking-tight">
            {avgRate !== null && avgRate !== undefined ? `${avgRate}%` : '—'}
          </div>
          <span className="text-[11px] text-stone-500 dark:text-stone-400 flex items-center space-x-1 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>{overview.totalReach > 0 ? `${overview.totalReach.toLocaleString()} total recorded reach` : 'No recorded reach yet'}</span>
          </span>
        </div>

        <div className="glass-panel rounded-2xl p-5 shadow-sm space-y-2">
          <span className="text-stone-500 dark:text-stone-400 text-xs font-semibold uppercase tracking-wider">Positive Sentiment</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
            {sentiment ? `${sentiment.positive}%` : '—'}
          </div>
          <span className="text-[11px] text-emerald-700 dark:text-emerald-400 flex items-center space-x-1 font-medium">
            <Smile className="w-3.5 h-3.5" />
            <span>{sentiment ? `across ${comments.length} imported comment(s)` : 'Import real comments below'}</span>
          </span>
        </div>
      </div>

      {/* Sentiment Analysis */}
      <div className="glass-panel rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-stone-900 dark:text-stone-100 text-base">Sentiment Distribution</h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Classified by the active AI provider ({analytics?.sentimentProvider || 'not configured'}) from comments you imported
            </p>
          </div>
          {sentiment && (
            <span className="text-[10px] bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 px-2 py-0.5 rounded-full font-mono">
              {comments.length} comments analyzed
            </span>
          )}
        </div>

        {sentiment ? (
          <>
            {/* Sentiment Bar */}
            <div className="w-full h-4 bg-stone-200 dark:bg-stone-950 rounded-full overflow-hidden flex border border-stone-200 dark:border-stone-800 shadow-inner">
              <div style={{ width: `${sentiment.positive}%` }} className="bg-emerald-500 h-full transition-all duration-700" title={`Positive: ${sentiment.positive}%`}></div>
              <div style={{ width: `${sentiment.neutral}%` }} className="bg-stone-400 dark:bg-stone-500 h-full transition-all duration-700" title={`Neutral: ${sentiment.neutral}%`}></div>
              <div style={{ width: `${sentiment.negative}%` }} className="bg-rose-500 h-full transition-all duration-700" title={`Negative: ${sentiment.negative}%`}></div>
            </div>

            {/* Legend stats */}
            <div className="grid grid-cols-3 gap-4 pt-2">
              <div className="bg-white dark:bg-stone-950/80 border border-emerald-200 dark:border-emerald-500/30 rounded-2xl p-4 text-center shadow-xs">
                <div className="flex items-center justify-center space-x-1 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase">
                  <Smile className="w-4 h-4" />
                  <span>Positive</span>
                </div>
                <div className="text-2xl font-black text-stone-900 dark:text-white mt-1">{sentiment.positive}%</div>
                <div className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5">Praise & warm feedback</div>
              </div>

              <div className="bg-white dark:bg-stone-950/80 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 text-center shadow-xs">
                <div className="flex items-center justify-center space-x-1 text-stone-600 dark:text-stone-400 text-xs font-bold uppercase">
                  <Meh className="w-4 h-4" />
                  <span>Neutral</span>
                </div>
                <div className="text-2xl font-black text-stone-900 dark:text-white mt-1">{sentiment.neutral}%</div>
                <div className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5">Queries & factual</div>
              </div>

              <div className="bg-white dark:bg-stone-950/80 border border-rose-200 dark:border-rose-500/30 rounded-2xl p-4 text-center shadow-xs">
                <div className="flex items-center justify-center space-x-1 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase">
                  <Frown className="w-4 h-4" />
                  <span>Negative</span>
                </div>
                <div className="text-2xl font-black text-stone-900 dark:text-white mt-1">{sentiment.negative}%</div>
                <div className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5">Complaints or pushback</div>
              </div>
            </div>
          </>
        ) : (
          <div className="p-8 text-center bg-stone-50 dark:bg-stone-900/40 rounded-2xl border border-dashed border-stone-200 dark:border-stone-800">
            <BrainCircuit className="w-8 h-8 text-stone-400 dark:text-stone-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-stone-800 dark:text-stone-300">No comments imported yet</p>
            <p className="text-xs text-stone-500 mt-1 max-w-md mx-auto">
              Sentiment is computed from real audience comments you copy from your platforms. Use the form below to import your first one.
            </p>
          </div>
        )}
      </div>

      {/* Grid: Inbound Comments & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Inbound Comments (real, imported by the user) */}
        <div className="lg:col-span-6 glass-panel rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <h3 className="font-extrabold text-stone-900 dark:text-stone-100 text-base">Imported Audience Comments</h3>
            </div>
            <span className="text-[11px] text-stone-500 font-mono">{comments.length} total</span>
          </div>

          {/* Import form — paste real comments from your platforms */}
          <form onSubmit={handleImportComment} className="bg-stone-50 dark:bg-stone-900/80 rounded-2xl p-4 border border-stone-200/80 dark:border-stone-800/80 space-y-2.5">
            <div className="flex flex-col sm:flex-row gap-2.5">
              <input
                type="text"
                value={commentForm.author}
                onChange={(e) => setCommentForm({ ...commentForm, author: e.target.value })}
                placeholder="Author handle (e.g. @sarah_b)"
                className="saas-input flex-1 rounded-xl px-3 py-2 text-xs"
              />
              <select
                value={commentForm.platform}
                onChange={(e) => setCommentForm({ ...commentForm, platform: e.target.value })}
                className="saas-input rounded-xl px-3 py-2 text-xs"
              >
                {PLATFORMS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <textarea
              value={commentForm.text}
              onChange={(e) => setCommentForm({ ...commentForm, text: e.target.value })}
              placeholder='Paste the actual comment text, e.g. "Loved the new menu item, will be back!"'
              rows={2}
              className="saas-input w-full rounded-xl px-3 py-2 text-xs resize-none"
            />
            <button
              type="submit"
              disabled={importing}
              className="flex items-center space-x-1.5 px-4 py-2 blotato-cta font-bold text-xs rounded-xl shadow-xs transition cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{importing ? 'Importing…' : 'Import for Sentiment Analysis'}</span>
            </button>
          </form>

          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {comments.length > 0 ? (
              comments.map((c) => (
                <div key={c.id} className="bg-white dark:bg-stone-950/80 border border-stone-200 dark:border-stone-800/80 rounded-xl p-3.5 flex items-start justify-between gap-3 text-xs shadow-xs">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-stone-900 dark:text-white">{c.author}</span>
                      <span className="text-[10px] bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 px-1.5 py-0.5 rounded font-mono uppercase font-semibold">
                        {c.platform}
                      </span>
                    </div>
                    <p className="text-stone-700 dark:text-stone-300 text-xs leading-relaxed">"{c.text}"</p>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase shrink-0 ${
                    c.sentiment === 'Positive'
                      ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30'
                      : c.sentiment === 'Negative'
                      ? 'bg-rose-50 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-500/30'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700'
                  }`}>
                    {c.sentiment || 'pending'}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-stone-400 py-6 text-center">No comments imported yet.</p>
            )}
          </div>
        </div>

        {/* Recommendations — computed from real post data */}
        <div className="lg:col-span-6 glass-panel rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h3 className="font-extrabold text-stone-900 dark:text-stone-100 text-base">Data-Driven Recommendations</h3>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Computed from your real published posts and their recorded metrics. No invented statistics.
          </p>

          <div className="space-y-3">
            {recommendations.length > 0 ? (
              recommendations.map((rec) => (
                <div key={rec.id} className="bg-white dark:bg-stone-950/90 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 flex flex-col justify-between shadow-xs">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-bold text-stone-900 dark:text-white">{rec.title}</span>
                      <span className="text-[10px] text-stone-500 dark:text-stone-400 font-bold bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-md border border-stone-200 dark:border-stone-700 font-mono uppercase">
                        {rec.type}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">{rec.message}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
                    <span className="text-[10px] text-stone-400 font-mono">Derived from workspace data</span>
                    <span className="text-[10px] text-stone-600 dark:text-stone-300 font-semibold">{rec.action}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center bg-stone-50 dark:bg-stone-900/40 rounded-2xl border border-dashed border-stone-200 dark:border-stone-800">
                <AlertCircle className="w-8 h-8 text-stone-400 dark:text-stone-500 mx-auto mb-2" />
                <p className="text-sm font-semibold text-stone-800 dark:text-stone-300">No insights yet</p>
                <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
                  Publish posts and record real engagement data — recommendations appear automatically once your workspace has metrics to learn from.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
