import React, { useState } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Repeat2, 
  Share2, 
  Bookmark, 
  Music, 
  ThumbsUp, 
  Send, 
  Copy, 
  Check, 
  BarChart2, 
  Sparkles,
  ExternalLink,
  Image as ImageIcon
} from 'lucide-react';

export function TwitterPreview({ content, imageUrl, profile }) {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);

  if (!content) return <EmptyPlatform platform="X / Twitter" />;

  const text = content.text || '';
  const charLimit = 280;
  const charsUsed = text.length;
  const isOver = charsUsed > charLimit;
  const progressPct = Math.min(100, Math.round((charsUsed / charLimit) * 100));

  const handleCopy = () => {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-black text-white p-4 rounded-2xl border border-neutral-800 shadow-2xl relative select-none">
      {/* Top Action Copy Button */}
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 flex items-center space-x-1 px-2 py-1 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded-lg text-[10px] border border-neutral-800 transition"
        title="Copy tweet text"
      >
        {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
        <span>{copied ? 'Copied' : 'Copy'}</span>
      </button>

      {/* Profile Header */}
      <div className="flex items-start space-x-3 pr-16">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-sm text-white shrink-0 shadow-md">
          {profile?.businessName?.[0] || 'A'}
        </div>
        <div className="leading-tight">
          <div className="flex items-center space-x-1">
            <span className="font-bold text-sm text-white hover:underline cursor-pointer">
              {profile?.businessName || 'Business Name'}
            </span>
            <span className="text-sky-400 text-xs" title="Verified">✓</span>
          </div>
          <span className="text-neutral-500 text-xs">
            @{profile?.businessName?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'brand'} · 2m
          </span>
        </div>
      </div>

      {/* Tweet Body */}
      <div className="mt-3 text-sm text-neutral-100 whitespace-pre-wrap leading-relaxed font-normal">
        {text}
      </div>

      {/* Media Attachment */}
      {imageUrl ? (
        <div className="mt-3 rounded-2xl overflow-hidden border border-neutral-800 max-h-64 bg-neutral-900 flex items-center justify-center">
          <img src={imageUrl} alt="Tweet media" className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="mt-3 rounded-2xl overflow-hidden border border-dashed border-pink-500/40 max-h-64">
          <MediaPlaceholder label="No media attached" hint="Image area ready — attach a visual or let the AI agent generate one" />
        </div>
      )}

      {/* Metrics / Progress Bar */}
      <div className="mt-3 pt-2.5 border-t border-neutral-900 flex items-center justify-between text-xs text-neutral-500">
        <span className="text-[11px]">Character Budget</span>
        <div className="flex items-center space-x-2">
          {/* Circular progress meter */}
          <div className="w-5 h-5 relative flex items-center justify-center">
            <svg className="w-5 h-5 transform -rotate-90">
              <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" className="text-neutral-800" fill="transparent" />
              <circle
                cx="10" cy="10" r="8"
                stroke="currentColor" strokeWidth="2"
                strokeDasharray={50}
                strokeDashoffset={50 - (50 * progressPct) / 100}
                className={isOver ? 'text-rose-500' : progressPct > 85 ? 'text-amber-500' : 'text-sky-500'}
                fill="transparent"
              />
            </svg>
          </div>
          <span className={`font-mono text-[11px] font-semibold ${isOver ? 'text-rose-400' : 'text-neutral-400'}`}>
            {charsUsed}/{charLimit}
          </span>
        </div>
      </div>

      {/* Tweet Interaction Bar — pre-publish preview, so no engagement counts are shown */}
      <div className="mt-2 flex items-center justify-between text-neutral-500 text-xs px-2 pt-1">
        <div className="flex items-center space-x-1 hover:text-sky-400 transition cursor-pointer">
          <MessageCircle className="w-4 h-4" />
        </div>
        <div className="flex items-center space-x-1 hover:text-emerald-400 transition cursor-pointer">
          <Repeat2 className="w-4 h-4" />
        </div>
        <div
          onClick={() => setLiked(!liked)}
          className={`flex items-center space-x-1 transition cursor-pointer ${liked ? 'text-rose-500' : 'hover:text-rose-400'}`}
        >
          <Heart className={`w-4 h-4 ${liked ? 'fill-rose-500' : ''}`} />
        </div>
        <div className="flex items-center space-x-1 hover:text-sky-400 transition cursor-pointer">
          <BarChart2 className="w-4 h-4" />
        </div>
        <div className="flex items-center space-x-1 hover:text-sky-400 transition cursor-pointer">
          <Share2 className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}

export function InstagramPreview({ content, imageUrl, profile }) {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);

  if (!content) return <EmptyPlatform platform="Instagram" />;

  const caption = content.caption || '';
  const hashtags = content.hashtags || [];

  const handleCopy = () => {
    navigator.clipboard?.writeText(`${caption}\n\n${hashtags.join(' ')}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-slate-950 text-white rounded-2xl border border-slate-800 shadow-2xl overflow-hidden relative select-none">
      {/* Header */}
      <div className="p-3 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 shadow-sm">
            <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center font-bold text-xs text-white">
              {profile?.businessName?.[0] || 'I'}
            </div>
          </div>
          <div>
            <div className="font-bold text-xs text-white flex items-center space-x-1">
              <span>{profile?.businessName?.toLowerCase().replace(/[^a-z0-9]/g, '_') || 'instagram_feed'}</span>
              <span className="text-sky-400 text-[10px]">●</span>
            </div>
            <div className="text-[10px] text-slate-400">Original audio · Official page</div>
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center space-x-1 px-2 py-1 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg text-[10px] border border-slate-800 transition"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      {/* Main Square Photo */}
      <div 
        onDoubleClick={() => setLiked(true)}
        className="w-full aspect-square bg-slate-900 relative flex items-center justify-center overflow-hidden cursor-pointer group"
      >
        {imageUrl ? (
          <img src={imageUrl} alt="Instagram visual" className="w-full h-full object-cover transition duration-300 group-hover:scale-105" />
        ) : (
          <MediaPlaceholder fill label="Your visual goes here" hint="Square crop — the AI agent can attach the perfect image" />
        )}
      </div>

      {/* Action Bar */}
      <div className="p-3.5 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-white">
            <Heart 
              onClick={() => setLiked(!liked)} 
              className={`w-5 h-5 cursor-pointer transition ${liked ? 'fill-rose-500 text-rose-500 scale-110' : 'hover:text-rose-400'}`} 
            />
            <MessageCircle className="w-5 h-5 cursor-pointer hover:text-slate-400 transition" />
            <Send className="w-5 h-5 cursor-pointer hover:text-slate-400 transition" />
          </div>
          <Bookmark className="w-5 h-5 cursor-pointer hover:text-slate-400 transition" />
        </div>

        {/* Caption (pre-publish preview — no engagement counts shown) */}
        <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
          <span className="font-bold text-white mr-1.5">
            {profile?.businessName?.toLowerCase().replace(/[^a-z0-9]/g, '_') || 'brand'}
          </span>
          {caption}
        </div>

        {/* Hashtags */}
        {hashtags.length > 0 && (
          <div className="text-xs text-sky-400 flex flex-wrap gap-1.5 pt-1">
            {hashtags.map((tag, idx) => (
              <span key={idx} className="hover:underline cursor-pointer">{tag}</span>
            ))}
          </div>
        )}

        <div className="text-[10px] text-slate-500 uppercase tracking-wider pt-1">
          Just now · View all 14 comments
        </div>
      </div>
    </div>
  );
}

export function FacebookPreview({ content, imageUrl, profile }) {
  const [copied, setCopied] = useState(false);

  if (!content) return <EmptyPlatform platform="Facebook" />;

  const handleCopy = () => {
    navigator.clipboard?.writeText(content.text || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-2xl overflow-hidden relative select-none">
      {/* Header */}
      <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-sm shadow">
            {profile?.businessName?.[0] || 'F'}
          </div>
          <div>
            <div className="font-bold text-xs text-white">{profile?.businessName || 'Business Page'}</div>
            <div className="text-[10px] text-slate-400 flex items-center space-x-1">
              <span>Just now · </span>
              <span>🌎 Public</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center space-x-1 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[10px] border border-slate-700 transition"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      {/* Post Text */}
      <div className="p-3.5 text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
        {content.text || ''}
      </div>

      {/* Media Attachment */}
      {imageUrl ? (
        <div className="w-full max-h-72 overflow-hidden bg-slate-950 flex items-center justify-center border-y border-slate-800">
          <img src={imageUrl} alt="Facebook media" className="w-full object-cover" />
        </div>
      ) : (
        <div className="w-full border-y border-dashed border-pink-500/40">
          <MediaPlaceholder label="No media attached" hint="Link or image preview area" />
        </div>
      )}

      {/* Link Call to Action Bar */}
      {content.callToAction && (
        <div className="p-3 bg-slate-800/80 border-b border-slate-800 flex items-center justify-between text-xs">
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Offer & Updates</div>
            <div className="font-semibold text-slate-200">{profile?.businessName || 'Official Website'}</div>
          </div>
          <button className="px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-medium text-xs shadow">
            {content.callToAction}
          </button>
        </div>
      )}

      {/* Action Buttons (pre-publish preview — no engagement counts shown) */}
      <div className="grid grid-cols-3 text-center py-1 text-xs text-slate-300 font-medium">
        <button className="py-2 hover:bg-slate-800/80 flex items-center justify-center space-x-1 transition">
          <ThumbsUp className="w-4 h-4 text-blue-400" />
          <span>Like</span>
        </button>
        <button className="py-2 hover:bg-slate-800/80 flex items-center justify-center space-x-1 transition">
          <MessageCircle className="w-4 h-4" />
          <span>Comment</span>
        </button>
        <button className="py-2 hover:bg-slate-800/80 flex items-center justify-center space-x-1 transition">
          <Share2 className="w-4 h-4" />
          <span>Share</span>
        </button>
      </div>
    </div>
  );
}

export function TikTokPreview({ content, imageUrl, profile }) {
  const [copied, setCopied] = useState(false);

  if (!content) return <EmptyPlatform platform="TikTok" />;

  const handleCopy = () => {
    navigator.clipboard?.writeText(content.caption || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-[280px] mx-auto bg-black text-white rounded-[28px] border-4 border-slate-800 shadow-2xl overflow-hidden relative aspect-[9/16] flex flex-col justify-between select-none">
      {/* Background simulating video */}
      <div className="absolute inset-0 bg-slate-950">
        {imageUrl ? (
          <img src={imageUrl} alt="TikTok background" className="w-full h-full object-cover opacity-85" />
        ) : (
          <MediaPlaceholder fill label="Video frame" hint="Your clip will play here" hintClassName="hidden" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/90"></div>
      </div>

      {/* Top Bar with Copy CTA */}
      <div className="relative z-10 pt-3 px-3 flex items-center justify-between text-xs text-slate-300 font-semibold">
        <button
          onClick={handleCopy}
          className="flex items-center space-x-1 px-2 py-0.5 bg-black/60 hover:bg-black text-[10px] rounded-full border border-white/20 backdrop-blur-md transition"
        >
          {copied ? <Check className="w-2.5 h-2.5 text-emerald-400" /> : <Copy className="w-2.5 h-2.5" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>

        <div className="flex space-x-3 text-xs">
          <span className="opacity-60">Following</span>
          <span className="border-b-2 border-white pb-0.5 text-white font-bold">For You</span>
        </div>
        <div className="w-8"></div>
      </div>

      {/* Floating Right Sidebar */}
      <div className="absolute right-2 bottom-16 z-10 flex flex-col items-center space-y-4">
        {/* Creator profile */}
        <div className="w-9 h-9 rounded-full bg-rose-600 p-0.5 border border-white flex items-center justify-center font-bold text-xs">
          {profile?.businessName?.[0] || 'T'}
        </div>

        {/* Pre-publish preview — no engagement counts shown */}
        <div className="flex flex-col items-center">
          <Heart className="w-7 h-7 text-white fill-white/90" />
        </div>

        <div className="flex flex-col items-center">
          <MessageCircle className="w-7 h-7 text-white fill-white/80" />
        </div>

        <div className="flex flex-col items-center">
          <Bookmark className="w-7 h-7 text-white fill-white/80" />
        </div>

        <div className="flex flex-col items-center">
          <Share2 className="w-7 h-7 text-white" />
          <span className="text-[10px] font-bold mt-0.5">85</span>
        </div>

        {/* Rotating Music Disc */}
        <div className="w-8 h-8 rounded-full bg-slate-900 border-2 border-slate-700 flex items-center justify-center animate-spin-slow shadow-lg">
          <div className="w-3 h-3 rounded-full bg-rose-500"></div>
        </div>
      </div>

      {/* Bottom Text Overlay */}
      <div className="relative z-10 p-3 pr-14 text-left">
        <div className="font-bold text-xs text-white mb-1">
          @{profile?.businessName?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'brand'}
        </div>
        <div className="text-[11px] leading-snug line-clamp-3 text-slate-100 mb-2 font-normal">
          {content.caption || ''}
        </div>
        {content.suggestedSound && (
          <div className="flex items-center space-x-1.5 text-[10px] text-slate-300 bg-black/50 px-2 py-0.5 rounded-full w-fit backdrop-blur-sm border border-white/10">
            <Music className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span className="truncate max-w-[150px]">{content.suggestedSound}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyPlatform({ platform }) {
  return (
    <div className="p-10 text-center text-slate-500 border border-dashed border-slate-800 rounded-2xl bg-slate-900/40">
      <Sparkles className="w-8 h-8 mx-auto mb-2 text-slate-600" />
      <p className="text-sm font-semibold text-slate-300">No output for {platform}</p>
      <p className="text-xs text-slate-500 mt-1">Check {platform} in the target platforms selector on the left.</p>
    </div>
  );
}

/* Blotato-style branded placeholder shown in the platform mockups when a post
   has no image/visual attached yet. */
function MediaPlaceholder({ label, hint, fill = false, hintClassName = '' }) {
  return (
    <div className={`w-full flex items-center justify-center bg-gradient-to-br from-pink-500/15 via-violet-600/10 to-fuchsia-500/15 ${fill ? 'h-full' : ''}`}>
      <div className="flex flex-col items-center justify-center text-center px-6 py-6">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-pink-500 to-violet-600 flex items-center justify-center shadow-lg shadow-pink-500/30 mb-2.5">
          <ImageIcon className="w-5.5 h-5.5 text-white" />
        </div>
        <p className="text-xs font-semibold text-slate-200">{label}</p>
        {hint && (
          <p className={`text-[10px] text-slate-400 mt-1 max-w-[210px] leading-relaxed ${hintClassName}`}>{hint}</p>
        )}
      </div>
    </div>
  );
}
