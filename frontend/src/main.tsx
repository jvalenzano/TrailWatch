import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App.tsx'
import './index.css'

const queryClient = new QueryClient();

console.log('[MAIN.TSX] File loaded - top of module')

try {
  console.log('[MAIN.TSX] Attempting imports...')

  async function enableMocking() {
    console.log('[MSW] enableMocking called')
    if (import.meta.env.DEV) {
      console.log('[MSW] Dev mode detected, importing worker...')
      const module = await import('./mocks/browser')
      console.log('[MSW] Module imported:', Object.keys(module))
      await module.worker.start({ onUnhandledRequest: 'bypass' })
      console.log('[MSW] Worker started successfully')
    }
  }

  console.log('[MAIN.TSX] Calling enableMocking...');
  enableMocking().then(() => {
    console.log('[MAIN.TSX] MSW enabled, rendering React...');
    createRoot(document.getElementById('root')!).render(
      <StrictMode>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </StrictMode>,
    );
  }).catch(err => {
    console.error('[MAIN.TSX] enableMocking failed:', err);
    document.body.innerHTML = '<h1>MSW Failed: ' + err.message + '</h1>';
  });


} catch (syncError) {
  console.error('[MAIN.TSX] Synchronous error:', syncError)
  document.body.innerHTML = '<h1>Sync Error: ' + syncError.message + '</h1>'
}
