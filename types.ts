
export interface ShelfState {
  id: string; // e.g., "rack-1-shelf-2"
  stationId: string; // e.g., "S-1", "" if empty
  startTime: number | null; // Unix timestamp in ms, or null if stopped
  manualOffset: number; // in seconds, for manual edits
}

export type DashboardState = Record<string, ShelfState[]>; // Key is rack number string
