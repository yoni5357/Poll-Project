import express from 'express';
import cors from 'cors';
import pollRoutes from './routes/pollRouter';

const server = express();

// Middlewares
server.use(cors());
server.use(express.json());

// Routes
server.use('/polls', pollRoutes);

// Start
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`API on :${PORT}`);
});
