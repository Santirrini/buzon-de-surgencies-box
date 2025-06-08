import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import crypto from 'crypto'; // Needed if initializing sample data with UUIDs here

// Import types
import { Suggestion, SuggestionStatus } from './types';

// Import routers
import authRoutes from './routes/auth';
import suggestionRoutes from './routes/suggestions';

const app: Application = express();
const PORT = process.env.PORT || 3001;

// --- Centralized Data Store ---
// Admin password (export for use in auth routes)
export const ADMIN_PASSWORD = "admin123";

// In-memory store for suggestions (export for use in suggestion routes)
export let suggestionsStore: Suggestion[] = [
  // Sample data for initial testing
  {
    id: crypto.randomUUID(),
    text: "Welcome! This is an approved suggestion.",
    status: SuggestionStatus.APPROVED,
    submittedAt: Date.now() - 200000
  },
  {
    id: crypto.randomUUID(),
    text: "Please review this new idea (pending).",
    status: SuggestionStatus.PENDING,
    submittedAt: Date.now() - 100000
  },
];
// --- End Centralized Data Store ---

// Middleware
app.use(cors()); // Default CORS configuration
app.use(express.json()); // To parse JSON request bodies

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/suggestions', suggestionRoutes);

// Root API endpoint
app.get('/api', (req: Request, res: Response) => {
  res.json({ message: 'Suggestion Box API is running!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log('Admin password (for testing):', ADMIN_PASSWORD);
  console.log(`Initial suggestions count: ${suggestionsStore.length}`);
});

// No default export needed if server.ts is the main entry point and not imported elsewhere for 'app'
