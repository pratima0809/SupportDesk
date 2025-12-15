import React from 'react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="btn btn-ghost"
      aria-label="Toggle theme"
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
    >
      <span style={{ fontSize: 16 }}>{theme === 'dark' ? '🌙' : '☀️'}</span>
      <span className="small text-muted">{theme === 'dark' ? 'Dark' : 'Light'}</span>
    </button>
  );
}
