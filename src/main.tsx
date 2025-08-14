import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Initialize PWA elements for camera support in web
import { defineCustomElements } from '@ionic/pwa-elements/loader';

// Call the element loader after the platform has been bootstrapped
defineCustomElements(window);

createRoot(document.getElementById("root")!).render(<App />);
