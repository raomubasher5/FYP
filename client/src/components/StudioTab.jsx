import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Clock, 
  CheckCircle, 
  Sliders, 
  Layers, 
  Image as ImageIcon, 
  Copy, 
  ExternalLink,
  ChevronDown,
  RefreshCw,
  Eye,
  Check,
  AlertCircle
} from 'lucide-react';
import { TwitterPreview, InstagramPreview, FacebookPreview, TikTokPreview } from './SocialPreviews';

export default function StudioTab({ profile, onGeneratePost, onSchedulePost, onNotify }) {
  const [topic, setTopic] = useState('');
  const [targetPlatforms, setTargetPlatforms] = useState(['twitter', 'instagram', 'facebook', 'tiktok']);
  const [tone, setTone] = useState(profile?.brandTone || 'Warm & Welcoming');
  const [mode, setMode] = useState(profile?.defaultMode || 'review');
  const [scheduledDate, setScheduledDate] = useState(() => {
    const d = new Date();
    d.setHours(d.getHours() + 2);
    return d.toISOString().slice(0, 16);
  });

  const [loading, setLoading] = useState(false);
  const [generatedData, setGeneratedData] = useState(null);
  const [activePlatformTab, setActivePlatformTab] = useState('instagram');
  const [editableContent, setEditableContent] = useState({});

  const sampleIdeas = [
    `Announce a new product or service`,
    `Behind the scenes: your team at work`,
    `Share a customer success story`,
    `Promote a limited-time offer`
  ];

  const handleTogglePlatform = (p) => {
    if (targetPlatforms.includes(p)) {
      if (targetPlatforms.length === 1) {
        onNotify('Please keep at least one target channel selected.', 'warning');
        return;
      }
      setTargetPlatforms(targetPlatforms.filter(item => item !== p));
    } else {
      setTargetPlatforms([...targetPlatforms, p]);
    }
  };

  const handleGenerate = async () => {
    if (!topic.trim()) {
      onNotify('Please enter a campaign topic or select one of the suggested prompts.', 'warning');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        topic: topic.trim(),
        targetPlatforms,
        tone,
        mode,
        scheduledTime: new Date(scheduledDate).toISOString(),
        profile
      };

      const result = await onGeneratePost(payload);
      setGeneratedData(result);
      setEditableContent(result.platforms || {});
      setActivePlatformTab(targetPlatforms[0] || 'instagram');
      onNotify('AI Campaign generated tailored variations across all chosen channels!', 'success');
    } catch (err) {
      onNotify('Generation failed: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveOrSchedule = async (directPublish = false) => {
    if (!generatedData) return;

    try {
      const finalPost = {
        ...generatedData,
        platforms: editableContent,
        mode,
        scheduledTime: new Date(scheduledDate).toISOString()
      };

      await onSchedulePost(finalPost, directPublish);
      onNotify(
        directPublish 
          ? 'Post published live immediately across active channels!' 
          : mode === 'auto' 
          ? 'Post approved and added directly to dispatch schedule.' 
          : 'Post saved to approval queue as a review draft.',
        'success'
      );

      // Reset
      setGeneratedData(null);
      setTopic('');
    } catch (err) {
      onNotify('Failed to schedule post: ' + err.message, 'error');
    }
  };

  const setTimeOffset = (hours) => {
    const d = new Date();
    d.setHours(d.getHours() + hours);
    setScheduledDate(d.toISOString().slice(0, 16));
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Info */}
      <div className="glass-panel rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-stone-500 dark:text-stone-400 text-xs font-bold uppercase tracking-wider mb-1 font-mono">
            <Sparkles className="w-4 h-4 text-stone-700 dark:text-stone-300" />
            <span>AI Content Studio & Adaptive Engine</span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
            Multi-Platform Campaign Generator
          </h1>
          <p className="text-stone-500 dark:text-stone-400 text-xs mt-1">
            Produce channel-tailored copy, hashtags, and visual prompts aligned with brand voice.
          </p>
        </div>

        <div className="bg-stone-50 dark:bg-stone-900/90 border border-stone-200 dark:border-stone-800 p-3 rounded-2xl flex items-center space-x-4 text-xs shrink-0">
          <div>
            <div className="text-stone-400 text-[10px] uppercase font-bold font-mono">Brand Voice</div>
            <div className="text-stone-900 dark:text-stone-100 font-semibold">{tone}</div>
          </div>
          <div className="w-px h-8 bg-stone-200 dark:border-stone-800"></div>
          <div>
            <div className="text-stone-400 text-[10px] uppercase font-bold font-mono">Architecture</div>
            <div className="text-stone-900 dark:text-stone-100 font-semibold">Decoupled Strategy</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Generator Form (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="glass-panel rounded-3xl p-6 shadow-sm space-y-5">
            <h2 className="text-xs font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider flex items-center space-x-2 font-mono">
              <Sliders className="w-4 h-4 text-stone-700 dark:text-stone-300" />
              <span>Prompt & Parameters</span>
            </h2>

            {/* Campaign Topic / Brief */}
            <div>
              <label className="block text-xs font-bold text-stone-800 dark:text-stone-200 mb-1.5">
                What are you announcing or promoting?
              </label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Special weekend promotion on our hand-poured single origin espresso and freshly baked butter croissants..."
                rows={3}
                className="saas-input w-full rounded-2xl p-3.5 text-xs placeholder-stone-400 leading-relaxed font-normal"
              />

              {/* Sample Topic Chips */}
              <div className="mt-2.5">
                <span className="text-[10px] text-stone-400 font-semibold block mb-1.5 uppercase tracking-wider font-mono">
                  One-Click Topic Suggestions:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {sampleIdeas.map((idea, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setTopic(idea)}
                      className="text-[11px] bg-stone-100 hover:bg-stone-200 dark:bg-stone-800/80 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 px-2.5 py-1 rounded-xl border border-stone-200 dark:border-stone-700 transition text-left flex items-center space-x-1 shadow-2xs"
                    >
                      <Sparkles className="w-3 h-3 text-stone-500" />
                      <span className="truncate max-w-[210px]">{idea}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Target Platforms Toggle */}
            <div>
              <label className="block text-xs font-bold text-stone-800 dark:text-stone-200 mb-1.5">
                Target Channels:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'instagram', label: 'Instagram', tag: 'IG' },
                  { id: 'twitter', label: 'X / Twitter', tag: '𝕏' },
                  { id: 'facebook', label: 'Facebook', tag: 'FB' },
                  { id: 'tiktok', label: 'TikTok', tag: 'TT' }
                ].map(p => {
                  const isChecked = targetPlatforms.includes(p.id);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleTogglePlatform(p.id)}
                      className={`flex items-center justify-between p-3 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                        isChecked 
                          ? 'bg-gradient-to-tr from-pink-500 to-violet-600 text-white border-transparent shadow-xs' 
                          : 'bg-white dark:bg-stone-900/40 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-stone-400 dark:hover:border-stone-700'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-[10px] opacity-75">{p.tag}</span>
                        <span>{p.label}</span>
                      </div>
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                        isChecked 
                          ? 'bg-stone-800 text-white dark:bg-stone-200 dark:text-stone-900 font-bold' 
                          : 'border border-stone-300 dark:border-stone-700'
                      }`}>
                        {isChecked && '✓'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tone Selector */}
            <div>
              <label className="block text-xs font-bold text-stone-800 dark:text-stone-200 mb-1.5">
                Brand Tone:
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { label: 'Warm & Welcoming', emoji: '☕' },
                  { label: 'Professional & Sleek', emoji: '💼' },
                  { label: 'Bold & Energetic', emoji: '⚡' },
                  { label: 'Playful & Witty', emoji: '🎭' }
                ].map((t) => (
                  <button
                    key={t.label}
                    type="button"
                    onClick={() => setTone(t.label)}
                    className={`p-2.5 rounded-xl text-[11px] font-medium border text-left transition flex items-center space-x-1.5 cursor-pointer ${
                      tone === t.label
                        ? 'bg-gradient-to-tr from-pink-500 to-violet-600 text-white border-transparent font-bold shadow-xs'
                        : 'bg-white dark:bg-stone-900/40 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-stone-400 dark:hover:border-stone-700'
                    }`}
                  >
                    <span>{t.emoji}</span>
                    <span>{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Working Mode Radio */}
            <div>
              <label className="block text-xs font-bold text-stone-800 dark:text-stone-200 mb-1.5">
                Automation Pipeline Mode:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <label className={`p-3 rounded-xl border cursor-pointer text-xs flex flex-col justify-between transition ${
                  mode === 'review'
                    ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-600 dark:border-amber-500/60 text-amber-950 dark:text-amber-200 ring-1 ring-amber-600/20'
                    : 'bg-white dark:bg-stone-900/40 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-stone-400'
                }`}>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      name="mode" 
                      checked={mode === 'review'} 
                      onChange={() => setMode('review')} 
                      className="accent-amber-600 cursor-pointer" 
                    />
                    <span className="font-bold text-xs">Review Mode</span>
                  </div>
                  <span className="text-[10px] text-stone-500 dark:text-stone-400 mt-1">Requires manual approval before scheduling.</span>
                </label>

                <label className={`p-3 rounded-xl border cursor-pointer text-xs flex flex-col justify-between transition ${
                  mode === 'auto'
                    ? 'bg-gradient-to-tr from-pink-500 to-violet-600 text-white border-transparent shadow-xs'
                    : 'bg-white dark:bg-stone-900/40 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-stone-400'
                }`}>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      name="mode" 
                      checked={mode === 'auto'} 
                      onChange={() => setMode('auto')} 
                      className="accent-stone-900 dark:accent-stone-100 cursor-pointer" 
                    />
                    <span className="font-bold text-xs">Auto-Pilot Mode</span>
                  </div>
                  <span className={`text-[10px] mt-1 ${mode === 'auto' ? 'text-stone-300 dark:text-stone-600' : 'text-stone-500 dark:text-stone-400'}`}>
                    Directly schedules & publishes automatically.
                  </span>
                </label>
              </div>
            </div>

            {/* Scheduled Date/Time with quick buttons */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-stone-700 dark:text-stone-300" />
                  <span>Scheduled Dispatch Time:</span>
                </label>
                <div className="flex items-center space-x-1 text-[10px]">
                  <button 
                    type="button" 
                    onClick={() => setTimeOffset(1)} 
                    className="px-2 py-0.5 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded border border-stone-200 dark:border-stone-700 font-mono cursor-pointer"
                  >
                    +1h
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setTimeOffset(3)} 
                    className="px-2 py-0.5 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded border border-stone-200 dark:border-stone-700 font-mono cursor-pointer"
                  >
                    +3h
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setTimeOffset(24)} 
                    className="px-2 py-0.5 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded border border-stone-200 dark:border-stone-700 font-mono cursor-pointer"
                  >
                    Tomorrow
                  </button>
                </div>
              </div>
              <input
                type="datetime-local"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="saas-input w-full rounded-xl p-3 text-xs font-mono"
              />
            </div>

            {/* Generate Action Button */}
            <button
              type="button"
              onClick={handleGenerate}
              disabled={loading}
              className="w-full py-3.5 blotato-cta font-bold text-xs rounded-2xl transition transform active:scale-[0.99] flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>AI Agent is Crafting Variations...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Multi-Platform Post with AI</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Output Previews & Customizer (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {generatedData ? (
            <div className="glass-panel rounded-3xl p-6 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-200/80 dark:border-stone-800 pb-4 gap-3">
                <div>
                  <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center space-x-2">
                    <Eye className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>AI Generated Multi-Platform Output</span>
                  </h2>
                  <span className="text-[11px] text-stone-500 dark:text-stone-400">
                    Topic: "{generatedData.coreTopic}"
                  </span>
                </div>

                {/* Platform Switcher Tabs */}
                <div className="flex bg-stone-100 dark:bg-stone-900 p-1 rounded-xl border border-stone-200 dark:border-stone-800">
                  {targetPlatforms.map(p => (
                    <button
                      key={p}
                      onClick={() => setActivePlatformTab(p)}
                      className={`px-3 py-1.5 text-xs rounded-lg font-bold capitalize transition cursor-pointer ${
                        activePlatformTab === p
                          ? 'bg-pink-500 text-white shadow-xs'
                          : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                      }`}
                    >
                      {p === 'twitter' ? 'X / Twitter' : p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Media Prompt Card */}
              <div className="bg-stone-50 dark:bg-stone-900/80 rounded-2xl p-4 border border-stone-200/80 dark:border-stone-800 flex items-start space-x-3.5">
                <img 
                  src={generatedData.imageUrl} 
                  alt="AI Product Thumbnail" 
                  className="w-20 h-20 rounded-xl object-cover border border-stone-200 dark:border-stone-700 shrink-0 shadow-md" 
                />
                <div className="text-xs">
                  <div className="flex items-center space-x-1.5 text-stone-900 dark:text-stone-100 font-bold mb-1">
                    <ImageIcon className="w-3.5 h-3.5 text-stone-600 dark:text-stone-400" />
                    <span>AI Generated Visual Prompt</span>
                  </div>
                  <p className="text-stone-700 dark:text-stone-300 text-[11px] leading-relaxed italic font-serif">
                    "{generatedData.imagePrompt}"
                  </p>
                </div>
              </div>

              {/* Editable Text Area for current platform */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-800 dark:text-stone-200 capitalize">
                    Fine-tune {activePlatformTab} Copy & Hashtags:
                  </span>
                  <span className="text-[10px] text-stone-400 font-mono">Real-time sync to live preview</span>
                </div>

                {activePlatformTab === 'twitter' && (
                  <textarea
                    value={editableContent.twitter?.text || ''}
                    onChange={(e) => setEditableContent({
                      ...editableContent,
                      twitter: { ...editableContent.twitter, text: e.target.value }
                    })}
                    rows={3}
                    className="saas-input w-full rounded-xl p-3 text-xs font-mono leading-relaxed"
                  />
                )}

                {activePlatformTab === 'instagram' && (
                  <textarea
                    value={editableContent.instagram?.caption || ''}
                    onChange={(e) => setEditableContent({
                      ...editableContent,
                      instagram: { ...editableContent.instagram, caption: e.target.value }
                    })}
                    rows={4}
                    className="saas-input w-full rounded-xl p-3 text-xs leading-relaxed"
                  />
                )}

                {activePlatformTab === 'facebook' && (
                  <textarea
                    value={editableContent.facebook?.text || ''}
                    onChange={(e) => setEditableContent({
                      ...editableContent,
                      facebook: { ...editableContent.facebook, text: e.target.value }
                    })}
                    rows={3}
                    className="saas-input w-full rounded-xl p-3 text-xs leading-relaxed"
                  />
                )}

                {activePlatformTab === 'tiktok' && (
                  <textarea
                    value={editableContent.tiktok?.caption || ''}
                    onChange={(e) => setEditableContent({
                      ...editableContent,
                      tiktok: { ...editableContent.tiktok, caption: e.target.value }
                    })}
                    rows={2}
                    className="saas-input w-full rounded-xl p-3 text-xs leading-relaxed"
                  />
                )}
              </div>

              {/* Realistic Social Platform Mockup Preview */}
              <div className="py-2">
                <div className="text-xs font-bold text-stone-600 dark:text-stone-400 mb-2 flex items-center justify-between">
                  <span>Channel Native Preview:</span>
                  <span className="text-[10px] text-stone-500 uppercase font-mono">Channel Verified</span>
                </div>
                {/* Keyed by post id so fresh AI results pop in with a scale-in */}
                <div key={generatedData?.postId} className="p-6 bg-stone-50 dark:bg-stone-950/70 rounded-2xl border border-stone-200/80 dark:border-stone-800 flex justify-center shadow-inner animate-scale-in">
                  {activePlatformTab === 'twitter' && (
                    <TwitterPreview 
                      content={editableContent.twitter} 
                      imageUrl={generatedData.imageUrl} 
                      profile={profile} 
                    />
                  )}
                  {activePlatformTab === 'instagram' && (
                    <InstagramPreview 
                      content={editableContent.instagram} 
                      imageUrl={generatedData.imageUrl} 
                      profile={profile} 
                    />
                  )}
                  {activePlatformTab === 'facebook' && (
                    <FacebookPreview 
                      content={editableContent.facebook} 
                      imageUrl={generatedData.imageUrl} 
                      profile={profile} 
                    />
                  )}
                  {activePlatformTab === 'tiktok' && (
                    <TikTokPreview 
                      content={editableContent.tiktok} 
                      imageUrl={generatedData.imageUrl} 
                      profile={profile} 
                    />
                  )}
                </div>
              </div>

              {/* Final Action Bar */}
              <div className="pt-4 border-t border-stone-200/80 dark:border-stone-800 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setGeneratedData(null)}
                  className="px-4 py-2.5 text-xs text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-white transition font-medium cursor-pointer"
                >
                  Discard Draft
                </button>

                <div className="flex items-center space-x-2.5">
                  <button
                    type="button"
                    onClick={() => handleSaveOrSchedule(false)}
                    className="px-5 py-2.5 blotato-cta font-bold text-xs rounded-xl shadow-sm hover:shadow transition flex items-center space-x-2 cursor-pointer active:scale-[0.99]"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>{mode === 'auto' ? 'Approve & Schedule' : 'Save as Review Draft'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSaveOrSchedule(true)}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-sm hover:shadow transition flex items-center space-x-1.5 cursor-pointer active:scale-[0.99]"
                    title="Dispatches to live channels immediately for demo"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Direct Publish (Sandbox)</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[460px] flex flex-col items-center justify-center p-8 glass-panel rounded-3xl border border-dashed border-stone-300 dark:border-stone-800 text-center">
              <div className="w-16 h-16 rounded-2xl bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 flex items-center justify-center mb-4 border border-stone-200 dark:border-stone-700 shadow-2xs">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-base font-extrabold text-stone-900 dark:text-stone-100 mb-1.5">AI Composer Preview Canvas</h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 max-w-sm mb-5 leading-relaxed">
                Provide your campaign idea on the left and let the AI Agent craft platform-specific copy and media previews here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
