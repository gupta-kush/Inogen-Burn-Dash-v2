
import React from 'react';
import type { ShelfState } from '../types';
import ShelfCard from './ShelfCard';

interface RackProps {
    rackNumber: number;
    shelves: ShelfState[];
    onUpdateShelf: (shelf: ShelfState) => void;
}

const Rack: React.FC<RackProps> = ({ rackNumber, shelves, onUpdateShelf }) => {
    return (
        <div className="bg-slate-100/80 dark:bg-slate-800/50 rounded-lg shadow-xl p-2 flex flex-col gap-1.5 border border-slate-200 dark:border-slate-700 flex-shrink-0 w-48">
            <h2 className="text-base font-bold text-center text-brand-accent-blue border-b border-slate-200 dark:border-slate-700 pb-1 mb-1">
                Rack {rackNumber}
            </h2>
            <div className="flex flex-col gap-1.5">
                {shelves.map((shelf, index) => (
                    <ShelfCard 
                        key={shelf.id}
                        shelf={shelf}
                        shelfIndex={index}
                        onUpdateShelf={onUpdateShelf}
                    />
                ))}
            </div>
        </div>
    );
};

export default Rack;