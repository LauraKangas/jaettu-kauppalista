import React from 'react'; 
import ReactDOM from 'react-dom/client';
import './index.css'; 
import App from './App'; 
import { SnackbarProvider } from 'notistack';  
/**
 * The entry point of the React application, responsible for rendering the main component and setting up global providers.
 * 
 * ### Features:
 * - Integrates the `SnackbarProvider` from the `notistack` library to handle global notifications.
 * - Wraps the application in `React.StrictMode` to enforce best practices and catch potential issues.
 * - Applies global CSS styling from `index.css`.
 *
 * ### Libraries Used:
 * - **React**: To render components and manage application state.
 * - **ReactDOM**: To render the root component into the DOM.
 * - **notistack**: To provide a flexible notification system across the application.
 *
 * @returns {void} Renders the root component into the DOM element with id `root`.
 */
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SnackbarProvider maxSnack={3}>  
      <App />
    </SnackbarProvider>
  </React.StrictMode>
);
