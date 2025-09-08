import React, { useState, useEffect } from 'react';
import useFirebaseState from '../hooks/useFirebaseState';
import { FIREBASE_DB_PATH } from '../constants';
import type { DashboardState } from '../types';
import ShelfRow from './ShelfRow';

const TvDashboard: React.FC = () => {
    const [dashboardState, , isLoading] = useFirebaseState<DashboardState>(FIREBASE_DB_PATH, {});
    const [sortBy, setSortBy] = useState<'rack' | 'duration'>('rack');
    const [, setTick] = useState(0);

    useEffect(() => {
        // Force a re-render every second when sorting by duration to keep the list order accurate.
        if (sortBy === 'duration') {
            const interval = setInterval(() => {
                setTick(t => t + 1);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [sortBy]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-xl text-slate-600 dark:text-slate-400">Loading Dashboard...</p>
            </div>
        );
    }

    const allShelves = Object.entries(dashboardState)
        .sort(([a], [b]) => parseInt(a) - parseInt(b))
        .flatMap(([rackNumber, shelves]) => 
            shelves.map((shelf, index) => ({...shelf, rackNumber: parseInt(rackNumber), shelfIndex: index}))
        );

    const activeShelves = allShelves.filter(shelf => shelf.startTime !== null);
    const idleShelves = allShelves.filter(shelf => shelf.startTime === null);

    if (sortBy === 'duration') {
        activeShelves.sort((a, b) => {
            const durationA = a.startTime ? ((Date.now() - a.startTime) / 1000) + a.manualOffset : a.manualOffset;
            const durationB = b.startTime ? ((Date.now() - b.startTime) / 1000) + b.manualOffset : b.manualOffset;
            return durationB - durationA; // Sort descending
        });
    }
    // 'rack' sort is the default order from `allShelves`

    return (
        <div>
            <div className="flex items-center gap-4 mb-4">
                <h2 className="text-2xl font-bold text-brand-accent-blue">Active</h2>
                <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">Sort by:</span>
                    <button onClick={() => setSortBy('rack')} className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${sortBy === 'rack' ? 'bg-brand-green text-white' : 'bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200'}`}>
                        Rack
                    </button>
                    <button onClick={() => setSortBy('duration')} className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${sortBy === 'duration' ? 'bg-brand-green text-white' : 'bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200'}`}>
                        Duration
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 2xl:grid-cols-9 gap-3">
                {activeShelves.length > 0 ? activeShelves.map((shelf) => (
                    <ShelfRow 
                        key={shelf.id}
                        shelf={shelf}
                        rackNumber={shelf.rackNumber}
                        shelfIndex={shelf.shelfIndex}
                    />
                )) : <p className="text-slate-600 dark:text-slate-400 col-span-full">No active shelves.</p>}
            </div>

            <h2 className="text-2xl font-bold text-slate-600 dark:text-slate-500 mt-8 mb-4">Idle</h2>
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 2xl:grid-cols-9 gap-3">
                {idleShelves.map((shelf) => (
                    <ShelfRow 
                        key={shelf.id}
                        shelf={shelf}
                        rackNumber={shelf.rackNumber}
                        shelfIndex={shelf.shelfIndex}
                    />
                ))}
            </div>
        </div>
    );
};

export default TvDashboard;