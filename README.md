<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Burn-In Dashboard

This contains everything you need to understand & run the app locally.

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
