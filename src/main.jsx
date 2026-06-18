import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
const appRoot = rootElement.__reactRoot ?? createRoot(rootElement);
rootElement.__reactRoot = appRoot;
appRoot.render(<App />);
