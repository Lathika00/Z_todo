import React from 'react';
import ReactDOM from 'react-dom/client';
import '../../index.css';
import TodosPage from './TodosPage';
import { ThemeProvider } from '../../shared/ThemeContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <TodosPage />
    </ThemeProvider>
  </React.StrictMode>
);
