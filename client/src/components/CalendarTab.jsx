import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  Play, 
  Plus
} from 'lucide-react';

export default function CalendarTab({ posts, profile, onPublishNow, setActiveTab }) {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedPost, setSelectedPost] = useState(null);

  const filteredPosts = posts.filter(p => {
    if (selectedFilter === 'all') return true;
    return p.targetPlatforms?.includes(selectedFilter);
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    return new Date(a.scheduledTime || a.createdAt) - new Date(b.scheduledTime || b.createdAt);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-stone-500 dark:text-stone-400 text-xs font-bold uppercase tracking-wider mb-1 font-mono">
            <CalendarIcon className="w-4 h-4 text-stone-700 dark:text-stone-300" />
            <span>Schedule & Publishing Planner</span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">Content Calendar</h1>
          <p className="text-stone-500 dark:text-stone-400 text-xs mt-1">
            Visual overview of upcoming dispatches, automated posting slots, and queued media.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="saas-input rounded-xl px-3.5 py-2 text-xs font-semibold cursor-pointer"
          >
            <option value="all">All Channels</option>
            <option value="instagram">Instagram</option>
            <option value="twitter">X / Twitter</option>
            <option value="facebook">Facebook</option>
            <option value="tiktok">TikTok</option>
          </select>

          <button
            onClick={() => setActiveTab('studio')}
            className="flex items-center space-x-1.5 px-4 py-2 blotato-cta font-bold text-xs rounded-xl shadow-xs transition active:scale-[0.99] cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Post</span>
          </button>
        </div>
      </div>

      {/* Calendar Timeline Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Posts Timeline List (8 cols) */}
        <div className="lg:col-span-8 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
            <span className="font-semibold">Showing {sortedPosts.length} posts in schedule</span>
            <div className="flex items-center space-x-3 text-[11px] font-medium">
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <span>Draft</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <span>Scheduled</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Published</span>
              </span>
            </div>
          </div>

          {sortedPosts.length > 0 ? (
            sortedPosts.map((post) => {
              const isPublished = post.status === 'published';
              const isScheduled = post.status === 'scheduled';
              const isDraft = post.status === 'draft';
              const postDate = new Date(post.scheduledTime || post.createdAt);

              return (
                <div
                  key={post.id}
                  onClick={() => setSelectedPost(post)}
                  className={`glass-panel glass-panel-hover rounded-2xl p-4 transition cursor-pointer ${
                    selectedPost?.id === post.id ? 'glass-card-active' : ''
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start space-x-3.5">
                      {post.imageUrl && (
                        <img
                          src={post.imageUrl}
                          alt="Thumbnail"
                          className="w-14 h-14 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0 shadow-md"
                        />
                      )}
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                            isPublished
                              ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30'
                              : isScheduled
                              ? 'bg-blue-50 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30'
                              : 'bg-amber-50 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30'
                          }`}>
                            {post.status}
                          </span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium font-mono">
                            {postDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })} at {postDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1">{post.topic}</h3>
                        <div className="flex items-center space-x-1.5 mt-2">
                          {post.targetPlatforms?.map(p => (
                            <span key={p} className="text-[10px] bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-800 uppercase font-bold">
                              {p}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-end justify-between sm:justify-center space-y-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200 dark:border-slate-800">
                      {isScheduled && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onPublishNow(post.id);
                          }}
                          className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow transition"
                          title="Publish immediately in sandbox simulation mode — no live platform calls"
                        >
                          <Play className="w-3 h-3" />
                          <span>Publish Now</span>
                        </button>
                      )}
                      {isPublished && post.metrics && (
                        <div className="text-right text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">{post.metrics.likes} likes</span> · {post.metrics.comments} comments
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-12 text-center glass-panel rounded-3xl border border-dashed border-slate-300 dark:border-slate-800">
              <CalendarIcon className="w-8 h-8 text-slate-400 dark:text-slate-500 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No scheduled posts match this filter</p>
            </div>
          )}
        </div>

        {/* Right Drawer Inspector (4 cols) */}
        <div className="lg:col-span-4">
          {selectedPost ? (
            <div className="glass-panel rounded-3xl p-5 shadow-sm space-y-4 sticky top-24">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">Post Inspector</h3>
                <span className="text-xs bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-800 capitalize font-mono">
                  {selectedPost.mode} mode
                </span>
              </div>

              {selectedPost.imageUrl && (
                <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-black shadow-md">
                  <img src={selectedPost.imageUrl} alt="Post media" className="w-full max-h-48 object-cover" />
                </div>
              )}

              <div>
                <div className="text-[11px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-wider">Campaign Focus</div>
                <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{selectedPost.topic}</div>
              </div>

              <div>
                <div className="text-[11px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-wider">Scheduled Time</div>
                <div className="text-xs text-slate-700 dark:text-slate-200 font-mono mt-0.5">
                  {new Date(selectedPost.scheduledTime).toLocaleString()}
                </div>
              </div>

              {/* Platform snippets */}
              <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <div className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Platform Variations:</div>
                {selectedPost.platforms?.twitter && (
                  <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                    <span className="font-bold text-blue-600 dark:text-blue-400 block mb-1">X / Twitter</span>
                    <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">{selectedPost.platforms.twitter.text}</p>
                  </div>
                )}
                {selectedPost.platforms?.instagram && (
                  <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                    <span className="font-bold text-pink-600 dark:text-pink-400 block mb-1">Instagram</span>
                    <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">{selectedPost.platforms.instagram.caption}</p>
                  </div>
                )}
              </div>

              {selectedPost.status === 'scheduled' && (
                <button
                  onClick={() => onPublishNow(selectedPost.id)}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center space-x-1.5"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Execute Publish Immediately (Sandbox)</span>
                </button>
              )}
            </div>
          ) : (
            <div className="p-10 text-center glass-panel rounded-3xl text-slate-400 text-xs">
              <Eye className="w-6 h-6 mx-auto mb-2 text-slate-400 dark:text-slate-500" />
              <span>Select any post from the timeline to inspect content and trigger execution.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
