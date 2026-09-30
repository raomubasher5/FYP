import React from 'react';
import AccountsTab from '../components/AccountsTab';
import { useApp } from '../context/AppContext';

export default function ChannelsPage() {
  const { accounts, actions, notify } = useApp();

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
