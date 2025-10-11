import express, { NextFunction, Request, Response } from 'express';
import pollRoutes from './routes/pollRouter';
import authRouter from './routes/authRouter';

const server = express();

// Middlewares
server.use(express.json());

// Routes
server.use('/polls', pollRoutes);
server.use('/auth', authRouter);

// Start
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`API on :${PORT}`);
});


server.use((err:Error, req:Request, res:Response, next:NextFunction) => {
  console.error('ERROR MW:', err);
  res.status(500).json({ error: 'server error' });
});