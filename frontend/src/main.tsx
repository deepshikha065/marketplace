import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Toaster } from 'react-hot-toast';
import "./NiceRegistry.tsx";
import './index.scss'
import App from './App.tsx'
import NiceModal from '@ebay/nice-modal-react';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NiceModal.Provider>
      <Toaster position="top-center" />
      <App />
    </NiceModal.Provider>
  </StrictMode>
)
