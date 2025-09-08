<div align="center">
<img width="200" height="75" alt="inogen-logo" src="https://github.com/user-attachments/assets/fd817db8-7fc1-494b-ba96-1f086bad6b13" />
</div>

# Burn-In Dashboard

A real-time, multi-user dashboard for tracking the elapsed time for devices being tested on a series of racks and shelves. Features an interactive view for operators and a dense, read-only TV view for floor displays.

## Features

- **Real-time Multi-user Sync**: Changes are instantly synchronized across all connected devices using Firebase Realtime Database
- **Interactive Dashboard**: Full control interface for operators to start/stop timers, edit elapsed times, and assign station IDs
- **TV/Compact View**: Dense, read-only display optimized for wall-mounted monitors and floor displays
- **Manual Time Editing**: Easily adjust elapsed times with a modal interface (hours:minutes format)
- **Light/Dark Theme**: Toggle between light and dark modes with automatic preference saving
- **Progress Indicators**: Visual progress bars and color-coded timers (green/yellow/red thresholds)
- **Station Management**: Assign and track station IDs for each shelf position
- **Bulk Operations**: "Reset All" button to quickly clear all timers and station assignments
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Facility Layout**: Organized by production lines (Line 2-7, Repair) with configurable rack numbers
- **Persistent State**: All data persists across browser sessions and device restarts

## Run Locally

**Prerequisites:**  Node.js v18+

1. **Install dependencies:**
   `npm install`
2. **Run the app:**
   `npm run dev`

---

## Technical Documentation

### Technologies Used

*   **Frontend:** [React](https://reactjs.org/) (with Hooks) for building the user interface.
*   **Build Tool:** [Vite](https://vitejs.dev/) for fast local development and optimized builds.
*   **Backend & Real-time Sync:** [Firebase Realtime Database](https://firebase.google.com/docs/database) to store the dashboard state and automatically synchronize it across all connected clients.
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/) for utility-first styling.
*   **Routing:** [React Router](https://reactrouter.com/) for handling the different pages (`/` for interactive view and `/compact` for compact view).

### Program Flow

The application is designed around a centralized state management model that syncs with Firebase.

1.  **Initialization:**
    *   The root `App.tsx` component is the main entry point.
    *   It uses the custom `useFirebaseState` hook to establish a real-time connection to the Firebase Realtime Database at the `dashboardState` path.
    *   This hook is responsible for fetching the initial state, listening for updates, and sending local changes back to Firebase.

2.  **State Management:**
    *   The entire dashboard state (all racks and shelves) is held within the `App.tsx` component.
    *   This state is passed down as props to the `InteractiveDashboard` component.
    *   Functions to update the state (like `handleUpdateShelf` and `handleResetAll`) are also located in `App.tsx` and passed down.

3.  **User Interaction:**
    *   The `InteractiveDashboard` displays `Rack` components, which in turn display individual `ShelfCard` components.
    *   When a user interacts with a button on a `ShelfCard` (e.g., "Start", "Reset"), it calls an `onUpdateShelf` function that was passed down from the `InteractiveDashboard`.
    *   This function creates a new state for that shelf and triggers the main `setDashboardState` function in `App.tsx`.

4.  **Data Sync:**
    *   Calling `setDashboardState` updates the local React state for an instant UI change.
    *   Simultaneously, the `useFirebaseState` hook sends this updated state object to the Firebase Realtime Database.
    *   Firebase then automatically pushes the new state to *all* connected clients, ensuring every user's view is synchronized in real-time.
