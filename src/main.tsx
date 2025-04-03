
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Remove any potential dark mode class that might be set by the browser
document.documentElement.classList.remove('dark');

createRoot(document.getElementById("root")!).render(<App />);
