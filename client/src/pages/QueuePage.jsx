import React from 'react';
import QueueTab from '../components/QueueTab';
import { useApp } from '../context/AppContext';

export default function QueuePage() {
  const { posts, actions, notify } = useApp();

  return (
    <QueueTab
      posts={posts}
      onApprovePost={actions.approvePost}
      onPublishNow={actions.publishNow}
      onDeletePost={actions.deletePost}
      onNotify={notify}
    />
  );
}
