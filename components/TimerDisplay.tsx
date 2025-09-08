
import React, { useState, useEffect } from 'react';
import { TIME_THRESHOLD_GREEN, TIME_THRESHOLD_YELLOW, TIME_THRESHOLD_RED } from '../constants';

interface TimerDisplayProps {
    startTime: number | null;
    manualOffset: number;
    isRunning: boolean;
}

const formatTime = (totalSeconds: number): string => {
    if (totalSeconds < 0) totalSeconds = 0;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    return [hours, minutes]
        .map(v => v.toString().padStart(2, '0'))
        .join(':');
};

const getTimerColorClass = (totalSeconds: number): string => {
    if (totalSeconds >= TIME_THRESHOLD_RED) {
        return 'text-red-500';
    }
    if (totalSeconds >= TIME_THRESHOLD_YELLOW) {
        return 'text-yellow-500 dark:text-yellow-400';
    }
    if (totalSeconds >= TIME_THRESHOLD_GREEN) {
        return 'text-green-500 dark:text-green-400';
    }
    return 'text-slate-900 dark:text-slate-50'; // default color
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({ startTime, manualOffset, isRunning }) => {
    const [displayTime, setDisplayTime] = useState('00:00');
    const [colorClass, setColorClass] = useState('text-slate-900 dark:text-slate-50');

    useEffect(() => {
        const safeStartTime = typeof startTime === 'number' ? startTime : null;
        const safeManualOffset = typeof manualOffset === 'number' ? manualOffset : 0;

        if (!isRunning || safeStartTime === null) {
            // Timer is not running. Display the offset time if it exists.
            const totalSeconds = safeManualOffset || 0;
            setDisplayTime(formatTime(totalSeconds));
            setColorClass(getTimerColorClass(totalSeconds));
            return; // No interval needed.
        }

        const calculateTime = () => {
            const elapsed = (Date.now() - safeStartTime) / 1000;
            const totalSeconds = elapsed + safeManualOffset;
            setDisplayTime(formatTime(totalSeconds));
            setColorClass(getTimerColorClass(totalSeconds));
        };
        
        const intervalId = setInterval(calculateTime, 1000);

        calculateTime(); // Initial calculation

        return () => clearInterval(intervalId);
    }, [startTime, manualOffset, isRunning]);
    
    return <span className={colorClass}>{displayTime}</span>;
};

export default TimerDisplay;