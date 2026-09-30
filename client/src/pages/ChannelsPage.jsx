import React, { useEffect } from 'react';
import AccountsTab from '../components/AccountsTab';
import { useApp } from '../context/AppContext';

export default function ChannelsPage() {
  const { accounts, actions, notify } = useApp();

  // Handle the return from a platform OAuth flow:
  //   /channels?connected=twitter&handle=johndoe
  //   /channels?connect_error=...
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const connected = params.get('connected');
    const handle = params.get('handle');
    const error = params.get('connect_error');

    if (connected || error) {
      window.history.replaceState({}, '', window.location.pathname);
      if (error) {
        notify(`Live connection failed: ${error}`, 'error');
      } else if (connected) {
        notify(`${connected === 'twitter' ? 'X' : connected[0].toUpperCase() + connected.slice(1)} connected LIVE${handle ? ` as ${handle}` : ''} — posts on this channel now publish for real.`, 'success');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AccountsTab
      accounts={accounts}
      onToggleAccount={actions.toggleAccount}
      onSetAccountMode={actions.setAccountMode}
      onAddAccount={actions.addAccount}
      onRemoveAccount={actions.removeAccount}
      onNotify={notify}
    />
  );
}
