/**
 * useAnalysis Hook
 * Custom hook that encapsulates the analysis trigger logic.
 * Navigates to dashboard immediately to display the loading screen during the API call.
 */

import { useNavigate } from 'react-router-dom';
import { analyzeCompany } from '../services/apiClient';
import { useAnalysisContext } from '../context/AnalysisContext';

const useAnalysis = () => {
  const navigate = useNavigate();
  const {
    setAnalysis,
    setIsLoading,
    setError,
    setCurrentCompany,
    isLoading,
    error,
    analysisData,
    sessionId,
  } = useAnalysisContext();

  /**
   * Triggers a new company analysis and navigates to dashboard.
   * @param {string} company - Company name or ticker
   */
  const analyze = async (company) => {
    if (!company?.trim()) return;

    const companyName = company.trim();
    setCurrentCompany(companyName);
    setIsLoading(true);
    setError(null);
    
    // Navigate immediately to dashboard page so the loading screen mounts & animates
    navigate('/dashboard');

    try {
      const result = await analyzeCompany(companyName);

      if (result.success) {
        setAnalysis(result);
        setIsLoading(false);
      } else {
        setError(result.message || 'Analysis failed. Please try again.');
        setIsLoading(false);
      }
    } catch (err) {
      const message = err?.message || 'Analysis failed. Please try again.';
      setError(message);
      setIsLoading(false);
    }
  };

  return {
    analyze,
    isLoading,
    error,
    analysisData,
    sessionId,
  };
};

export default useAnalysis;
