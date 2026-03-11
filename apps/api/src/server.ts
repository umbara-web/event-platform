import app from './app.js';
import config from './configs/index.js';
import { connectDatabase, disconnectDatabase } from './configs/database.js';
import { initializeScheduler } from './jobs/scheduler.js';
import emailTransporter from './configs/email.js';

const startServer = async (): Promise<void> => {
  try {
    // Connect to database
    await connectDatabase();

    // Verify email transporter
    await emailTransporter.verifyConnection();

    // Initialize scheduled jobs
    initializeScheduler();

    // Start server
    const server = app.listen(config.port, () => {
      console.log(`
╔══════════════════════════════════════════════════════════════════════════════════╗
║                                                                                  ║
║   🚀 ${config.appName}                                                          ║ ║                                                                                  ║
║   Server is running on port ${config.port}                                       ║
║                                                                                  ║
║   Environment: ${config.nodeEnv}                                                 ║
║                                                                                  ║
║   API Version: ${config.apiVersion}                                              ║
║                                                                                  ║
║   API URL: <http://localhost>:${config.port}/api/${config.apiVersion}            ║
║   Health:  <http://localhost>:${config.port}/api/${config.apiVersion}/health     ║
║                                                                                  ║
╚══════════════════════════════════════════════════════════════════════════════════╝
      `);
    });

    // Graceful shutdown
    const shutdown = async (signal: string): Promise<void> => {
      console.log(`\\n${signal} received. Shutting down gracefully...`);

      server.close(async () => {
        console.log('HTTP server closed');
        await disconnectDatabase();
        process.exit(0);
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        console.error(
          'Could not close connections in time, forcefully shutting down'
        );
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
