import React from 'react';
import AnalyticsTab from '../components/AnalyticsTab';
import { useApp } from '../context/AppContext';

export default function AnalyticsPage() {
  const { analytics, posts, notify } = useApp();

  return (
    <AnalyticsTab
      analytics={analytics}
      posts={posts}
      onNotify={notify}
    />
  );
}
