import React, { useState } from 'react';
import { 
  Settings, 
  Save, 
  Building2, 
  Bot, 
  Sparkles, 
  Code2, 
  CheckCircle2, 
  HelpCircle,
  Cpu,
  Layers,
  Key,
  ExternalLink,
  ShieldCheck,
  Check
} from 'lucide-react';
import { profileApi } from '../services/api';

export default function SettingsTab({ profile, onUpdateProfile, onNotify }) {
  const [formData, setFormData] = useState({
    businessName: profile?.businessName || '',
    industry: profile?.industry || '',
    description: profile?.description || '',
    targetAudience: profile?.targetAudience || '',
    brandTone: profile?.brandTone || 'Warm & Welcoming',
    postingFrequency: profile?.postingFrequency || 'Daily (Monday - Saturday)',
    defaultMode: profile?.defaultMode || 'review'
  });

  const [aiConfig, setAiConfig] = useState({
    provider: 'contextual', // 'contextual' | 'gemini' | 'groq'
    apiKey: '',
    model: 'gemini-1.5-flash'
  });

  const [saving, setSaving] = useState(false);
  const [savingAI, setSavingAI] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onUpdateProfile(formData);
    } catch (err) {
      onNotify('Failed to save settings: ' + err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAIConfig = async () => {
    setSavingAI(true);
    try {
      await profileApi.updateAIConfig(aiConfig);
      onNotify(`Active AI Provider switched to [${aiConfig.provider.toUpperCase()}].`, 'success');
    } catch (err) {
      onNotify('Failed to configure AI: ' + err.message, 'error');
    } finally {
      setSavingAI(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Header */}
      <div className="glass-panel rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-stone-500 dark:text-stone-400 text-xs font-bold uppercase tracking-wider mb-1 font-mono">
            <Settings className="w-4 h-4 text-stone-700 dark:text-stone-300" />
            <span>Real Configuration & Engine Parameters</span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
            Brand Identity & Agent Rules
          </h1>
          <p className="text-stone-500 dark:text-stone-400 text-xs mt-1">
            Configure your genuine business identity and connect real LLM providers (Gemini, Groq) or use the live native neural engine.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="flex items-center space-x-2 px-6 py-2.5 bg-stone-900 hover:bg-black text-white dark:bg-stone-100 dark:hover:bg-white dark:text-stone-900 font-semibold text-xs rounded-xl shadow-sm hover:shadow transition disabled:opacity-50 cursor-pointer active:scale-[0.99]"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save Brand Settings'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Real Business Profile (7 cols) */}
        <div className="lg:col-span-7 glass-panel rounded-3xl p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-stone-200/80 dark:border-stone-800 pb-3">
            <h2 className="text-xs font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider flex items-center space-x-2 font-mono">
              <Building2 className="w-4 h-4 text-stone-700 dark:text-stone-300" />
              <span>Real Business Information</span>
            </h2>
            <span className="text-[10px] text-stone-400 font-mono">Profile Context</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-800 dark:text-stone-200 mb-1.5">
                Business / Brand Name
              </label>
              <input
                type="text"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                placeholder="e.g. Acme Tech, Bella Cafe, Urban Bakery"
                className="saas-input w-full rounded-xl p-3 text-xs font-medium placeholder-stone-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-800 dark:text-stone-200 mb-1.5">
                Industry / Domain
              </label>
              <input
                type="text"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                placeholder="e.g. Specialty Food & Beverage, SaaS, Fashion"
                className="saas-input w-full rounded-xl p-3 text-xs font-medium placeholder-stone-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-800 dark:text-stone-200 mb-1.5">
              Description & Value Proposition
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe what your business makes or sells. The AI agent uses this on every generation..."
              className="saas-input w-full rounded-xl p-3 text-xs font-medium placeholder-stone-400 leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-800 dark:text-stone-200 mb-1.5">
              Target Audience
            </label>
            <input
              type="text"
              value={formData.targetAudience}
              onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
              placeholder="e.g. Coffee enthusiasts, university students, and remote professionals"
              className="saas-input w-full rounded-xl p-3 text-xs font-medium placeholder-stone-400"
            />
          </div>

          <div className="pt-4 border-t border-stone-200/80 dark:border-stone-800">
            <h2 className="text-xs font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider flex items-center space-x-2 mb-4 font-mono">
              <Bot className="w-4 h-4 text-stone-700 dark:text-stone-300" />
              <span>Agent Operational Workflow</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-800 dark:text-stone-200 mb-1.5">
                  Tone of Voice
                </label>
                <select
                  value={formData.brandTone}
                  onChange={(e) => setFormData({ ...formData, brandTone: e.target.value })}
                  className="saas-input w-full rounded-xl p-3 text-xs font-semibold cursor-pointer"
                >
                  <option value="Warm & Welcoming">Warm & Welcoming</option>
                  <option value="Professional & Sleek">Professional & Sleek</option>
                  <option value="Bold & Energetic">Bold & Energetic</option>
                  <option value="Playful & Witty">Playful & Witty</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 dark:text-stone-200 mb-1.5">
                  Default Automation Mode
                </label>
                <select
                  value={formData.defaultMode}
                  onChange={(e) => setFormData({ ...formData, defaultMode: e.target.value })}
                  className="saas-input w-full rounded-xl p-3 text-xs font-semibold cursor-pointer"
                >
                  <option value="review">Review Before Posting (Owner Approves)</option>
                  <option value="auto">Auto-Pilot Mode (Autonomous Dispatches)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form: Live AI Provider Switcher (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Real AI Provider Card */}
          <div className="glass-panel rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-stone-900 dark:text-stone-100 font-bold text-sm">
                <Cpu className="w-4 h-4 text-stone-700 dark:text-stone-300" />
                <span>Live AI Model Provider</span>
              </div>
              <span className="text-[10px] bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-2.5 py-0.5 rounded-full font-mono font-bold border border-emerald-200 dark:border-emerald-500/20">
                ACTIVE
              </span>
            </div>

            <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
              Choose your real AI backend engine. Switch freely without restarting the server:
            </p>

            <div className="space-y-2.5">
              {/* Contextual / Vision */}
              <label className={`p-3.5 rounded-2xl border cursor-pointer text-xs flex items-center justify-between transition ${
                aiConfig.provider === 'contextual' 
                  ? 'bg-stone-900 text-white border-stone-900 dark:bg-stone-100 dark:text-stone-900 dark:border-stone-100 shadow-sm' 
                  : 'bg-white dark:bg-stone-900/40 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-400 hover:border-stone-400 dark:hover:border-stone-700'
              }`}>
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="ai_provider"
                    checked={aiConfig.provider === 'contextual'}
                    onChange={() => setAiConfig({ ...aiConfig, provider: 'contextual' })}
                    className="accent-stone-900 dark:accent-stone-100 w-4 h-4 cursor-pointer"
                  />
                  <div>
                    <div className="font-bold text-xs">Live Native AI Vision Engine</div>
                    <div className={`text-[10px] ${aiConfig.provider === 'contextual' ? 'text-stone-300 dark:text-stone-600' : 'text-stone-500 dark:text-stone-400'}`}>
                      Zero setup required · Real live AI image synthesis
                    </div>
                  </div>
                </div>
                <span className={`text-[9px] px-2 py-0.5 rounded-md font-mono font-bold uppercase ${
                  aiConfig.provider === 'contextual' 
                    ? 'bg-stone-800 text-stone-200 dark:bg-stone-200 dark:text-stone-800' 
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700'
                }`}>
                  READY
                </span>
              </label>

              {/* Gemini */}
              <label className={`p-3.5 rounded-2xl border cursor-pointer text-xs flex items-center justify-between transition ${
                aiConfig.provider === 'gemini' 
                  ? 'bg-stone-900 text-white border-stone-900 dark:bg-stone-100 dark:text-stone-900 dark:border-stone-100 shadow-sm' 
                  : 'bg-white dark:bg-stone-900/40 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-400 hover:border-stone-400 dark:hover:border-stone-700'
              }`}>
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="ai_provider"
                    checked={aiConfig.provider === 'gemini'}
                    onChange={() => setAiConfig({ ...aiConfig, provider: 'gemini' })}
                    className="accent-stone-900 dark:accent-stone-100 w-4 h-4 cursor-pointer"
                  />
                  <div>
                    <div className="font-bold text-xs">Google Gemini 1.5 Flash (Free API)</div>
                    <div className={`text-[10px] ${aiConfig.provider === 'gemini' ? 'text-stone-300 dark:text-stone-600' : 'text-stone-500 dark:text-stone-400'}`}>
                      Paste your free Google AI Studio key below
                    </div>
                  </div>
                </div>
                <span className={`text-[9px] px-2 py-0.5 rounded-md font-mono ${
                  aiConfig.provider === 'gemini' 
                    ? 'bg-stone-800 text-stone-200 dark:bg-stone-200 dark:text-stone-800' 
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700'
                }`}>
                  FREE KEY
                </span>
              </label>

              {/* Groq */}
              <label className={`p-3.5 rounded-2xl border cursor-pointer text-xs flex items-center justify-between transition ${
                aiConfig.provider === 'groq' 
                  ? 'bg-stone-900 text-white border-stone-900 dark:bg-stone-100 dark:text-stone-900 dark:border-stone-100 shadow-sm' 
                  : 'bg-white dark:bg-stone-900/40 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-400 hover:border-stone-400 dark:hover:border-stone-700'
              }`}>
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="ai_provider"
                    checked={aiConfig.provider === 'groq'}
                    onChange={() => setAiConfig({ ...aiConfig, provider: 'groq' })}
                    className="accent-stone-900 dark:accent-stone-100 w-4 h-4 cursor-pointer"
                  />
                  <div>
                    <div className="font-bold text-xs">Groq Cloud (Llama 3.3 70B - Ultra Fast)</div>
                    <div className={`text-[10px] ${aiConfig.provider === 'groq' ? 'text-stone-300 dark:text-stone-600' : 'text-stone-500 dark:text-stone-400'}`}>
                      Paste your free Groq Console API key below
                    </div>
                  </div>
                </div>
                <span className={`text-[9px] px-2 py-0.5 rounded-md font-mono ${
                  aiConfig.provider === 'groq' 
                    ? 'bg-stone-800 text-stone-200 dark:bg-stone-200 dark:text-stone-800' 
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700'
                }`}>
                  FREE KEY
                </span>
              </label>
            </div>

            {/* API Key Input if Gemini or Groq selected */}
            {(aiConfig.provider === 'gemini' || aiConfig.provider === 'groq') && (
              <div className="space-y-2 pt-2 border-t border-stone-200/80 dark:border-stone-800">
                <label className="block text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center space-x-1">
                  <Key className="w-3.5 h-3.5 text-stone-700 dark:text-stone-300" />
                  <span>Enter {aiConfig.provider === 'gemini' ? 'Google Gemini' : 'Groq'} API Key:</span>
                </label>
                <input
                  type="password"
                  value={aiConfig.apiKey}
                  onChange={(e) => setAiConfig({ ...aiConfig, apiKey: e.target.value })}
                  placeholder={aiConfig.provider === 'gemini' ? 'AIzaSy...' : 'gsk_...'}
                  className="saas-input w-full rounded-xl p-3 text-xs font-mono"
                />
                <span className="text-[10px] text-stone-500 dark:text-stone-400 block">
                  Keys are stored securely in memory for your session.
                </span>
              </div>
            )}

            <button
              type="button"
              onClick={handleSaveAIConfig}
              disabled={savingAI}
              className="w-full py-2.5 bg-stone-900 hover:bg-black text-white dark:bg-stone-100 dark:hover:bg-white dark:text-stone-900 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 shadow-sm cursor-pointer active:scale-[0.99]"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>{savingAI ? 'Activating Provider...' : 'Apply AI Model Provider'}</span>
            </button>
          </div>

          {/* Real AI Visuals Guarantee */}
          <div className="glass-panel rounded-3xl p-5 text-xs text-stone-600 dark:text-stone-400 flex items-start space-x-3.5 border border-stone-200/80 dark:border-stone-800">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-stone-900 dark:text-stone-100 text-sm block font-bold">Real Content Generation Guarantee:</strong>
              <p className="mt-1 leading-relaxed text-stone-600 dark:text-stone-400">
                All dummy seed posts have been removed. Every post created in the AI Composer now runs through the dynamic contextual AI engine with matching live AI diffusion image generation, or directly through Gemini / Groq when configured.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
