import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './config/database.js';
import { seedAdmin } from '../scripts/seed.js';
import { initDefaultSettings } from './controllers/settings.controller.js';

dotenv.config();

const PORT = Number(process.env.PORT) || 5000;

process.on('uncaughtException', (err) => {
  // eslint-disable-next-line no-console
  console.error('Uncaught Exception:', err.message);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  // eslint-disable-next-line no-console
  console.error('Unhandled Rejection:', reason);
  process.exit(1);
});

const startServer = async () => {
  try {
    await connectDB();
    await initDefaultSettings();
    await seedAdmin();

    const server = app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`API running in ${process.env.NODE_ENV || 'development'} mode on http://localhost:${PORT}`);
    });

    const shutdown = (signal) => {
      // eslint-disable-next-line no-console
      console.log(`${signal} received. Shutting down gracefully...`);
      server.close(() => {
        process.exit(0);
      });
      setTimeout(() => process.exit(1), 10000).unref();
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
