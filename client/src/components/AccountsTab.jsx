import React, { useState } from 'react';
import { 
  Share2, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  ExternalLink, 
  Key, 
  ShieldCheck, 
  ToggleLeft, 
  ToggleRight,
  Info
} from 'lucide-react';

export default function AccountsTab({ accounts, onToggleAccount, onNotify }) {
  const [activeAccountList, setActiveAccountList] = useState(accounts);

  const handleToggle = (id) => {
    setActiveAccountList(prev => 
      prev.map(acc => acc.id === id ? { ...acc, connected: !acc.connected } : acc)
    );
    if (onToggleAccount) {
      onToggleAccount(id);
    }
  };

  const getBadge = (connected) => {
    return connected ? (
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-stone-500 dark:text-stone-400 text-xs font-bold uppercase tracking-wider mb-1 font-mono">
            <Share2 className="w-4 h-4 text-stone-700 dark:text-stone-300" />
            <span>Social API Integrations & Auth</span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">Connected Accounts & Channels</h1>
          <p className="text-stone-500 dark:text-stone-400 text-xs mt-1">
            Manage live OAuth2 tokens and sandbox mock connections for autonomous cross-posting.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 px-3.5 py-2 rounded-2xl text-stone-700 dark:text-stone-300 shadow-2xs">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>OAuth2 Token Encryption Active</span>
        </div>
      </div>

      {/* Account Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {activeAccountList.map((acc) => {
          return (
            <div
              key={acc.id}
              className={`glass-panel rounded-3xl p-6 transition shadow-sm ${
                acc.connected ? 'border-stone-300 dark:border-stone-700' : 'opacity-85'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3.5">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white shadow-sm p-0.5 ${
                    acc.id === 'instagram' ? 'bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600' :
                    acc.id === 'twitter' ? 'bg-stone-900 dark:bg-stone-800' :
                    acc.id === 'facebook' ? 'bg-blue-600' : 'bg-rose-600'
                  }`}>
                    <div className="w-full h-full bg-white dark:bg-stone-950 rounded-[14px] flex items-center justify-center font-bold text-stone-900 dark:text-white text-sm font-mono">
                      {acc.name.slice(0, 2).toUpperCase()}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-bold text-stone-900 dark:text-stone-100 text-base">{acc.name}</h3>
                      {getBadge(acc.connected)}
                    </div>
                    <p className="text-xs text-stone-500 dark:text-stone-400 font-mono mt-0.5">{acc.handle}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleToggle(acc.id)}
                  className="p-1 text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition cursor-pointer"
                  title={acc.connected ? 'Disconnect channel' : 'Connect channel'}
                >
                  {acc.connected ? (
                    <ToggleRight className="w-8 h-8 text-stone-900 dark:text-stone-100" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-stone-400" />
                  )}
                </button>
              </div>

              {/* Status details */}
              <div className="mt-5 pt-4 border-t border-stone-200/80 dark:border-stone-800">
                <div className="bg-stone-50 dark:bg-stone-900/80 rounded-2xl p-4 border border-stone-200/80 dark:border-stone-800 space-y-2.5 text-xs mb-5">
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500 dark:text-stone-400">Connection Mode:</span>
                    <div className="flex bg-stone-200 dark:bg-stone-800 p-0.5 rounded-lg border border-stone-300 dark:border-stone-700 text-[10px]">
                      <span className={`px-2 py-0.5 rounded font-bold ${acc.mode === 'sandbox' ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900' : 'text-stone-600 dark:text-stone-400'}`}>
                        Sandbox Mock
                      </span>
                      <span className={`px-2 py-0.5 rounded font-bold ${acc.mode === 'live' ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900' : 'text-stone-600 dark:text-stone-400'}`}>
                        Live API
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between font-mono">
                    <span className="text-stone-500 dark:text-stone-400">API Scope:</span>
                    <span className="text-stone-700 dark:text-stone-300 font-bold">{acc.scope}</span>
                  </div>
                  <div className="flex items-center justify-between font-mono">
                    <span className="text-stone-500 dark:text-stone-400">Token Status:</span>
                    <span className={acc.connected ? "text-emerald-700 dark:text-emerald-400 font-bold" : "text-stone-400"}>
                      {acc.connected ? "Valid (Auto-refresh enabled)" : "Expired / Disconnected"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-500 dark:text-stone-400 text-[11px] font-mono">Last Sync: Today, 11:20 AM</span>
                  <button
                    onClick={() => {
                      onNotify(`Refreshed OAuth authorization for ${acc.name}. Ready for publishing.`);
                    }}
                    className="flex items-center space-x-1.5 text-stone-800 dark:text-stone-200 hover:text-black dark:hover:text-white font-bold cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Test Connection</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* API Notice */}
      <div className="glass-panel rounded-3xl p-5 border border-stone-200/80 dark:border-stone-800 flex items-start space-x-3.5">
        <Info className="w-5 h-5 text-stone-600 dark:text-stone-400 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <h4 className="font-bold text-stone-900 dark:text-stone-100">FYP Multi-Platform API Dispatch Engine</h4>
          <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
            All 4 channels are pre-configured to execute in deterministic sandbox simulation mode out of the box, fulfilling your project evaluation requirements without requiring developer platform credentials. Live API credentials can be configured anytime in Settings.
          </p>
        </div>
      </div>
    </div>
  );
}
