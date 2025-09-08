import React, { useState, useEffect } from 'react';
import type { ShelfState } from '../types';
import TimerDisplay from './TimerDisplay';
import TimeProgressBar from './TimeProgressBar';

interface ShelfRowProps {
    shelf: ShelfState;
    rackNumber: number;
    shelfIndex: number;
}

const ShelfRow: React.FC<ShelfRowProps> = ({ shelf, rackNumber, shelfIndex }) => {
    const isRunning = shelf.startTime !== null;
    const [cardBg, setCardBg] = useState('bg-slate-200/50 dark:bg-slate-700/50 border-slate-300 dark:border-slate-600');

    useEffect(() => {
        if (isRunning) {
            setCardBg('bg-blue-100/60 dark:bg-blue-900/60 border-blue-300 dark:border-blue-500/60');
        } else {
            setCardBg('bg-slate-200/50 dark:bg-slate-700/50 border-slate-300 dark:border-slate-600');
        }
    }, [isRunning]);
    
    return (
        <div className={`p-1.5 rounded-lg border ${cardBg} flex flex-col justify-between h-full min-h-[5rem]`}>
            {/* Top row: Rack/Shelf label and Station ID */}
            <div className="flex justify-between items-baseline">
                {/* Larger font for the label */}
                <span className="font-bold text-base text-slate-700 dark:text-slate-200">Rack {rackNumber} - {shelfIndex + 1}</span>
                <span className="font-mono text-base bg-slate-100 dark:bg-slate-900/50 px-1.5 py-0.5 rounded text-brand-accent-blue">
                    {shelf.stationId || '--'}
                </span>
            </div>

            {/* Middle row: Timer, centered vertically and horizontally */}
            <div className="flex-grow flex items-center justify-center font-mono text-2xl text-slate-900 dark:text-slate-50 tracking-wider">
                <TimerDisplay startTime={shelf.startTime} manualOffset={shelf.manualOffset} isRunning={isRunning} />
            </div>
            
            {/* Bottom row: Progress bar */}
            <TimeProgressBar startTime={shelf.startTime} manualOffset={shelf.manualOffset} />
        </div>
    );
};

export default ShelfRow;