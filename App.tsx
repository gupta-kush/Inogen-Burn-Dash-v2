
import React, { useCallback } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import InteractiveDashboard from './components/InteractiveDashboard';
import TvDashboard from './components/TvDashboard';
import ThemeToggle from './components/ThemeToggle';
import useFirebaseState from './hooks/useFirebaseState';
import { useTheme } from './hooks/useTheme';
import { FACILITY_LAYOUT, NUM_SHELVES_PER_RACK, FIREBASE_DB_PATH } from './constants';
import type { DashboardState, ShelfState } from './types';

const generateInitialState = (): DashboardState => {
  const state: DashboardState = {};
  FACILITY_LAYOUT.forEach(group => {
    group.racks.forEach(rackNumber => {
      state[rackNumber] = [];
      for (let j = 1; j <= NUM_SHELVES_PER_RACK; j++) {
        const shelf: ShelfState = {
          id: `rack-${rackNumber}-shelf-${j}`,
          stationId: '',
          startTime: null,
          manualOffset: 0,
        };
        state[rackNumber].push(shelf);
      }
    });
  });
  return state;
};

const Header: React.FC<{ onResetAll: () => void }> = ({ onResetAll }) => {
    const location = useLocation();
    const isInteractiveView = location.pathname === '/';

    return (
        <header className="bg-slate-100 dark:bg-slate-800 p-4 shadow-lg flex justify-between items-center border-b border-slate-200 dark:border-slate-700">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-wider">
                <span className="text-brand-green">Burn-In</span> Dashboard
            </h1>
            <nav className="flex items-center gap-4">
                <ThemeToggle />
                {isInteractiveView ? (
                    <Link to="/compact" className="px-4 py-2 bg-brand-blue hover:bg-brand-blue/80 text-white font-semibold rounded-lg transition-colors">
                        Go to Compact View
                    </Link>
                ) : (
                    <Link to="/" className="px-4 py-2 bg-brand-green hover:bg-brand-green/80 text-white font-semibold rounded-lg transition-colors">
                        Go to Interactive View
                    </Link>
                )}
            </nav>
        </header>
    );
};


const App: React.FC = () => {
    const [dashboardState, setDashboardState, isLoading] = useFirebaseState<DashboardState>(FIREBASE_DB_PATH, generateInitialState());
    
    // Initialize theme on app load
    useTheme();

    const handleResetAll = () => {
        if (window.confirm('Are you sure you want to reset the entire dashboard? This will clear all timers and station IDs.')) {
            setDashboardState(generateInitialState());
        }
    };

  return (
    <HashRouter>
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            <Header onResetAll={handleResetAll} />
            <main className="p-4 sm:p-6 lg:p-8">
                <Routes>
                    <Route path="/" element={<InteractiveDashboard dashboardState={dashboardState} setDashboardState={setDashboardState} isLoading={isLoading} />} />
                    <Route path="/compact" element={<TvDashboard />} />
                </Routes>
            </main>
        </div>
    </HashRouter>
  );
};export default App;
