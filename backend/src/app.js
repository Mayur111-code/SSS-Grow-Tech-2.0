import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
import routes from './routes/index.js';
import { errorConverter, errorHandler } from './middlewares/error.middleware.js';
import notFound from './middlewares/notFound.js';
import { apiLimiter } from './middlewares/rateLimiter.js';

dotenv.config();

const app = express();

app.set('trust proxy', 1);

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

const corsOrigin = process.env.CLIENT_URL || 'http://localhost:3000';
const corsOptions = {
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    const allowed = corsOrigin.split(',').map((o) => o.trim());
    if (allowed.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));

app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'SSS Grow Tech API is healthy', timestamp: new Date().toISOString() });
});

app.use('/api/v1', apiLimiter, routes);

app.use(notFound);
app.use(errorConverter);
app.use(errorHandler);

export default app;
