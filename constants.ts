export const NUM_SHELVES_PER_RACK = 4;
export const FIREBASE_DB_PATH = 'dashboardState';

export const STATION_IDS = ['', 'S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7'];
export const TIME_THRESHOLD_RED = 36 * 60 * 60; // 36 hours in seconds
export const TIME_THRESHOLD_YELLOW = 18 * 60 * 60; // 18 hours in seconds
export const TIME_THRESHOLD_GREEN = 12 * 60 * 60; // 12 hours in seconds

const generateRackNumbers = (start: number, end: number): number[] => {
    const racks = [];
    for (let i = start; i <= end; i++) {
        racks.push(i);
    }
    return racks;
}

export const FACILITY_LAYOUT = [
    { name: 'Line 2', racks: generateRackNumbers(21, 27) },
    { name: 'Line 3', racks: generateRackNumbers(31, 37) },
    { name: 'Line 4', racks: generateRackNumbers(41, 47) },
    { name: 'Line 5', racks: generateRackNumbers(51, 58) },
    { name: 'Line 6', racks: generateRackNumbers(61, 66) },
    { name: 'Line 7', racks: generateRackNumbers(71, 78) },
    { name: 'Repair', racks: generateRackNumbers(91, 93) },
];