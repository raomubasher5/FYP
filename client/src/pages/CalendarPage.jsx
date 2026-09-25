import React from 'react';
import { useNavigate } from 'react-router-dom';
import CalendarTab from '../components/CalendarTab';
import { useApp } from '../context/AppContext';

export default function CalendarPage() {
  const navigate = useNavigate();
  const { posts, profile, actions } = useApp();

  return (
    <CalendarTab
      posts={posts}
      profile={profile}
      onPublishNow={actions.publishNow}
      setActiveTab={(tab) => {
        if (tab === 'studio') navigate('/composer');
        else navigate(`/${tab}`);
      }}
    />
  );
}
