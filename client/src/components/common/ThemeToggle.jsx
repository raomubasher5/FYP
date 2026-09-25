import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function ThemeToggle({ showLabel = false, variant = 'icon', className = '' }) {
  const { theme, toggleTheme, setTheme } = useTheme();

  if (variant === 'segmented') {
    return (
      <div className={`flex items-center bg-stone-100 dark:bg-stone-900 p-1 rounded-xl border border-stone-200 dark:border-stone-800 text-xs font-semibold ${className}`}>
        <button
          type="button"
          onClick={() => setTheme('light')}
          className={`flex-1 flex items-center justify-center space-x-1.5 py-1 px-2.5 rounded-lg transition cursor-pointer ${
            theme === 'light'
              ? 'bg-white text-stone-900 shadow-xs border border-stone-200/80 font-bold'
              : 'text-stone-500 hover:text-stone-900'
          }`}
          title="Switch to Light Theme"
        >
          <Sun className="w-3.5 h-3.5 text-amber-500" />
          <span>Light</span>
        </button>

        <button
          type="button"
          onClick={() => setTheme('dark')}
          className={`flex-1 flex items-center justify-center space-x-1.5 py-1 px-2.5 rounded-lg transition cursor-pointer ${
            theme === 'dark'
              ? 'bg-stone-800 text-white shadow-xs border border-stone-700 font-bold'
              : 'text-stone-500 hover:text-stone-200'
          }`}
          title="Switch to Dark Theme"
        >
          <Moon className="w-3.5 h-3.5 text-stone-300" />
          <span>Dark</span>
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`p-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition flex items-center space-x-2 shadow-2xs cursor-pointer ${className}`}
      title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4 text-amber-400" />
      ) : (
        <Moon className="w-4 h-4 text-stone-700" />
      )}
      {showLabel && (
        <span className="text-xs font-semibold">
          {theme === 'dark' ? 'Light' : 'Dark'}
        </span>
      )}
    </button>
  );
}
