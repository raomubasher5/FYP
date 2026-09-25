import React from 'react';

export function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-slate-800 text-slate-300 border-slate-700',
    primary: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    success: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    warning: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    danger: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    purple: 'bg-purple-500/20 text-purple-300 border-purple-500/30'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${variants[variant] || variants.default} ${className}`}>
      {children}
    </span>
  );
}

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  disabled = false, 
  icon: Icon, 
  className = '', 
  ...props 
}) {
  const variants = {
    primary: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/25',
    secondary: 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700',
    success: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/25',
    danger: 'bg-rose-600/90 hover:bg-rose-600 text-white',
    ghost: 'text-slate-400 hover:text-white hover:bg-slate-800/60'
  };

  const sizes = {
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3.5 py-2 text-xs font-medium',
    lg: 'px-5 py-2.5 text-sm font-semibold'
  };

  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center space-x-2 rounded-xl transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : (
        Icon && <Icon className="w-4 h-4" />
      )}
      <span>{children}</span>
    </button>
  );
}

export function Card({ children, className = '' }) {
  return (
    <div className={`bg-slate-800/70 border border-slate-700/80 rounded-2xl p-5 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

export function Toast({ notification, onClose }) {
  if (!notification) return null;

  const styles = {
    success: 'bg-emerald-950 border-emerald-500/50 text-emerald-200',
    error: 'bg-rose-950 border-rose-500/50 text-rose-200',
    warning: 'bg-amber-950 border-amber-500/50 text-amber-200',
    info: 'bg-indigo-950 border-indigo-500/50 text-indigo-200'
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-md animate-bounce-short">
      <div className={`p-4 rounded-xl shadow-2xl border text-xs font-medium flex items-center justify-between space-x-3 ${styles[notification.type] || styles.info}`}>
        <span>{notification.message}</span>
        <button onClick={onClose} className="text-slate-400 hover:text-white font-bold ml-2">✕</button>
      </div>
    </div>
  );
}
