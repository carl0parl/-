import React from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource-variable/bricolage-grotesque';
import '@fontsource-variable/dm-sans';
import '@fontsource-variable/jetbrains-mono';
import './index.css';
import App from './App';
import { initNative } from './native';

initNative();
ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
