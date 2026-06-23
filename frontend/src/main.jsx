import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';
import App from './App';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Unregister service worker and clear caches to force clean, uncached load
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (let registration of registrations) {
      registration.unregister().then((success) => {
        if (success) console.log('SW Unregistered successfully');
      });
    }
  });
}
if ('caches' in window) {
  caches.keys().then((names) => {
    for (let name of names) {
      caches.delete(name);
    }
  });
}

// Listen for Vite dynamic import preload errors (e.g. hash mismatched chunks after deployment)
window.addEventListener('vite:preloadError', (event) => {
  console.warn('Vite preload error detected, reloading page to fetch latest chunks...', event);
  window.location.reload();
});

// Fallback for general dynamic import errors
window.addEventListener('error', (event) => {
  const errorText = event.message || '';
  if (errorText.includes('Failed to fetch dynamically imported module') || errorText.includes('Importing a module script failed')) {
    console.warn('Dynamic import failure detected, forcing page reload...', event);
    window.location.reload();
  }
}, true);

createRoot(document.getElementById('root')).render(

  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
