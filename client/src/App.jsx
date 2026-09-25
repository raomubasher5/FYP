import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import AppLayout from './components/layout/AppLayout';
import DashboardPage from './pages/DashboardPage';
import OnboardingPage from './pages/OnboardingPage';
import ComposerPage from './pages/ComposerPage';
import CalendarPage from './pages/CalendarPage';
import QueuePage from './pages/QueuePage';
import AnalyticsPage from './pages/AnalyticsPage';
import ChannelsPage from './pages/ChannelsPage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="onboarding" element={<OnboardingPage />} />
              <Route path="composer" element={<ComposerPage />} />
              <Route path="calendar" element={<CalendarPage />} />
              <Route path="queue" element={<QueuePage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="channels" element={<ChannelsPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </ThemeProvider>
  );
}
