import React, { useState, useEffect, useRef, useCallback } from 'react';

interface EditTimeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (newTotalSeconds: number) => void;
    startTime: number | null;
    currentOffset: number;
}

const parseTotalSeconds = (totalSeconds: number): {h: string, m: string, s: string} => {
    if (totalSeconds < 0) totalSeconds = 0;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return {
        h: hours.toString().padStart(2, '0'),
        m: minutes.toString().padStart(2, '0'),
        s: seconds.toString().padStart(2, '0'),
    };
};

const EditTimeModal: React.FC<EditTimeModalProps> = ({ isOpen, onClose, onSave, startTime, currentOffset }) => {
    const [hours, setHours] = useState('00');
    const [minutes, setMinutes] = useState('00');
    
    const hoursInputRef = useRef<HTMLInputElement>(null);
    const minutesInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            let totalSeconds = currentOffset;
            if (startTime) {
                const elapsed = (Date.now() - startTime) / 1000;
                totalSeconds = elapsed + currentOffset;
            }
            const { h, m } = parseTotalSeconds(totalSeconds);
            setHours(h);
            setMinutes(m);

            // Timeout ensures the element is rendered before we try to focus it
            setTimeout(() => {
                hoursInputRef.current?.focus();
                hoursInputRef.current?.select();
            }, 100);
        }
    }, [isOpen, startTime, currentOffset]);

    const handleSave = useCallback(() => {
        const h = parseInt(hours, 10) || 0;
        const m = parseInt(minutes, 10) || 0;
        const totalSeconds = h * 3600 + m * 60;
        onSave(totalSeconds);
    }, [hours, minutes, onSave]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSave();
        }
    }, [handleSave]);

    const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/[^0-9]/g, '');
        setHours(val.slice(-2));
        if (val.length >= 2) {
            minutesInputRef.current?.focus();
            minutesInputRef.current?.select();
        }
    };

    const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/[^0-9]/g, '');
        setMinutes(val.slice(-2));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={onClose}>
            <div 
                className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-4 w-full max-w-xs border border-slate-200 dark:border-slate-600" 
                onClick={e => e.stopPropagation()}
                onKeyDown={handleKeyDown}
            >
                <h2 className="text-base font-bold mb-3 text-brand-accent-blue">Edit Elapsed Time</h2>
                <div className="flex items-center justify-center gap-1 font-mono text-3xl mb-4">
                    <input ref={hoursInputRef} type="text" value={hours} onChange={handleHoursChange} className="w-20 bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-center rounded focus:outline-none focus:ring-2 focus:ring-brand-green p-1" />
                    <span className="text-slate-900 dark:text-slate-100">:</span>
                    <input ref={minutesInputRef} type="text" value={minutes} onChange={handleMinutesChange} className="w-20 bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-center rounded focus:outline-none focus:ring-2 focus:ring-brand-green p-1" />
                </div>
                <div className="flex justify-end gap-2">
                    <button onClick={onClose} className="px-3 py-1 text-xs bg-slate-400 dark:bg-slate-600 text-white font-semibold rounded-lg hover:bg-slate-500 dark:hover:bg-slate-500 transition-colors">
                        Cancel
                    </button>
                    <button onClick={handleSave} className="px-3 py-1 text-xs bg-brand-green text-white font-semibold rounded-lg hover:bg-brand-green/80 transition-colors">
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditTimeModal;