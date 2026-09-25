import React from 'react';
import DashboardPage from '../pages/DashboardPage';

// Proxy DashboardTab to DashboardPage for backward compatibility
export default function DashboardTab(props) {
  return <DashboardPage {...props} />;
}
