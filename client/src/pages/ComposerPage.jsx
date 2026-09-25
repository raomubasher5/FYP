import React from 'react';
import StudioTab from '../components/StudioTab';
import { useApp } from '../context/AppContext';

export default function ComposerPage() {
  const { profile, actions, notify } = useApp();

  return (
    <StudioTab
      profile={profile}
      onGeneratePost={actions.generatePost}
      onCreatePost={actions.createPost}
      onNotify={notify}
    />
  );
}
