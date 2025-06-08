
export enum SuggestionStatus {
  Pending = 'PENDING',
  Approved = 'APPROVED',
}

export interface Suggestion {
  id: string;
  text: string;
  status: SuggestionStatus;
  submittedAt: number; // Store as timestamp for sorting
}

export interface GroundingChunkWeb {
  uri: string;
  title: string;
}

export interface GroundingChunk {
  web?: GroundingChunkWeb;
  // Other types of grounding chunks can be added here if needed
}
