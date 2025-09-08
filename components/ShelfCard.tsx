import React, { useState, useCallback, useEffect } from 'react';
import type { ShelfState } from '../types';
import TimerDisplay from './TimerDisplay';
import EditTimeModal from './EditTimeModal';
import TimeProgressBar from './TimeProgressBar';
import { STATION_IDS } from '../constants';

interface ShelfCardProps {
    shelf: ShelfState;
    shelfIndex: number;
    onUpdateShelf: (shelf: ShelfState) => void;
}

const ShelfCard: React.FC<ShelfCardProps> = ({ shelf, shelfIndex, onUpdateShelf }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [cardBg, setCardBg] = useState('bg-slate-200/50 dark:bg-slate-700/50 border-slate-300 dark:border-slate-600');
    
    const isRunning = shelf.startTime !== null;

    useEffect(() => {
        if (isRunning) {
            setCardBg('bg-blue-100/80 dark:bg-blue-900/60 border-blue-300 dark:border-blue-500/60');
        } else {
            setCardBg('bg-slate-200/50 dark:bg-slate-700/50 border-slate-300 dark:border-slate-600');
        }
    }, [isRunning]);

    const handleStationIdChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onUpdateShelf({ ...shelf, stationId: e.target.value });
    };

    const handleStart = () => {
        if (shelf.startTime) return;
        // Start the timer without resetting the manualOffset, to allow for presets.
        onUpdateShelf({ ...shelf, startTime: Date.now() });
    };

    const handleReset = () => {
        onUpdateShelf({ ...shelf, startTime: null, manualOffset: 0, stationId: '' });
    };

    const handleSaveTime = useCallback((newTotalSeconds: number) => {
        // Treat any time edit as an action that makes the timer active and running.
        // We set a start time (if it doesn't exist) and then calculate the correct
        // offset to make the current displayed time equal to the new total seconds.
        const effectiveStartTime = shelf.startTime || Date.now();
        const elapsedSinceStart = (Date.now() - effectiveStartTime) / 1000;
        const newManualOffset = newTotalSeconds - elapsedSinceStart;

        onUpdateShelf({ ...shelf, startTime: effectiveStartTime, manualOffset: newManualOffset });
        
        setIsEditing(false);
    }, [shelf, onUpdateShelf]);

    return (
        <div className={`p-2 rounded-md border ${cardBg} transition-colors duration-300 flex flex-col justify-between h-24`}>
            {/* Top Row: Shelf #, Timer, and Station ID */}
            <div className="flex justify-between items-center gap-2">
                <span className="font-bold text-base text-slate-600 dark:text-slate-400">{shelfIndex + 1}</span>
                <div className="flex-grow font-mono text-3xl tracking-tighter text-center">
                    <TimerDisplay startTime={shelf.startTime} manualOffset={shelf.manualOffset} isRunning={isRunning} />
                </div>
                <select
                    value={shelf.stationId}
                    onChange={handleStationIdChange}
                    className="w-14 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded p-1 text-base font-bold text-brand-accent-blue appearance-none focus:outline-none focus:ring-1 focus:ring-brand-green cursor-pointer text-center"
                    aria-label={`Station ID for shelf ${shelfIndex + 1}`}
                >
                    {STATION_IDS.map(id => (
                        <option key={id} value={id} className="bg-slate-100 dark:bg-slate-900">{id || '--'}</option>
                    ))}
                </select>
            </div>

            <TimeProgressBar startTime={shelf.startTime} manualOffset={shelf.manualOffset} />
            
            {/* Bottom Row: Action Buttons */}
            <div className="grid grid-cols-3 gap-1.5">
                <button
                    onClick={handleStart}
                    disabled={isRunning}
                    className={`px-1 py-1 text-xs text-white font-bold rounded transition-colors disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed ${
                        !isRunning
                        ? 'bg-green-600 dark:bg-green-700 hover:enabled:bg-green-700 dark:hover:enabled:bg-green-600'
                        : 'bg-slate-400 dark:bg-slate-600'
                    }`}
                >
                    Start
                </button>
                 <button 
                    onClick={() => setIsEditing(true)} 
                    title="Edit time"
                    aria-label="Edit elapsed time"
                    className="px-1 py-1 text-xs bg-slate-500 dark:bg-slate-600 text-white font-bold rounded hover:bg-slate-600 dark:hover:bg-slate-500 transition-colors"
                >
                    Edit
                </button>
                <button
                    onClick={handleReset}
                    disabled={!isRunning && shelf.manualOffset === 0 && !shelf.stationId}
                    className={`px-1 py-1 text-xs text-white font-bold rounded transition-colors disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed ${
                        isRunning 
                        ? 'bg-red-600 dark:bg-red-700 hover:enabled:bg-red-700 dark:hover:enabled:bg-red-600' 
                        : 'bg-slate-500 dark:bg-slate-600 hover:enabled:bg-slate-600 dark:hover:enabled:bg-slate-500'
                    }`}
                >
                    Reset
                </button>
            </div>
            
            <EditTimeModal 
                isOpen={isEditing}
                onClose={() => setIsEditing(false)}
                onSave={handleSaveTime}
                startTime={shelf.startTime}
                currentOffset={shelf.manualOffset}
            />
        </div>
    );
};

export default ShelfCard;