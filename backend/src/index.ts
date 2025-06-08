import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import suggestionRoutes from './routes/suggestion.routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Backend is running');
});

app.use('/api/auth', authRoutes);
app.use('/api/suggestions', suggestionRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
