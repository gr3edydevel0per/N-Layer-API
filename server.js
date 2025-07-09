const app = require('./app');
const config = require('./config/configHandler');
const logger = require('./utils/logger');
const db = require('./config/databaseHandler');

// Database connection and sync
const connectDatabase = async () => {
  try {
    await db.sequelize.authenticate();
    logger.info('Database connection established successfully');
    
    // Sync database (creates tables if they don't exist)
    if (process.env.NODE_ENV === 'development') {
      await db.sequelize.sync({ alter: true });
      logger.info('Database synced successfully');
    }
  } catch (error) {
    logger.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

// Start server
const startServer = async () => {
  try {
    await connectDatabase();
    
    const server = app.listen(config.port, config.host, () => {
      logger.info(`Server running on ${config.host}:${config.port} in ${process.env.NODE_ENV || 'development'} mode`);
    });

    // Graceful shutdown
    const gracefulShutdown = (signal) => {
      logger.info(`Received ${signal}. Starting graceful shutdown...`);
      
      server.close(async () => {
        logger.info('HTTP server closed');
        
        try {
          await db.sequelize.close();
          logger.info('Database connection closed');
          process.exit(0);
        } catch (error) {
          logger.error('Error during database shutdown:', error);
          process.exit(1);
        }
      });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();