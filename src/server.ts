import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import config from './config';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import studentRoutes from './routes/student';
import lecturerRoutes from './routes/admin';
import adminRoutes from './routes/admin-management';
import mlRoutes from './routes/ml';
import predictionRoutes from './routes/predictions';
import reportRoutes from './routes/reports';
import { errorHandler } from './middleware/error-handler';

const app = express();

app.use(helmet());
app.use(compression());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: config.frontendUrl, credentials: true }));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 120 });
app.use(limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/lecturer', lecturerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ml', mlRoutes);
app.use('/api/predictions', predictionRoutes);
app.use('/api/reports', reportRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok', uptime: process.uptime() }));

app.use(errorHandler);

console.log('Using MONGO_URI:', config.mongoUri);

mongoose.connect(config.mongoUri).then(() => {
  app.listen(config.port, () => {
    // eslint-disable-next-line no-console
    console.log(`Backend server running on port ${config.port}`);
  });
}).catch((error) => {
  // eslint-disable-next-line no-console
  console.error('MongoDB connection error', error);
  process.exit(1);
});
