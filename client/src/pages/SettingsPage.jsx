import React from 'react';
import SettingsTab from '../components/SettingsTab';
import { useApp } from '../context/AppContext';

export default function SettingsPage() {
  const { profile, actions, notify } = useApp();

  return (
    <SettingsTab
      profile={profile}
      onUpdateProfile={actions.updateProfile}
      onNotify={notify}
    />
  );
}
