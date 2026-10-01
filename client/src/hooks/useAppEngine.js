import { useState, useEffect, useCallback } from 'react';
import { postApi, accountApi, profileApi, analyticsApi } from '../services/api';

export function useAppEngine() {
  const [profile, setProfile] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [posts, setPosts] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  const notify = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification((curr) => (curr?.message === message ? null : curr));
    }, 4500);
  };

  const loadData = useCallback(async (isPolling = false) => {
    try {
      const [profData, accData, postData, anaData, logData] = await Promise.all([
        profileApi.get(),
        accountApi.getAll(),
        postApi.getAll(),
        analyticsApi.getOverview(),
        analyticsApi.getLogs()
      ]);

      if (profData) setProfile(profData);
      if (accData) setAccounts(accData);
      if (postData) setPosts(postData);
      if (anaData) setAnalytics(anaData);
      if (logData) setLogs(logData);
    } catch (err) {
      if (!isPolling) console.error('[useAppEngine] Sync Error:', err.message);
    } finally {
      if (!isPolling) setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData(false);
    const interval = setInterval(() => loadData(true), 4000);
    return () => clearInterval(interval);
  }, [loadData]);

  // Actions
  const generatePost = async (payload) => {
    return await postApi.generateAI(payload);
  };

  const createPost = async (payload, immediatePublish = false) => {
    const newPost = await postApi.create(payload);
    if (immediatePublish && newPost?.id) {
      await postApi.publishNow(newPost.id);
    }
    await loadData(true);
    return newPost;
  };

  const approvePost = async (id) => {
    await postApi.approve(id);
    notify('Post approved! Queued in scheduler pipeline.', 'success');
    await loadData(true);
  };

  const publishNow = async (id) => {
    notify('Dispatched to live channel pipeline...', 'info');
    await postApi.publishNow(id);
    notify('Successfully published to social channels!', 'success');
    await loadData(true);
  };

  const deletePost = async (id) => {
    if (!window.confirm('Delete this post?')) return;
    await postApi.delete(id);
    notify('Post deleted from queue.', 'info');
    await loadData(true);
  };

  const addAccount = async (data) => {
    const created = await accountApi.create(data);
    notify(`Channel "${data.name}" connected.`, 'success');
    await loadData(true);
    return created;
  };

  const removeAccount = async (id) => {
    await accountApi.delete(id);
    notify('Channel removed.', 'info');
    await loadData(true);
  };

  const addComment = async (data) => {
    await analyticsApi.addComment(data);
    notify('Real comment imported for sentiment analysis.', 'success');
    await loadData(true);
  };

  const toggleAccount = async (id) => {
    const res = await accountApi.toggle(id);
    await loadData(true);
    return res;
  };

  const setAccountMode = async (id, mode) => {
    const res = await accountApi.setMode(id, mode);
    await loadData(true);
    return res;
  };

  const updateProfile = async (data) => {
    const res = await profileApi.update(data);
    notify('Business profile preferences saved!', 'success');
    await loadData(true);
    return res;
  };

  const resetWorkspace = async () => {
    if (!window.confirm('Reset workspace? This clears all posts, imported comments and logs. Your profile and channels are kept.')) return;
    await analyticsApi.resetDemo();
    notify('Workspace reset — posts, comments and logs cleared.', 'success');
    await loadData(true);
  };

  return {
    profile,
    accounts,
    posts,
    analytics,
    logs,
    loading,
    notification,
    notify,
    clearNotification: () => setNotification(null),
    actions: {
      generatePost,
      createPost,
      approvePost,
      publishNow,
      deletePost,
      addAccount,
      removeAccount,
      addComment,
      toggleAccount,
      setAccountMode,
      updateProfile,
      resetWorkspace,
      resetDemo: resetWorkspace
    }
  };
}
