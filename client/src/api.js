// API client for Automatrix Backend

export async function fetchProfile() {
  const res = await fetch('/api/profile');
  return res.json();
}

export async function updateProfile(data) {
  const res = await fetch('/api/profile', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function fetchAccounts() {
  const res = await fetch('/api/accounts');
  return res.json();
}

export async function toggleAccount(id) {
  const res = await fetch(`/api/accounts/${id}/toggle`, { method: 'POST' });
  return res.json();
}

export async function setAccountMode(id, mode) {
  const res = await fetch(`/api/accounts/${id}/mode`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mode })
  });
  return res.json();
}

export async function fetchPosts() {
  const res = await fetch('/api/posts');
  return res.json();
}

export async function generateAIPost(payload) {
  const res = await fetch('/api/posts/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return res.json();
}

export async function createPost(postData) {
  const res = await fetch('/api/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(postData)
  });
  return res.json();
}

export async function updatePost(id, updates) {
  const res = await fetch(`/api/posts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });
  return res.json();
}

export async function deletePost(id) {
  const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
  return res.json();
}

export async function approvePost(id) {
  const res = await fetch(`/api/posts/${id}/approve`, { method: 'POST' });
  return res.json();
}

export async function publishPostNow(id) {
  const res = await fetch(`/api/posts/${id}/publish-now`, { method: 'POST' });
  return res.json();
}

export async function fetchAnalytics() {
  const res = await fetch('/api/analytics');
  return res.json();
}

export async function fetchLogs() {
  const res = await fetch('/api/logs');
  return res.json();
}

export async function resetDemoData() {
  const res = await fetch('/api/system/reset', { method: 'POST' });
  return res.json();
}
