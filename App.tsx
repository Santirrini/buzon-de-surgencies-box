
import React, { useState, useEffect, useCallback } from 'react';
import { Suggestion, SuggestionStatus } from './types';
import { LOCAL_STORAGE_KEY_ADMIN_TOKEN, API_BASE_URL } from './constants';
import Header from './components/Header';
import SuggestionForm from './components/SuggestionForm';
import SuggestionList from './components/SuggestionList';
import AdminLoginModal from './components/AdminLoginModal';
import ConfirmationModal from './components/ConfirmationModal';

// Mock process.env.API_KEY for Gemini API (not used in this version but good for future)
if (typeof process === 'undefined') {
  // @ts-ignore
  globalThis.process = { env: { API_KEY: "YOUR_API_KEY_HERE_IF_NEEDED" } };
} else if (!process.env) {
  // @ts-ignore
  process.env = { API_KEY: "YOUR_API_KEY_HERE_IF_NEEDED" };
} else if (!process.env.API_KEY) {
  process.env.API_KEY = "YOUR_API_KEY_HERE_IF_NEEDED";
}

const App: React.FC = () => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [showAdminLoginModal, setShowAdminLoginModal] = useState<boolean>(false);
  const [adminLoginError, setAdminLoginError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState<boolean>(true);
  const [isProcessingAction, setIsProcessingAction] = useState<boolean>(false);
  const [processingSuggestionId, setProcessingSuggestionId] = useState<string | null>(null);

  const [showConfirmationModal, setShowConfirmationModal] = useState<boolean>(false);
  const [confirmationAction, setConfirmationAction] = useState<(() => Promise<void>) | null>(null);
  const [confirmationTitle, setConfirmationTitle] = useState<string>('');
  const [confirmationMessage, setConfirmationMessage] = useState<string>('');
  const [apiError, setApiError] = useState<string | null>(null);

  // JULES_BACKEND_INTEGRATION: This function wraps all API calls.
  // Ensure your backend expects 'Content-Type: application/json' and
  // uses Bearer tokens for authorization where specified.
  const fetchApi = useCallback(async (url: string, options: RequestInit = {}, tokenOverride?: string | null) => {
    const currentToken = tokenOverride !== undefined ? tokenOverride : adminToken;
    const headers = new Headers(options.headers || {});
    
    if (!(options.body instanceof FormData)) { // Don't set Content-Type for FormData
        headers.append('Content-Type', 'application/json');
    }

    if (currentToken) {
      headers.append('Authorization', `Bearer ${currentToken}`);
    }

    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          errorData = { message: `HTTP error ${response.status}: ${response.statusText || 'Server error'}` };
        }
        const error = new Error(errorData.message || `Request failed with status ${response.status}`);
        // @ts-ignore
        error.response = response;
        // @ts-ignore
        error.data = errorData;
        throw error;
      }

      if (response.status === 204) { // No Content
        return null;
      }
      return response.json();
    } catch (error) {
      console.error(`API call to ${API_BASE_URL}${url} failed:`, error);
      throw error; // Re-throw to be caught by calling function
    }
  }, [adminToken]);


  const loadSuggestions = useCallback(async (tokenForFetch?: string | null) => {
    setIsLoadingSuggestions(true);
    setApiError(null);
    try {
      const currentToken = tokenForFetch !== undefined ? tokenForFetch : adminToken;
      const endpoint = currentToken ? '/suggestions/admin' : '/suggestions/public';
      
      // JULES_BACKEND_INTEGRATION: GET ${API_BASE_URL}${endpoint}
      // Expects: Suggestion[]
      // If admin: all suggestions. If public: only approved suggestions.
      const data = await fetchApi(endpoint, {}, currentToken);
      setSuggestions(Array.isArray(data) ? data.sort((a,b) => b.submittedAt - a.submittedAt) : []);
    } catch (error: any) {
      console.error("Failed to load suggestions:", error);
      setApiError(`Failed to load suggestions: ${error.message}. Please try again later.`);
      setSuggestions([]); // Clear suggestions on error
    } finally {
      setIsLoadingSuggestions(false);
    }
  }, [fetchApi, adminToken]);

  useEffect(() => {
    const storedToken = localStorage.getItem(LOCAL_STORAGE_KEY_ADMIN_TOKEN);
    if (storedToken) {
      setAdminToken(storedToken);
      setIsAdminLoggedIn(true);
      // JULES_BACKEND_INTEGRATION: Consider adding a /auth/verify endpoint here
      // to validate the stored token against the backend upon initial load.
      // For now, we assume the token is valid if present and `loadSuggestions`
      // for admin will fail if it's not, gracefully degrading.
      loadSuggestions(storedToken);
    } else {
      loadSuggestions(null); // Load public suggestions
    }
  }, [loadSuggestions]); // adminToken is not needed here as loadSuggestions gets it directly or via param


  const handleSuggestionSubmit = useCallback(async (text: string) => {
    setIsSubmitting(true);
    setApiError(null);
    try {
      // JULES_BACKEND_INTEGRATION: POST ${API_BASE_URL}/suggestions
      // Body: { text: string }
      // Expects: Suggestion (the newly created suggestion)
      await fetchApi('/suggestions', {
        method: 'POST',
        body: JSON.stringify({ text }),
      });
      loadSuggestions(adminToken); // Reload suggestions to see the new one
    } catch (error: any) {
      console.error("Failed to submit suggestion:", error);
      setApiError(`Failed to submit suggestion: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  }, [fetchApi, adminToken, loadSuggestions]);

  const handleAdminLogin = useCallback(async (password: string) => {
    setAdminLoginError(null);
    setIsProcessingAction(true);
    setApiError(null);
    try {
      // JULES_BACKEND_INTEGRATION: POST ${API_BASE_URL}/auth/login
      // Body: { password: string }
      // Expects: { token: string }
      const data = await fetchApi('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ password }),
      });
      if (data && data.token) {
        localStorage.setItem(LOCAL_STORAGE_KEY_ADMIN_TOKEN, data.token);
        setAdminToken(data.token);
        setIsAdminLoggedIn(true);
        setShowAdminLoginModal(false);
        await loadSuggestions(data.token);
      } else {
        setAdminLoginError('Login failed. Invalid response from server.');
      }
    } catch (error: any) {
      console.error("Admin login failed:", error);
      setAdminLoginError(error.message || 'Incorrect password or server error. Please try again.');
    } finally {
      setIsProcessingAction(false);
    }
  }, [fetchApi, loadSuggestions]);

  const handleAdminLogout = useCallback(async () => {
    setApiError(null);
    // JULES_BACKEND_INTEGRATION: POST ${API_BASE_URL}/auth/logout (Optional)
    // This endpoint would invalidate the token on the server-side.
    // Body: (empty or token, depending on backend implementation)
    // Expects: 200 OK or 204 No Content
    try {
      if (adminToken) { // Only call logout API if a token exists
        await fetchApi('/auth/logout', { method: 'POST' }, adminToken);
      }
    } catch (error: any) {
      console.warn("Admin logout API call failed (or was not implemented):", error.message);
      // Proceed with client-side logout even if API call fails
    } finally {
      localStorage.removeItem(LOCAL_STORAGE_KEY_ADMIN_TOKEN);
      setAdminToken(null);
      setIsAdminLoggedIn(false);
      await loadSuggestions(null); // Reload as public user
    }
  }, [fetchApi, loadSuggestions, adminToken]); 

  const handleApproveSuggestion = useCallback(async (id: string) => {
    setProcessingSuggestionId(id);
    setIsProcessingAction(true);
    setApiError(null);
    try {
      // JULES_BACKEND_INTEGRATION: PUT ${API_BASE_URL}/suggestions/admin/:id/approve
      // Body: (empty)
      // Expects: Suggestion (the updated suggestion) or 200 OK / 204 No Content
      await fetchApi(`/suggestions/admin/${id}/approve`, { 
        method: 'PUT',
      });
      await loadSuggestions(adminToken);
    } catch (error: any) {
      console.error(`Failed to approve suggestion ${id}:`, error);
      setApiError(`Failed to approve suggestion ${id}: ${error.message}`);
    } finally {
      setIsProcessingAction(false);
      setProcessingSuggestionId(null);
    }
  }, [fetchApi, loadSuggestions, adminToken]);

  const handleDeleteSuggestion = useCallback((id: string) => {
    setConfirmationTitle('Delete Suggestion');
    setConfirmationMessage('Are you sure you want to delete this suggestion? This action cannot be undone.');
    setConfirmationAction(() => async () => {
      setProcessingSuggestionId(id);
      setIsProcessingAction(true);
      setApiError(null);
      try {
        // JULES_BACKEND_INTEGRATION: DELETE ${API_BASE_URL}/suggestions/admin/:id
        // Expects: 200 OK or 204 No Content
        await fetchApi(`/suggestions/admin/${id}`, {
          method: 'DELETE',
        });
        await loadSuggestions(adminToken);
        setShowConfirmationModal(false);
      } catch (error: any) {
        console.error(`Failed to delete suggestion ${id}:`, error);
        // Update confirmation message on error, so user can retry or close
        setConfirmationMessage(`Failed to delete suggestion: ${error.message}. Please try again or cancel.`);
        // Don't close modal automatically on error, allow retry from modal
      } finally {
        setIsProcessingAction(false); // Make sure this is always reset
        setProcessingSuggestionId(null); // And this
        // setShowConfirmationModal(false); // Only close on success
      }
    });
    setShowConfirmationModal(true);
  }, [fetchApi, loadSuggestions, adminToken]);
  
  const closeConfirmationModal = () => {
    setShowConfirmationModal(false);
    setConfirmationAction(null);
     // Reset message to default only when closing manually, not on error retry
    setConfirmationMessage('Are you sure you want to delete this suggestion? This action cannot be undone.');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header
        isAdminLoggedIn={isAdminLoggedIn}
        onAdminLoginClick={() => { setShowAdminLoginModal(true); setAdminLoginError(null); }}
        onAdminLogoutClick={handleAdminLogout}
      />
      <main className="flex-grow container mx-auto p-4 sm:p-6 md:p-8">
        {apiError && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md relative mb-6 shadow" role="alert">
            <div className="flex">
              <div className="py-1"><svg className="fill-current h-6 w-6 text-red-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07ZM9 5v6h2V5H9Zm0 8v2h2v-2H9Z"/></svg></div>
              <div>
                <p className="font-bold">Error Occurred</p>
                <p className="text-sm">{apiError}</p>
              </div>
            </div>
            <button
              onClick={() => setApiError(null)}
              className="absolute top-0 bottom-0 right-0 px-4 py-3 text-red-500 hover:text-red-700"
              aria-label="Close error message"
            >
              <svg className="fill-current h-6 w-6" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
            </button>
          </div>
        )}

        {(!isAdminLoggedIn || (isAdminLoggedIn && showAdminLoginModal)) &&
           <div className="mb-12 max-w-2xl mx-auto">
            <SuggestionForm onSubmit={handleSuggestionSubmit} isLoading={isSubmitting} />
           </div>
        }
        
        {isLoadingSuggestions ? (
          <div className="text-center py-10">
            <svg className="animate-spin h-10 w-10 text-sky-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-slate-500 mt-4 text-lg">Loading suggestions...</p>
          </div>
        ) : (
          <SuggestionList
            suggestions={suggestions}
            isAdminView={isAdminLoggedIn}
            onApprove={isAdminLoggedIn ? handleApproveSuggestion : undefined}
            onDelete={isAdminLoggedIn ? handleDeleteSuggestion : undefined}
            processingSuggestionId={processingSuggestionId}
          />
        )}
      </main>

      <footer className="bg-slate-800 text-slate-300 text-center p-6 mt-auto shadow-inner">
        <p className="text-sm">&copy; {new Date().getFullYear()} Suggestion Box App. Ready for Backend Integration.</p>
      </footer>

      <AdminLoginModal
        isOpen={showAdminLoginModal}
        onClose={() => { setShowAdminLoginModal(false); setAdminLoginError(null); }}
        onLogin={handleAdminLogin}
        error={adminLoginError}
        isLoading={isProcessingAction && showAdminLoginModal} 
      />

      <ConfirmationModal
        isOpen={showConfirmationModal}
        onClose={closeConfirmationModal}
        onConfirm={async () => {
          if (confirmationAction) {
            await confirmationAction();
            // Note: Modal closing is handled within confirmationAction on success
            // or by closeConfirmationModal if user cancels.
          }
        }}
        title={confirmationTitle}
        message={confirmationMessage}
        isLoading={isProcessingAction && showConfirmationModal}
      />
    </div>
  );
};

export default App;
