import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Dashboard } from '@/components/Dashboard';
import { ArtworkGrid } from '@/components/artworks/ArtworkGrid';
import { ClientList } from '@/components/clients/ClientList';
import { ExhibitionList } from '@/components/exhibitions/ExhibitionList';

const Index = () => {
  const [currentView, setCurrentView] = useState('dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'artworks':
        return <ArtworkGrid />;
      case 'clients':
        return <ClientList />;
      case 'exhibitions':
        return <ExhibitionList />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <AppLayout>
      {renderView()}
    </AppLayout>
  );
};

export default Index;