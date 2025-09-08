
import React, { useState, useEffect } from 'react';
import { TIME_THRESHOLD_GREEN, TIME_THRESHOLD_YELLOW, TIME_THRESHOLD_RED } from '../constants';

interface TimeProgressBarProps {
    startTime: number | null;
    manualOffset: number;
}

// Use the 36-hour red threshold as the 100% mark for the progress bar.
const MAX_SECONDS = TIME_THRESHOLD_RED; 

const getBarColorClass = (totalSeconds: number): string => {
    if (totalSeconds >= TIME_THRESHOLD_RED) {
        return 'bg-red-500';
    }
    if (totalSeconds >= TIME_THRESHOLD_YELLOW) {
        return 'bg-yellow-400';
    }
    if (totalSeconds >= TIME_THRESHOLD_GREEN) {
        return 'bg-green-400';
    }
    // A neutral blue for timers that are running but haven't hit the first threshold.
    return 'bg-blue-500';
};


const TimeProgressBar: React.FC<TimeProgressBarProps> = ({ startTime, manualOffset }) => {
    const [percentage, setPercentage] = useState(0);
    const [barColorClass, setBarColorClass] = useState('bg-blue-500');

    useEffect(() => {
        const calculateAndSetState = () => {
            const safeStartTime = typeof startTime === 'number' ? startTime : null;
            const safeManualOffset = typeof manualOffset === 'number' ? manualOffset : 0;

            let totalSeconds = safeManualOffset || 0;
            if (safeStartTime) {
                const elapsed = (Date.now() - safeStartTime) / 1000;
                totalSeconds += elapsed;
            }
            
            const calculatedPercentage = Math.min((totalSeconds / MAX_SECONDS) * 100, 100);
            setPercentage(calculatedPercentage);
            setBarColorClass(getBarColorClass(totalSeconds));
        };
        
        if (startTime !== null) {
            const intervalId = setInterval(calculateAndSetState, 1000);
            calculateAndSetState(); // Initial calculation
            return () => clearInterval(intervalId);
        } else {
            // Static calculation for idle state (with potential offset)
            calculateAndSetState();
        }

    }, [startTime, manualOffset]);

    const showBar = percentage > 0;

    return (
        <div className="w-full bg-slate-300 dark:bg-slate-600 rounded-full h-1 my-1 relative">
            
            {showBar && (
                <div
                    className={`${barColorClass} h-1 rounded-full relative z-10`}
                    style={{ width: `${percentage}%`, transition: 'width 1s linear' }}
                ></div>
            )}
        </div>
    );
};

export default TimeProgressBar;
