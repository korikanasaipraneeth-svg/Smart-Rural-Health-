# Modernizing the UI: Charts, Notifications, and Loaders

The goal is to elevate the user experience by replacing static data with interactive visualizations, adding modern popup notifications, and smoothing out data loading states.

## User Review Required
> [!IMPORTANT]
> The following features will be added across the application. Please review and approve these enhancements before I proceed with the implementation.

## Proposed Changes

### 1. Interactive Data Visualizations
We will install and configure `recharts` to add beautiful, animated charts to your dashboards.
- **Admin Dashboard**: Add a Line Chart tracking user growth (patients/doctors over time) and a Pie Chart showing the distribution of hospital types.
- **Hospital Dashboard**: Add a Bar Chart showing appointment traffic over the week and bed availability metrics.

### 2. Global Toast Notifications
We will install `react-hot-toast` to replace any basic text alerts or browser alerts with sleek, animated popup notifications that appear seamlessly on the screen (e.g., when a user logs in, when a hospital updates its status, or when an error occurs).
- Add the `<Toaster />` component to the root `App.jsx`.
- Update API success/error handling in the auth pages and dashboards to trigger these toasts.

### 3. Skeleton Loaders
Instead of showing a blank screen or a plain text "Loading...", we will add modern "Skeleton" UI blocks that pulse gently while data is being fetched from the backend. This gives the application a highly premium feel.

## Verification Plan
1. Ensure the frontend builds successfully after installing the new dependencies.
2. Run the application and navigate to the Admin and Hospital dashboards to verify the charts render correctly with dynamic data and respect the dark mode toggle.
3. Test a login flow to verify that the new Toast notifications appear correctly.
