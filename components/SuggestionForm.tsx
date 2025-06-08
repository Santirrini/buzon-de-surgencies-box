
import React, { useState } from 'react';

interface SuggestionFormProps {
  onSubmit: (text: string) => void;
  isLoading: boolean;
}

const SuggestionForm: React.FC<SuggestionFormProps> = ({ onSubmit, isLoading }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !isLoading) {
      onSubmit(text.trim());
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg mb-8">
      <h2 className="text-2xl font-semibold text-slate-700 mb-4">Got a Suggestion?</h2>
      <p className="text-slate-600 mb-4">Share your ideas with us! Your suggestion will be reviewed by an administrator before being published.</p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your suggestion here..."
        rows={4}
        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-150 ease-in-out mb-4"
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={isLoading || !text.trim()}
        className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-4 rounded-lg shadow transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Submitting...
          </>
        ) : (
          'Submit Suggestion'
        )}
      </button>
    </form>
  );
};

export default SuggestionForm;
