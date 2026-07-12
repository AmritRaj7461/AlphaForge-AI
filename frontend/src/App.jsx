/**
 * App.jsx — Root application component.
 * Sets up React Router and wraps everything in AnalysisProvider context.
 */

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnalysisProvider } from './context/AnalysisContext';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';

const App = () => {
  return (
    <BrowserRouter>
      <AnalysisProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          {/* Catch-all: redirect to landing */}
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </AnalysisProvider>
    </BrowserRouter>
  );
};

export default App;
