/**
 * Analysis Context
 * Global state management for company analysis data.
 * Allows all dashboard components to access analysis results without prop drilling.
 */

import React, { createContext, useContext, useState } from 'react';

const AnalysisContext = createContext(null);

export const AnalysisProvider = ({ children }) => {
  const [analysisData, setAnalysisData] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentCompany, setCurrentCompany] = useState('');

  const setAnalysis = (data) => {
    setAnalysisData(data);
    setSessionId(data?.sessionId || null);
    setError(null);
  };

  const clearAnalysis = () => {
    setAnalysisData(null);
    setSessionId(null);
    setError(null);
    setCurrentCompany('');
  };

  return (
    <AnalysisContext.Provider
      value={{
        analysisData,
        sessionId,
        isLoading,
        error,
        currentCompany,
        setAnalysis,
        setIsLoading,
        setError,
        setCurrentCompany,
        clearAnalysis,
      }}
    >
      {children}
    </AnalysisContext.Provider>
  );
};

export const useAnalysisContext = () => {
  const ctx = useContext(AnalysisContext);
  if (!ctx) {
    throw new Error('useAnalysisContext must be used inside AnalysisProvider');
  }
  return ctx;
};

export default AnalysisContext;
