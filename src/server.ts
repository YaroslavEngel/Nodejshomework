import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import postRouter from './transport/routers/post.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/', postRouter);

app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`forum-api is running on http://localhost:${PORT}`);
});