import React from 'react';
import ReactDOM from 'react-dom/client';
import '../../index.css';
import TodoDetailPage from './TodoDetailPage';
import { ThemeProvider } from '../../shared/ThemeContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <TodoDetailPage />
    </ThemeProvider>
  </React.StrictMode>
);
