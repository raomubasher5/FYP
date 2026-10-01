import { Outlet, useLocation } from 'react-router-dom';

import Header from './Header';
import React from 'react';
import Sidebar from './Sidebar';
import { Toast } from '../common';
import { useApp } from '../../context/AppContext';

export default function AppLayout() {
  const location = useLocation();
  const { loading, notification, clearNotification } = useApp();

  if (loading) {
    return (
      <div className="min-h-screen app-canvas flex flex-col items-center justify-center text-slate-900 dark:text-white">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 animate-pulse flex items-center justify-center font-extrabold text-2xl mb-4 shadow-2xl shadow-indigo-500/30 text-white">
          A
        </div>
        <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Initializing Automatrix Engine...</p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-mono">Loading autonomous background scheduler & workspace</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen app-canvas text-slate-900 dark:text-slate-100 flex antialiased selection:bg-indigo-500 selection:text-white transition-colors duration-200">
      <Toast notification={notification} onClose={clearNotification} />

      {/* Modern Left Sidebar */}
      <Sidebar />

      {/* Main Content View */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <Header />

        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Keyed by route so every page entrance re-plays the fade-up animation */}
          <div key={location.pathname} className="animate-fade-up">
            <Outlet />
          </div>
        </main>

        <footer className="border-t border-slate-200/80 dark:border-slate-800/80 py-4 px-8 text-xs text-slate-500 dark:text-slate-400 bg-white/70 dark:bg-[#0a0512]/80 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-2 mt-auto">
          <span>Automatrix — Unified AI Agent-Powered Social Media Management Platform</span>
          <span className="font-mono text-slate-400 dark:text-slate-500">Multi-Page Production Architecture · Dual Theme Engine</span>
        </footer>
      </div>
    </div>
  );
}
