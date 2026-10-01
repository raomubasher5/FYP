import React from 'react';
import AnalyticsTab from '../components/AnalyticsTab';
import { useApp } from '../context/AppContext';

export default function AnalyticsPage() {
  const { analytics, actions, notify } = useApp();

  return (
    <AnalyticsTab
      analytics={analytics}
      onAddComment={actions.addComment}
      onNotify={notify}
    />
  );
}
