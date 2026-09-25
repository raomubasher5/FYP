import React, { useState } from 'react';
import { 
  CheckCircle, 
  Clock, 
  Trash2, 
  Play, 
  CheckCheck, 
  Filter, 
  ExternalLink, 
  AlertCircle,
  ThumbsUp,
  MessageCircle,
  Eye,
  Search,
  Check
} from 'lucide-react';

export default function QueueTab({ posts, onApprovePost, onPublishNow, onDeletePost, onNotify }) {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filteredPosts = posts.filter(p => {
    const matchesFilter = filter === 'all' || p.status === filter;
    const matchesSearch = !search.trim() || 
      p.topic.toLowerCase().includes(search.toLowerCase()) || 
      (p.platforms?.instagram?.caption || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.platforms?.twitter?.text || '').toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const draftsCount = posts.filter(p => p.status === 'draft').length;
  const scheduledCount = posts.filter(p => p.status === 'scheduled').length;
  const publishedCount = posts.filter(p => p.status === 'published').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-stone-500 dark:text-stone-400 text-xs font-bold uppercase tracking-wider mb-1 font-mono">
            <CheckCheck className="w-4 h-4 text-stone-700 dark:text-stone-300" />
            <span>Workflow & Pipeline Manager</span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
            Post Queue & Approvals
          </h1>
          <p className="text-stone-500 dark:text-stone-400 text-xs mt-1">
            Approve AI-generated drafts, monitor scheduled dispatches, and track live published metrics.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex bg-stone-100 dark:bg-stone-900 p-1.5 rounded-2xl border border-stone-200 dark:border-stone-800 text-xs font-semibold">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
              filter === 'all' 
                ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-xs' 
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            All ({posts.length})
          </button>
          <button
            onClick={() => setFilter('draft')}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
              filter === 'draft' 
                ? 'bg-amber-600 text-white shadow-xs' 
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            Drafts ({draftsCount})
          </button>
          <button
            onClick={() => setFilter('scheduled')}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
              filter === 'scheduled' 
                ? 'bg-stone-800 text-white dark:bg-stone-200 dark:text-stone-900 shadow-xs' 
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            Scheduled ({scheduledCount})
          </button>
          <button
            onClick={() => setFilter('published')}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
              filter === 'published' 
                ? 'bg-emerald-600 text-white shadow-xs' 
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            Published ({publishedCount})
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-stone-400 absolute left-4 top-3.5" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search queued campaigns by topic, copy or hashtag..."
          className="saas-input w-full rounded-2xl pl-11 pr-4 py-3 text-xs placeholder-stone-400"
        />
      </div>

      {/* Posts Cards List */}
      <div className="space-y-4">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => {
            const isDraft = post.status === 'draft';
            const isScheduled = post.status === 'scheduled';
            const isPublished = post.status === 'published';

            return (
              <div
                key={post.id}
                className="glass-panel glass-panel-hover rounded-2xl p-5 shadow-sm space-y-4"
              >
                {/* Top Status Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200/80 dark:border-stone-800/80 pb-3">
                  <div className="flex items-center space-x-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider flex items-center space-x-1.5 ${
                      isPublished
                        ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30'
                        : isScheduled
                        ? 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700'
                        : 'bg-amber-50 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${isPublished ? 'bg-emerald-500' : isScheduled ? 'bg-stone-600 dark:bg-stone-400' : 'bg-amber-500'}`}></span>
                      <span>{post.status}</span>
                    </span>

                    <span className="text-xs text-stone-500 dark:text-stone-400 font-mono">
                      {post.id}
                    </span>

                    <span className="text-stone-300 dark:text-stone-600 text-xs">•</span>

                    <span className="text-xs text-stone-600 dark:text-stone-400 capitalize font-medium">
                      {post.mode} Mode
                    </span>
                  </div>

                  <div className="text-xs text-stone-500 dark:text-stone-400 flex items-center space-x-1.5 font-mono">
                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                    <span>
                      {isPublished
                        ? `Published: ${new Date(post.publishedAt || post.scheduledTime).toLocaleString()}`
                        : `Scheduled: ${new Date(post.scheduledTime).toLocaleString()}`}
                    </span>
                  </div>
                </div>

                {/* Content preview */}
                <div className="flex flex-col md:flex-row items-start gap-4">
                  {post.imageUrl && (
                    <img
                      src={post.imageUrl}
                      alt="Thumbnail"
                      className="w-24 h-24 rounded-2xl object-cover border border-stone-200 dark:border-stone-800 shrink-0 shadow-sm"
                    />
                  )}

                  <div className="flex-1 space-y-3">
                    <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 tracking-tight">{post.topic}</h3>

                    {/* Platform snippets */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                      {post.platforms?.instagram && (
                        <div className="bg-stone-50 dark:bg-stone-900/80 p-3 rounded-xl border border-stone-200/80 dark:border-stone-800/80">
                          <span className="text-[10px] font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider block mb-1 font-mono">Instagram</span>
                          <p className="text-stone-600 dark:text-stone-300 text-[11px] line-clamp-2 leading-relaxed">{post.platforms.instagram.caption}</p>
                        </div>
                      )}
                      {post.platforms?.twitter && (
                        <div className="bg-stone-50 dark:bg-stone-900/80 p-3 rounded-xl border border-stone-200/80 dark:border-stone-800/80">
                          <span className="text-[10px] font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider block mb-1 font-mono">X / Twitter</span>
                          <p className="text-stone-600 dark:text-stone-300 text-[11px] line-clamp-2 leading-relaxed">{post.platforms.twitter.text}</p>
                        </div>
                      )}
                      {post.platforms?.facebook && (
                        <div className="bg-stone-50 dark:bg-stone-900/80 p-3 rounded-xl border border-stone-200/80 dark:border-stone-800/80">
                          <span className="text-[10px] font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider block mb-1 font-mono">Facebook</span>
                          <p className="text-stone-600 dark:text-stone-300 text-[11px] line-clamp-2 leading-relaxed">{post.platforms.facebook.text}</p>
                        </div>
                      )}
                      {post.platforms?.tiktok && (
                        <div className="bg-stone-50 dark:bg-stone-900/80 p-3 rounded-xl border border-stone-200/80 dark:border-stone-800/80">
                          <span className="text-[10px] font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider block mb-1 font-mono">TikTok</span>
                          <p className="text-stone-600 dark:text-stone-300 text-[11px] line-clamp-2 leading-relaxed">{post.platforms.tiktok.caption}</p>
                        </div>
                      )}
                    </div>

                    {/* Live Metrics if published */}
                    {isPublished && post.metrics && (
                      <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-stone-600 dark:text-stone-300 border-t border-stone-200/80 dark:border-stone-800/60 font-mono">
                        <span className="flex items-center space-x-1.5 text-stone-800 dark:text-stone-200 font-semibold">
                          <ThumbsUp className="w-3.5 h-3.5 text-stone-500" />
                          <span>{post.metrics.likes} Likes</span>
                        </span>
                        <span className="flex items-center space-x-1.5 text-stone-800 dark:text-stone-200 font-semibold">
                          <MessageCircle className="w-3.5 h-3.5 text-stone-500" />
                          <span>{post.metrics.comments} Comments</span>
                        </span>
                        <span className="flex items-center space-x-1.5 text-stone-800 dark:text-stone-200 font-semibold">
                          <Eye className="w-3.5 h-3.5 text-stone-500" />
                          <span>{post.metrics.reach} Reach</span>
                        </span>
                        {post.sentiment && (
                          <span className="text-[10px] bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-500/20 font-bold">
                            {post.sentiment.positive}% Positive Sentiment
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="pt-3 flex flex-wrap items-center justify-between border-t border-stone-200/80 dark:border-stone-800/80 gap-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] text-stone-400 dark:text-stone-500 font-semibold uppercase">Channels:</span>
                    {post.targetPlatforms?.map(p => (
                      <span key={p} className="text-[10px] bg-stone-100 dark:bg-stone-900 text-stone-700 dark:text-stone-300 px-2 py-0.5 rounded-md border border-stone-200 dark:border-stone-800 uppercase font-mono font-bold">
                        {p}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center space-x-2">
                    {isDraft && (
                      <button
                        onClick={() => onApprovePost(post.id)}
                        className="flex items-center space-x-1.5 px-4 py-2 bg-stone-900 hover:bg-black text-white dark:bg-stone-100 dark:hover:bg-white dark:text-stone-900 font-bold text-xs rounded-xl shadow-xs transition cursor-pointer active:scale-[0.99]"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve Post</span>
                      </button>
                    )}

                    {isScheduled && (
                      <button
                        onClick={() => onPublishNow(post.id)}
                        className="flex items-center space-x-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
                        title="Simulate immediate publishing for FYP demonstration"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>Publish Now (Demo)</span>
                      </button>
                    )}

                    <button
                      onClick={() => onDeletePost(post.id)}
                      className="p-2 text-stone-400 hover:text-rose-600 hover:bg-stone-100 dark:hover:bg-stone-800/60 rounded-xl transition cursor-pointer"
                      title="Delete post"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-14 text-center glass-panel rounded-3xl border border-dashed border-stone-300 dark:border-stone-800">
            <CheckCheck className="w-10 h-10 text-stone-400 dark:text-stone-500 mx-auto mb-2" />
            <p className="text-sm font-bold text-stone-800 dark:text-stone-200">No campaigns found</p>
            <p className="text-xs text-stone-500 mt-1">Try another search filter or generate content in AI Studio.</p>
          </div>
        )}
      </div>
    </div>
  );
}
