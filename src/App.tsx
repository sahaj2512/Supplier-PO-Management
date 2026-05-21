/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, createContext, useContext } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import DashboardView from './views/DashboardView';
import PoListView from './views/PoListView';
import PoDetailView from './views/PoDetailView';
import ScorecardView from './views/ScorecardView';
import { ViewState, PO } from './types';
import { initialPOs } from './data';

interface AppContextType {
  pos: PO[];
  updatePO: (updatedPo: PO) => void;
  showSnackbar: (msg: string) => void;
}

export const AppContext = createContext<AppContextType>({
  pos: [],
  updatePO: () => {},
  showSnackbar: () => {}
});

export const useAppContext = () => useContext(AppContext);

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>({ page: 'dashboard' });
  const [pos, setPos] = useState<PO[]>(initialPOs);
  const [snackbar, setSnackbar] = useState<string | null>(null);

  const updatePO = (updatedPo: PO) => {
    setPos(prev => prev.map(po => po.id === updatedPo.id ? updatedPo : po));
  };

  const showSnackbar = (msg: string) => {
    setSnackbar(msg);
    setTimeout(() => setSnackbar(null), 3500);
  };

  const getPageTitle = () => {
    switch (currentView.page) {
      case 'dashboard': return 'Supplier & PO Management';
      case 'pos': return 'Purchase Orders';
      case 'po-detail': return `PO Details: ${currentView.poId}`;
      case 'scorecard': return 'Supplier Scorecards';
      default: return 'Portal';
    }
  };

  const renderView = () => {
    switch (currentView.page) {
      case 'dashboard':
        return <DashboardView onNavigate={setCurrentView} />;
      case 'pos':
        return <PoListView onNavigate={setCurrentView} />;
      case 'po-detail':
        return <PoDetailView view={currentView} onNavigate={setCurrentView} />;
      case 'scorecard':
        return <ScorecardView onNavigate={setCurrentView} />;
      default:
        return <DashboardView onNavigate={setCurrentView} />;
    }
  };

  return (
    <AppContext.Provider value={{ pos, updatePO, showSnackbar }}>
      <div className="flex h-screen bg-[var(--color-bg)] text-[var(--color-text-main)] font-sans">
        <Sidebar currentView={currentView} onNavigate={setCurrentView} />
        <div className="flex-[1] min-w-0 flex flex-col ml-64 overflow-hidden bg-[var(--color-bg)]">
          <Topbar title={getPageTitle()} />
          <main className="flex-1 overflow-y-auto px-6 py-8 relative">
            {renderView()}
          </main>
        </div>
        
        {snackbar && (
          <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-4 py-3 rounded-lg shadow-lg font-bold text-sm tracking-wide z-50 animate-in fade-in slide-in-from-bottom-5">
            ✓ {snackbar}
          </div>
        )}
      </div>
    </AppContext.Provider>
  );
}
