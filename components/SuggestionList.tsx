
import React from 'react';
import { Suggestion, SuggestionStatus } from '../types';
import SuggestionItem from './SuggestionItem';

interface SuggestionListProps {
  suggestions: Suggestion[];
  isAdminView: boolean;
  onApprove?: (id: string) => void;
  onDelete?: (id: string) => void;
  processingSuggestionId?: string | null;
}

const SuggestionList: React.FC<SuggestionListProps> = ({ suggestions, isAdminView, onApprove, onDelete, processingSuggestionId }) => {
  const filteredSuggestions = isAdminView 
    ? suggestions 
    : suggestions.filter(s => s.status === SuggestionStatus.Approved);

  if (filteredSuggestions.length === 0) {
    return (
      <div className="text-center py-10">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-slate-400 mx-auto mb-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0-2.51 2.225.569-2.474m0 0L9.108 16.6m0 0L9.108 12l5.714 5.062z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 4.5h.008v.008H12v-.008Z" />
        </svg>
        <p className="text-xl text-slate-500">
          {isAdminView ? 'No suggestions yet.' : 'No approved suggestions to display yet. Be the first to add one!'}
        </p>
      </div>
    );
  }
  
  const sortedSuggestions = [...filteredSuggestions].sort((a, b) => b.submittedAt - a.submittedAt);


  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-slate-700 mb-4">
        {isAdminView ? 'All Suggestions' : 'Approved Suggestions'}
      </h2>
      {sortedSuggestions.map(suggestion => (
        <SuggestionItem
          key={suggestion.id}
          suggestion={suggestion}
          isAdminView={isAdminView}
          onApprove={onApprove}
          onDelete={onDelete}
          isProcessing={processingSuggestionId === suggestion.id}
        />
      ))}
    </div>
  );
};

export default SuggestionList;
