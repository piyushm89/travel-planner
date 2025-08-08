import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import authRoutes from './src/routes/auth.js';
import tripRoutes from './src/routes/trips.js';

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);

const PORT = process.env.PORT || 4000;
mongoose.connect(process.env.MONGODB_URI).then(() => {
  app.listen(PORT, () => console.log(`API on :${PORT}`));
}).catch(err => {
  console.error('Mongo error', err);
  process.exit(1);
});
