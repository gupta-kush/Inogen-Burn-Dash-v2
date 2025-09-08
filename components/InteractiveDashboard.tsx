import React, { useCallback } from 'react';
import { FACILITY_LAYOUT } from '../constants';
import type { DashboardState, ShelfState } from '../types';
import Rack from './Rack';

interface InteractiveDashboardProps {
    dashboardState: DashboardState;
    setDashboardState: (value: DashboardState | ((prevState: DashboardState) => DashboardState)) => void;
    isLoading: boolean;
}

const InteractiveDashboard: React.FC<InteractiveDashboardProps> = ({ dashboardState, setDashboardState, isLoading }) => {
    const handleUpdateShelf = useCallback((updatedShelf: ShelfState) => {
        const [, rackNumStr] = updatedShelf.id.match(/rack-(\d+)-shelf-\d+/) || [];
        if (!rackNumStr) return;
        
        setDashboardState(prevState => {
            const rackShelves = prevState[rackNumStr] || [];
            const shelfIndex = rackShelves.findIndex(s => s.id === updatedShelf.id);
            if (shelfIndex === -1) return prevState;

            const newRackShelves = [...rackShelves];
            newRackShelves[shelfIndex] = updatedShelf;

            return {
                ...prevState,
                [rackNumStr]: newRackShelves
            };
        });
    }, [setDashboardState]);
    
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-xl text-slate-600 dark:text-slate-400">Loading Dashboard...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            {FACILITY_LAYOUT.map((group) => (
                <section key={group.name} aria-labelledby={`group-header-${group.name}`}>
                    <h2 id={`group-header-${group.name}`} className="text-xl font-bold text-brand-accent-blue mb-3 pb-2 border-b-2 border-slate-300 dark:border-slate-700">
                        {group.name}
                    </h2>
                    <div className="flex flex-row gap-2 overflow-x-auto pb-3 custom-scrollbar">
                        {group.racks.map((rackNumber) => {
                            const shelves = dashboardState[rackNumber];
                            if (!shelves || shelves.length === 0) return null;

                            return (
                                <Rack
                                    key={rackNumber}
                                    rackNumber={rackNumber}
                                    shelves={shelves}
                                    onUpdateShelf={handleUpdateShelf}
                                />
                            );
                        })}
                    </div>
                </section>
            ))}
        </div>
    );
};

export default InteractiveDashboard;