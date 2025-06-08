
import React from 'react';
import { Suggestion, SuggestionStatus } from '../types';
import CheckIcon from './icons/CheckIcon';
import TrashIcon from './icons/TrashIcon';

interface SuggestionItemProps {
  suggestion: Suggestion;
  isAdminView: boolean;
  onApprove?: (id: string) => void;
  onDelete?: (id: string) => void;
  isProcessing?: boolean;
}

const SuggestionItem: React.FC<SuggestionItemProps> = ({ suggestion, isAdminView, onApprove, onDelete, isProcessing }) => {
  const { id, text, status, submittedAt } = suggestion;

  const getStatusBadge = () => {
    switch (status) {
      case SuggestionStatus.Approved:
        return <span className="px-3 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full">Approved</span>;
      case SuggestionStatus.Pending:
        return <span className="px-3 py-1 text-xs font-semibold text-yellow-700 bg-yellow-100 rounded-full">Pending</span>;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 ease-in-out mb-4">
      <p className="text-slate-700 text-lg mb-3 break-words whitespace-pre-wrap">{text}</p>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm text-slate-500">
        <span className="mb-2 sm:mb-0">Submitted: {new Date(submittedAt).toLocaleDateString()}</span>
        {isAdminView && getStatusBadge()}
      </div>
      {isAdminView && onApprove && onDelete && (
        <div className="mt-4 pt-4 border-t border-slate-200 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          {status === SuggestionStatus.Pending && (
            <button
              onClick={() => onApprove(id)}
              disabled={isProcessing}
              className="flex items-center justify-center w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow transition duration-150 ease-in-out disabled:opacity-50"
            >
              <CheckIcon className="mr-2" /> Approve
            </button>
          )}
          <button
            onClick={() => onDelete(id)}
            disabled={isProcessing}
            className="flex items-center justify-center w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow transition duration-150 ease-in-out disabled:opacity-50"
          >
            <TrashIcon className="mr-2" /> Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default SuggestionItem;
