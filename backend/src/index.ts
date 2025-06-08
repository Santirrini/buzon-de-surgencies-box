import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import suggestionRoutes from './routes/suggestion.routes';
import adminSuggestionRoutes from './routes/admin.suggestion.routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// CORS configuration
const frontendURL = process.env.FRONTEND_URL;
if (frontendURL) {
  app.use(cors({ origin: frontendURL }));
  console.log(`CORS enabled for origin: ${frontendURL}`);
} else {
  console.warn('FRONTEND_URL not set. CORS middleware not configured with a specific origin. Same-origin policies will apply.');
}

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Backend is running');
});

app.use('/api/auth', authRoutes);
app.use('/api/suggestions', suggestionRoutes);
app.use('/api/admin/suggestions', adminSuggestionRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
