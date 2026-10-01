import React, { useState } from 'react';
import {
  Share2,
  CheckCircle2,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  Info,
  Plus,
  Trash2,
  UserRound,
  Link2,
  Loader2,
  Zap
} from 'lucide-react';

const PLATFORMS = [
  { id: 'instagram', label: 'Instagram', gradient: 'from-amber-500 via-rose-500 to-purple-600' },
  { id: 'twitter', label: 'X / Twitter', gradient: 'from-stone-700 to-stone-900' },
  { id: 'facebook', label: 'Facebook', gradient: 'from-blue-500 to-blue-700' },
  { id: 'tiktok', label: 'TikTok', gradient: 'from-rose-500 to-cyan-600' },
  { id: 'linkedin', label: 'LinkedIn', gradient: 'from-sky-600 to-blue-800' }
];

const EMPTY_FORM = { platform: 'instagram', name: '', handle: '', followers: '', avatar: '' };

// Platforms with a real (live) OAuth + publishing integration
const LIVE_PLATFORMS = [
  { id: 'twitter', label: 'X (Twitter)' },
  { id: 'instagram', label: 'Instagram Business' },
  { id: 'facebook', label: 'Facebook Page' },
  { id: 'tiktok', label: 'TikTok' }
];

export default function AccountsTab({ accounts, onToggleAccount, onSetAccountMode, onAddAccount, onRemoveAccount, onNotify }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [showForm, setShowForm] = useState(accounts.length === 0);
  const [saving, setSaving] = useState(false);
  const [connecting, setConnecting] = useState(null);

  const isConnected = (acc) => acc.status === 'connected';
  const isLive = (acc) => acc.mode === 'live' && acc.credentials;

  /** Kick off the platform OAuth flow (full-page redirect to the consent screen). */
  const handleConnect = async (platform) => {
    setConnecting(platform);
    try {
      const res = await fetch(`/api/accounts/${platform}/connect`, { redirect: 'manual' });
      if (res.type === 'opaqueredirect' || (res.status >= 300 && res.status < 400)) {
        // Server says "go to the platform" — follow it for real
        window.location.href = `/api/accounts/${platform}/connect`;
        return;
      }
      const data = await res.json().catch(() => null);
      onNotify(data?.message || 'Live connection failed', 'error');
    } catch (err) {
      onNotify('Live connection failed: ' + err.message, 'error');
    } finally {
      setConnecting(null);
    }
  };

  const handleToggle = (acc) => {
    onToggleAccount(acc.id);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.handle.trim()) {
      onNotify('Channel name and handle are required.', 'error');
      return;
    }
    setSaving(true);
    try {
      await onAddAccount({
        platform: form.platform,
        name: form.name.trim(),
        handle: form.handle.trim().startsWith('@') ? form.handle.trim() : `@${form.handle.trim()}`,
        followers: Number(form.followers) || 0,
        avatar: form.avatar.trim()
      });
      setForm(EMPTY_FORM);
      setShowForm(false);
    } catch (err) {
      onNotify(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const getBadge = (acc) => {
    return isConnected(acc) ? (
      <span className="flex items-center space-x-1 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 px-2.5 py-0.5 rounded-full text-xs font-semibold">
        <CheckCircle2 className="w-3.5 h-3.5" />
        <span>Connected</span>
      </span>
    ) : (
      <span className="flex items-center space-x-1 text-stone-500 bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 px-2.5 py-0.5 rounded-full text-xs font-semibold">
        <AlertCircle className="w-3.5 h-3.5" />
        <span>Disconnected</span>
      </span>
    );
  };

  const gradientFor = (platform) =>
    PLATFORMS.find((p) => p.id === platform)?.gradient || 'from-stone-400 to-stone-600';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-stone-500 dark:text-stone-400 text-xs font-bold uppercase tracking-wider mb-1 font-mono">
            <Share2 className="w-4 h-4 text-stone-700 dark:text-stone-300" />
            <span>Your Social Channels</span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">Channels & Connections</h1>
          <p className="text-stone-500 dark:text-stone-400 text-xs mt-1">
            Register your business channels — or connect them LIVE via OAuth. Unconnected channels publish as clearly-labeled sandbox simulations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center space-x-2 text-xs bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 px-3.5 py-2 rounded-2xl text-amber-700 dark:text-amber-400 shadow-2xs">
            <Info className="w-4 h-4" />
            <span>Sandbox-safe: unconnected channels never post for real</span>
          </div>
          <button
            onClick={() => setShowForm((s) => !s)}
            className="flex items-center space-x-1.5 px-4 py-2 blotato-cta font-bold text-xs rounded-2xl shadow-sm transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{showForm ? 'Hide Form' : 'Add Channel'}</span>
          </button>
        </div>
      </div>

      {/* Live Platform Connections (real publishing via OAuth) */}
      <div className="glass-panel rounded-3xl p-6 shadow-sm border border-stone-200/80 dark:border-stone-800">
        <div className="flex items-center space-x-2 text-stone-500 dark:text-stone-400 text-xs font-bold uppercase tracking-wider mb-1 font-mono">
          <Zap className="w-4 h-4" />
          <span>Live Publishing — Real Platforms</span>
        </div>
        <p className="text-xs text-stone-500 dark:text-stone-400 mb-4">
          Connect your real accounts once (OAuth). Posts from a connected channel go <strong>LIVE</strong> — to the actual platform. Everything else stays a safe simulation.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {LIVE_PLATFORMS.map((p) => {
            const live = (accounts || []).find((a) => a.platform === p.id && isLive(a));
            return (
              <div
                key={p.id}
                className={`rounded-2xl border p-4 flex flex-col items-start space-y-2.5 transition ${
                  live
                    ? 'border-emerald-300 dark:border-emerald-500/40 bg-emerald-50/70 dark:bg-emerald-500/5'
                    : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/40'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-bold text-xs text-stone-900 dark:text-stone-100">{p.label}</span>
                  {live ? (
                    <span className="flex items-center space-x-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 px-2 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      LIVE
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-stone-400 dark:text-stone-500 border border-stone-200 dark:border-stone-700 px-2 py-0.5 rounded-full">
                      SANDBOX
                    </span>
                  )}
                </div>

                {live ? (
                  <>
                    <div className="text-[11px] font-mono text-stone-600 dark:text-stone-300 truncate w-full" title={live.handle}>
                      {live.handle}
                    </div>
                    <button
                      onClick={() => onRemoveAccount(live.id)}
                      className="text-[10px] font-bold text-rose-500 hover:text-rose-600 cursor-pointer"
                    >
                      Disconnect
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleConnect(p.id)}
                    disabled={connecting === p.id}
                    className="w-full py-2 bg-stone-900 hover:bg-black text-white dark:bg-stone-100 dark:hover:bg-white dark:text-stone-900 font-bold text-xs rounded-xl transition cursor-pointer disabled:opacity-50 flex items-center justify-center space-x-1.5"
                  >
                    {connecting === p.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Link2 className="w-3.5 h-3.5" />
                    )}
                    <span>{connecting === p.id ? 'Opening…' : 'Connect (OAuth)'}</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <p className="text-[10px] text-stone-400 dark:text-stone-500 mt-3 leading-relaxed">
          First time? Create the platform's free app and put its keys in <span className="font-mono">.env</span> — step-by-step instructions are in <span className="font-mono">PROJECT_GUIDE.md</span> (section: Live Platform Publishing).
        </p>
      </div>

      {/* Add Channel Form */}
      {showForm && (
        <form onSubmit={handleAdd} className="glass-panel rounded-3xl p-6 shadow-sm border border-stone-200/80 dark:border-stone-800 space-y-4">
          <div className="flex items-center space-x-2">
            <UserRound className="w-4 h-4 text-stone-500" />
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">Register your real channel</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <select
              value={form.platform}
              onChange={(e) => setForm({ ...form, platform: e.target.value })}
              className="saas-input rounded-xl px-3 py-2.5 text-xs"
            >
              {PLATFORMS.map((p) => (
                <option key={p.id} value={p.id}>{p.label}</option>
              ))}
            </select>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Display name (e.g. My Cafe)"
              className="saas-input rounded-xl px-3 py-2.5 text-xs"
            />
            <input
              type="text"
              value={form.handle}
              onChange={(e) => setForm({ ...form, handle: e.target.value })}
              placeholder="Handle (e.g. @mycafe)"
              className="saas-input rounded-xl px-3 py-2.5 text-xs"
            />
            <input
              type="number"
              min="0"
              value={form.followers}
              onChange={(e) => setForm({ ...form, followers: e.target.value })}
              placeholder="Followers (optional)"
              className="saas-input rounded-xl px-3 py-2.5 text-xs"
            />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-3 items-end">
            <input
              type="text"
              value={form.avatar}
              onChange={(e) => setForm({ ...form, avatar: e.target.value })}
              placeholder="Avatar image URL (optional)"
              className="saas-input rounded-xl px-3 py-2.5 text-xs"
            />
            <button
              type="submit"
              disabled={saving}
              className="flex items-center space-x-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-sm transition cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{saving ? 'Connecting…' : 'Connect Channel'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Account Cards Grid */}
      {accounts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {accounts.map((acc) => (
            <div
              key={acc.id}
              className={`glass-panel rounded-3xl p-6 transition shadow-sm ${
                isConnected(acc) ? 'border-stone-300 dark:border-stone-700' : 'opacity-85'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3.5">
                  {acc.avatar ? (
                    <img src={acc.avatar} alt={acc.name} className="w-12 h-12 rounded-2xl object-cover shadow-sm" />
                  ) : (
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${gradientFor(acc.platform)} flex items-center justify-center font-bold text-white shadow-sm`}>
                      {acc.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-bold text-stone-900 dark:text-stone-100 text-base">{acc.name}</h3>
                      {getBadge(acc)}
                    </div>
                    <p className="text-xs text-stone-500 dark:text-stone-400 font-mono mt-0.5">{acc.handle}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleToggle(acc)}
                    className="p-1 text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition cursor-pointer"
                    title={isConnected(acc) ? 'Disconnect channel' : 'Reconnect channel'}
                  >
                    {isConnected(acc) ? (
                      <ToggleRight className="w-7 h-7 text-stone-900 dark:text-stone-100" />
                    ) : (
                      <ToggleLeft className="w-7 h-7 text-stone-400" />
                    )}
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Remove ${acc.name} (${acc.handle})?`)) onRemoveAccount(acc.id);
                    }}
                    className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition cursor-pointer"
                    title="Remove channel"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Status details */}
              <div className="mt-5 pt-4 border-t border-stone-200/80 dark:border-stone-800">
                <div className="bg-stone-50 dark:bg-stone-900/80 rounded-2xl p-4 border border-stone-200/80 dark:border-stone-800/80 space-y-2.5 text-xs mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500 dark:text-stone-400">Connection Mode:</span>
                    <div className="flex bg-stone-200 dark:bg-stone-800 p-0.5 rounded-lg border border-stone-300 dark:border-stone-700 text-[10px]">
                      <button
                        onClick={() => onSetAccountMode(acc.id, 'sandbox')}
                        className={`px-2 py-0.5 rounded font-bold cursor-pointer transition ${acc.mode === 'sandbox' ? 'bg-pink-500 text-white' : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'}`}
                      >
                        Sandbox
                      </button>
                      <button
                        onClick={() => onSetAccountMode(acc.id, 'live')}
                        className={`px-2 py-0.5 rounded font-bold cursor-pointer transition ${acc.mode === 'live' ? 'bg-pink-500 text-white' : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'}`}
                      >
                        Live
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between font-mono">
                    <span className="text-stone-500 dark:text-stone-400">Registered Followers:</span>
                    <span className="text-stone-700 dark:text-stone-300 font-bold">{Number(acc.followers || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between font-mono">
                    <span className="text-stone-500 dark:text-stone-400">Connected Since:</span>
                    <span className="text-stone-700 dark:text-stone-300 font-bold">
                      {acc.connectedAt ? new Date(acc.connectedAt).toLocaleDateString() : '—'}
                    </span>
                  </div>
                </div>

                {acc.mode === 'live' && (
                  <p className="text-[11px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-xl p-2.5 leading-relaxed">
                    "Live" is selected, but no live platform API integration is configured yet — dispatches still run as sandbox simulations.
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-10 text-center bg-stone-50 dark:bg-stone-900/40 rounded-3xl border border-dashed border-stone-200 dark:border-stone-800">
          <Share2 className="w-10 h-10 text-stone-400 dark:text-stone-500 mx-auto mb-3" />
          <p className="text-sm font-semibold text-stone-800 dark:text-stone-300">No channels connected yet</p>
          <p className="text-xs text-stone-500 mt-1 max-w-md mx-auto">
            Add your business&apos;s real Instagram, X, Facebook or TikTok channel above. Dispatches are recorded locally in sandbox mode until a live API integration is added.
          </p>
        </div>
      )}

      {/* Honest sandbox notice */}
      <div className="glass-panel rounded-3xl p-5 border border-stone-200/80 dark:border-stone-800 flex items-start space-x-3.5">
        <Info className="w-5 h-5 text-stone-600 dark:text-stone-400 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <h4 className="font-bold text-stone-900 dark:text-stone-100">How publishing works today</h4>
          <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
            All channels run in deterministic <strong>sandbox simulation mode</strong>: scheduled dispatches are recorded in your
            workspace with a receipt, but <strong>no real platform API call is made</strong> and no fake URLs or engagement numbers are
            generated. To publish for real, each platform needs its own OAuth integration and developer credentials.
          </p>
        </div>
      </div>
    </div>
  );
}
